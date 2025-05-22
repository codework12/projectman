import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

export async function getDoctors() {
  try {
    const data = await db.doctor.findMany();

    return { success: true, data, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
export async function getDoctorDashboardStats() {
  try {
    const { userId } = await auth();

    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];

    const [totalPatient, appointments, doctors] = await Promise.all([
      db.patient.count(),
      db.appointment.findMany({
        where: { doctor_id: userId! },
        include: {
          patient: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              gender: true,
              date_of_birth: true,
              colorCode: true,
              img: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              img: true,
              colorCode: true,
            },
          },
        },
        orderBy: { appointment_date: "desc" },
      }),
      db.doctor.findMany({
        where: {
          working_days: {
            some: { day: { equals: today, mode: "insensitive" } },
          },
        },
        select: {
          id: true,
          name: true,
          specialization: true,
          img: true,
          colorCode: true,
          working_days: true,
        },
        take: 5,
      }),
    ]);

    // Get all appointments for this doctor
    const allAppointments = await db.appointment.findMany({
      where: { doctor_id: userId! },
      select: { status: true }
    });

    // Count appointments by status
    const appointmentCounts = {
      PENDING: allAppointments.filter(a => a.status === 'PENDING').length,
      SCHEDULED: allAppointments.filter(a => a.status === 'SCHEDULED').length,
      COMPLETED: allAppointments.filter(a => a.status === 'COMPLETED').length,
      CANCELLED: allAppointments.filter(a => a.status === 'CANCELLED').length,
    };

    // Calculate total active appointments (SCHEDULED + COMPLETED)
    const totalActiveAppointments = appointmentCounts.SCHEDULED + appointmentCounts.COMPLETED;

    const { monthlyData } = await processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);

    return {
      totalPatient,
      appointmentCounts,
      last5Records,
      availableDoctors: doctors,
      totalAppointment: totalActiveAppointments,
      monthlyData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getDoctorById(id: string) {
  try {
    const [doctor, totalAppointment] = await Promise.all([
      db.doctor.findUnique({
        where: { id },
        include: {
          working_days: true,
          appointments: {
            include: {
              patient: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  gender: true,
                  img: true,
                  colorCode: true,
                },
              },
              doctor: {
                select: {
                  name: true,
                  specialization: true,
                  img: true,
                  colorCode: true,
                },
              },
            },
            orderBy: { appointment_date: "desc" },
            take: 10,
          },
        },
      }),
      db.appointment.count({
        where: { doctor_id: id },
      }),
    ]);

    return { data: doctor, totalAppointment };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getRatingById(id: string) {
  try {
    const data = await db.rating.findMany({
      where: { staff_id: id },
      include: {
        patient: { select: { last_name: true, first_name: true } },
      },
    });

    const totalRatings = data?.length;
    const sumRatings = data?.reduce((sum, el) => sum + el.rating, 0);

    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    const formattedRatings = (Math.round(averageRating * 10) / 10).toFixed(1);

    return {
      totalRatings,
      averageRating: formattedRatings,
      ratings: data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

// Helper to fetch all Clerk users (handles pagination)
async function getAllClerkUsers(client: any) {
  let users: any[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const res = await client.users.getUserList({ limit, offset });
    users = users.concat(res.data);
    if (res.data.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }
  return users;
}

export async function getAllDoctors({
  page,
  limit,
  search,
}: {
  page: number | string;
  limit?: number | string;
  search?: string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const whereClause = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { specialization: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    // Get all doctors from Clerk for live status counts (handle pagination)
    const client = await clerkClient();
    const allClerkUsers = await getAllClerkUsers(client);
    const doctorUsers = allClerkUsers.filter(user => user.publicMetadata?.role === 'doctor');
    const totalPending = doctorUsers.filter(user => user.publicMetadata?.status === 'pending').length;
    const totalApproved = doctorUsers.filter(user => user.publicMetadata?.status === 'approved').length;
    const totalRejected = doctorUsers.filter(user => user.publicMetadata?.status === 'rejected').length;

    // Get paginated doctors from database
    const [doctors, totalRecords] = await Promise.all([
      db.doctor.findMany({
        where: whereClause,
        include: { 
          working_days: true,
          appointments: {
            select: {
              id: true,
              status: true
            }
          }
        },
        skip: SKIP,
        take: LIMIT,
        orderBy: {
          created_at: 'desc'
        }
      }),
      db.doctor.count({
        where: whereClause
      })
    ]);

    // Get Clerk users for the paginated doctors
    const clerkUsers = await client.users.getUserList({ 
      userId: doctors.map(d => d.id) 
    });

    const formattedDoctors = doctors.map(doctor => {
      const clerkUser = clerkUsers.data.find(u => u.id === doctor.id);
      return {
        id: doctor.id,
        fullName: doctor.name,
        specialization: doctor.specialization,
        licenseNumber: doctor.license_number,
        email: doctor.email,
        submittedAt: doctor.created_at ? new Date(doctor.created_at).toISOString() : new Date().toISOString(),
        status: clerkUser?.publicMetadata?.status || 'pending',
        workingDays: doctor.working_days || [],
        totalAppointments: doctor.appointments?.length || 0
      };
    });

    return {
      success: true,
      data: formattedDoctors,
      totalRecords,
      totalPending,
      totalApproved,
      totalRejected,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGE_NUMBER,
      status: 200
    };
  } catch (error) {
    console.error('Error in getAllDoctors:', error);
    return { 
      success: false, 
      message: "Internal Server Error", 
      status: 500 
    };
  }
}

export async function createNewDoctor(data: any, did: string) {
  try {
    // Use doctorFormSchema if available, otherwise skip validation
    // Replace with your actual schema import if needed
    // import { doctorFormSchema } from "@/lib/schema";
    // const validateData = doctorFormSchema.safeParse(data);
    // if (!validateData.success) {
    //   return { success: false, error: true, msg: "Provide all required fields" };
    // }
    // const doctorData = validateData.data;
    const doctorData = data;
    let doctor_id = did;

    const password = doctorData.phone + 'A!'; // Ensure password meets Clerk requirements
    console.log("Creating Clerk user with:", {
      email: doctorData.email,
      password,
      firstName: doctorData.name,
      lastName: doctorData.name,
    });
    const client = await clerkClient();
    let user;
    // If userId is not provided, try to find user by email
    if (!doctorData.userId) {
      const foundUsers = await client.users.getUserList({ emailAddress: [doctorData.email] });
      if (foundUsers.data.length > 0) {
        doctorData.userId = foundUsers.data[0].id;
      }
    }
    if (doctorData.userId) {
      // Update existing Clerk user
      console.log("Updating existing Clerk user:", doctorData.userId);
      user = await client.users.updateUser(doctorData.userId, {
        firstName: doctorData.name,
        lastName: doctorData.name,
        publicMetadata: { role: "doctor", status: "pending" },
      });
      doctor_id = user.id;
    } else {
      // Create new Clerk user
      console.log("Creating new Clerk user with email:", doctorData.email);
      user = await client.users.createUser({
        emailAddress: [doctorData.email],
        password,
        firstName: doctorData.name,
        lastName: doctorData.name,
        publicMetadata: { role: "doctor", status: "pending" },
      });
      doctor_id = user.id;
    }

    // Prepare doctor data for DB (only allowed fields)
    const doctorDbData = {
      id: doctor_id,
      email: doctorData.email,
      name: doctorData.name,
      specialization: doctorData.specialization,
      license_number: doctorData.license_number,
      phone: doctorData.phone,
      address: doctorData.address,
      department: doctorData.department,
      type: doctorData.type,
      city: doctorData.city,
      state: doctorData.state,
      zip: doctorData.zip,
      npi_number: doctorData.npi_number,
      years_in_practice: doctorData.years_in_practice,
      // add any other fields your model expects
    };
    console.log("Creating Doctor in DB with:", doctorDbData);
    await db.doctor.create({
      data: doctorDbData,
    });

    return { success: true, error: false, msg: "Doctor created successfully" };
  } catch (error: any) {
    console.error("Full error object:", error);
    if (error && error.errors) {
      try {
        // This will print the actual error details from Clerk
        console.error("Clerk errors:", JSON.stringify(error.errors, null, 2));
      } catch (e) {
        console.error("Clerk errors (raw):", error.errors);
      }
    }
    return { success: false, error: true, msg: error?.message || (error.errors && JSON.stringify(error.errors)) };
  }
}
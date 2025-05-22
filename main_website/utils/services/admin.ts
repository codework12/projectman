import db from "@/lib/db";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

export async function getAdminDashboardStats() {
  try {
    console.log('Starting getAdminDashboardStats...');
    
    // Test database connection first
    try {
      await db.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      throw new Error('Database connection failed: ' + (dbError instanceof Error ? dbError.message : 'Unknown error'));
    }

    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];
    console.log('Today:', today);

    console.log('Fetching data from database...');
    const [totalPatient, totalDoctors, appointments, doctors] =
      await Promise.all([
        db.patient.count().catch(err => {
          console.error('Error counting patients:', err);
          return 0;
        }),
        db.doctor.count().catch(err => {
          console.error('Error counting doctors:', err);
          return 0;
        }),
        db.appointment.findMany({
          include: {
            patient: {
              select: {
                id: true,
                last_name: true,
                first_name: true,
                img: true,
                colorCode: true,
                gender: true,
                date_of_birth: true,
              },
            },
            doctor: {
              select: {
                name: true,
                img: true,
                colorCode: true,
                specialization: true,
              },
            },
          },
          orderBy: { appointment_date: "desc" },
        }).catch(err => {
          console.error('Error fetching appointments:', err);
          return [];
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
          },
          take: 5,
        }).catch(err => {
          console.error('Error fetching doctors:', err);
          return [];
        }),
      ]);

    console.log('Data fetched successfully:', {
      totalPatient,
      totalDoctors,
      appointmentsCount: appointments?.length,
      doctorsCount: doctors?.length
    });

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    const last5Records = appointments.slice(0, 5);

    const response = {
      success: true,
      totalPatient,
      totalDoctors,
      appointmentCounts,
      availableDoctors: doctors,
      monthlyData,
      last5Records,
      totalAppointments: appointments.length,
      status: 200,
    };

    console.log('Returning response:', response);
    return response;
  } catch (error) {
    console.error('Admin Dashboard Stats Error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return { 
      error: true, 
      message: "Something went wrong",
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    try {
      await db.$disconnect();
    } catch (err) {
      console.error('Error disconnecting from database:', err);
    }
  }
}

export async function getServices() {
  try {
    const data = await db.services.findMany({
      orderBy: { service_name: "asc" },
    });

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        status: 404,
        data: [],
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
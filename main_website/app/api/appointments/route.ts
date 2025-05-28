import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const doctorId = searchParams.get("doctorId");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Build the where clause based on the parameters
    const where: any = {};
    if (patientId) {
      where.patient_id = patientId;
    } else if (doctorId) {
      where.doctor_id = doctorId;
    } else {
      // If no specific ID is provided, default to the authenticated user's appointments
      where.patient_id = userId;
    }

    const appointments = await db.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            first_name: true,
            last_name: true,
            img: true,
          },
        },
        doctor: {
          select: {
            name: true,
            img: true,
          },
        },
      },
      orderBy: {
        appointment_date: 'desc',
      },
    });

    // Ensure 'time' is included in the response
    const appointmentsWithTime = appointments.map((appt: any) => ({
      ...appt,
      time: appt.time,
    }));

    return NextResponse.json({ 
      success: true, 
      data: appointmentsWithTime 
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
} 
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const { userId } = await auth();

    if (!patientId && !userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const appointments = await db.appointment.findMany({
      where: { 
        patient_id: patientId ? patientId : userId!,
      },
      include: {
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

    return NextResponse.json({ 
      success: true, 
      data: appointments 
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
} 
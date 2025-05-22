import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id;
    if (!appointmentId) {
      return NextResponse.json({ success: false, message: "Appointment ID required" }, { status: 400 });
    }
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: { select: { name: true, img: true } },
        patient: { select: { first_name: true, last_name: true, img: true, date_of_birth: true, phone: true, address: true } },
      },
    });
    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch appointment" }, { status: 500 });
  }
} 
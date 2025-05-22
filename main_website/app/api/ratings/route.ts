import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const { userId } = await auth();

    const data = await db.rating.findMany({
      take: 10,
      where: { patient_id: patientId ? patientId : userId! },
      include: { patient: { select: { last_name: true, first_name: true } } },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
} 
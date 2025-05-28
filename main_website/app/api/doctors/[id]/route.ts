import { NextResponse } from 'next/server';
import { getDoctorById } from '@/utils/services/doctor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const result = await getDoctorById(id);
    if (!result || !result.data) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error fetching doctor by id:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

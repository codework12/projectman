import { NextResponse } from 'next/server';
import { createNewDoctor } from '@/utils/services/doctor';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await createNewDoctor(data, 'new-doctor');
    if (!result.success) {
      return NextResponse.json({ error: result.msg }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to register doctor' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { updateDoctor } from '@/utils/services/doctor';
import { auth } from '@clerk/nextjs/server';

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    if (data.userId !== userId) {
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
    }
    const result = await updateDoctor(data, userId);
    if (!result.success) {
      return NextResponse.json({ error: result.msg }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Doctor update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update doctor' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET /api/reviews?testId=123
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const testId = searchParams.get('testId');
  if (!testId) {
    return NextResponse.json({ error: 'Missing testId' }, { status: 400 });
  }
  const reviews = await prisma.review.findMany({
    where: { testId: Number(testId) },
    include: {
      patient: {
        select: { first_name: true, last_name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  // Anonymize patient name (e.g., John D.)
  const formatted = reviews.map(r => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    patientName: r.patient ? `${r.patient.first_name} ${r.patient.last_name?.charAt(0) || ''}.` : 'Anonymous',
  }));
  return NextResponse.json(formatted);
}

// POST /api/reviews
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { testId, rating, comment } = body;
  if (!testId || !rating) {
    return NextResponse.json({ error: 'Missing testId or rating' }, { status: 400 });
  }
  // Find patient
  const patient = await prisma.patient.findFirst({ where: { id: userId } });
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }
  // Only allow review if patient has completed this test
  const completedTest = await prisma.testResult.findFirst({
    where: {
      testId: Number(testId),
      status: 'COMPLETED',
      order: { patientId: patient.id },
    },
  });
  if (!completedTest) {
    return NextResponse.json({ error: 'You can only review completed tests.' }, { status: 403 });
  }
  // Only one review per patient per test
  const existing = await prisma.review.findFirst({
    where: { patientId: patient.id, testId: Number(testId) },
  });
  if (existing) {
    return NextResponse.json({ error: 'You have already reviewed this test.' }, { status: 409 });
  }
  // Create review
  const review = await prisma.review.create({
    data: {
      patientId: patient.id,
      testId: Number(testId),
      rating,
      comment,
    },
  });
  return NextResponse.json(review);
} 
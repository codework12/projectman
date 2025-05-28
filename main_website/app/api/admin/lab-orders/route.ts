import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify if the user is an admin
    const user = await prisma.patient.findFirst({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all orders with necessary relations
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            test: true
          }
        },
        results: {
          include: {
            test: true
          }
        }
      },
      orderBy: { orderDate: 'desc' },
    });

    // Transform the data to match the expected format
    const transformedOrders = orders.map(order => ({
      id: order.id.toString(),
      orderNumber: order.orderNumber,
      orderDate: order.orderDate.toISOString(),
      status: order.status.toLowerCase(),
      tests: order.orderItems.map(item => ({
        test: {
          id: item.test.id.toString(),
          name: item.test.name,
          description: item.test.description || '',
          code: item.testCode || '',
          price: item.test.price,
          category: item.testDescription || ''
        },
        quantity: item.quantity
      })),
      results: order.results.map(result => ({
        testId: result.test.id.toString(),
        resultValue: result.resultValue,
        normalRange: result.normalRange,
        unit: result.unit,
        status: result.status.toLowerCase(),
        reviewed: result.reviewed,
        fileAttachment: result.fileAttachment
      })),
      userEmail: order.patientEmail,
      userName: `${order.patientFirstName} ${order.patientLastName}`,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus?.toLowerCase(),
      paymentMethod: order.paymentMethod,
      paymentDate: order.paymentDate?.toISOString(),
      transactionId: order.transactionId
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error("[ADMIN_LAB_ORDERS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
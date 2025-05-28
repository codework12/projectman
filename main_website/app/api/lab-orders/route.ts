import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

interface OrderWithRelations {
  id: number;
  orderNumber: string;
  orderDate: Date;
  status: string;
  orderItems: Array<{
    id: number;
    testId: number;
    quantity: number;
    price: number;
    testName: string;
    testCode: string | null;
    testDescription: string | null;
    testPrice: number;
    test: {
      id: number;
      name: string;
      description: string | null;
      price: number;
    };
  }>;
  results: Array<{
    id: number;
    testId: number;
    resultValue: string | null;
    normalRange: string | null;
    unit: string | null;
    status: string;
    reviewed: boolean;
    fileAttachment: any;
    test: {
      id: number;
      name: string;
      description: string | null;
      price: number;
    };
  }>;
  patientEmail: string;
  patientFirstName: string;
  patientLastName: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate: Date;
  transactionId: string | null;
}

export async function POST(req: Request) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log('Received body:', body);
    const {
      patientInfo,
      tests,
      totalAmount,
      paymentMethod,
      transactionId
    } = body;

    if (!patientInfo) {
      return NextResponse.json({ error: 'Missing patientInfo' }, { status: 400 });
    }

    // Log test IDs for debugging
    console.log('Test IDs:', tests.map((test: any) => test.test.id));

    // Verify test IDs exist
    const testIds = tests.map((test: any) => parseInt(test.test.id));
    const existingTests = await prisma.labTest.findMany({
      where: {
        id: {
          in: testIds
        }
      }
    });

    console.log('Existing tests:', existingTests);
    console.log('Test IDs being checked:', testIds);

    if (existingTests.length !== testIds.length) {
      const missingTestIds = testIds.filter(
        (id: number) => !existingTests.some(test => test.id === id)
      );
      console.log('Missing test IDs:', missingTestIds);
      return NextResponse.json(
        { 
          error: 'One or more test IDs are invalid',
          missingTestIds 
        },
        { status: 400 }
      );
    }

    // Generate a unique order number
    const orderNumber = `LAB-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create the order with its items and patient info
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'SCHEDULED',
        totalAmount,
        paymentStatus: 'PAID',
        paymentMethod: "CARD",
        paymentDate: new Date(),
        transactionId,
        patientId: clerkUserId,
        orderItems: {
          create: tests.map((test: any) => ({
            testId: parseInt(test.test.id),
            quantity: test.quantity,
            price: test.test.price,
            testName: test.test.name,
            testCode: test.test.code,
            testDescription: test.test.description,
            testPrice: test.test.price,
          }))
        },
        results: {
          create: tests.map((test: any) => ({
            testId: parseInt(test.test.id),
            status: 'SCHEDULED' as const
          }))
        },
        patientFirstName: patientInfo.firstName,
        patientLastName: patientInfo.lastName,
        patientEmail: patientInfo.email,
        patientPhone: patientInfo.phone,
        patientDob: new Date(patientInfo.dob),
        patientGender: patientInfo.gender,
        patientAddress: patientInfo.address,
        patientCity: patientInfo.city,
        patientState: patientInfo.state,
        patientZipCode: patientInfo.zipCode,
      },
      include: {
        orderItems: true,
        results: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating lab order:', error);
    return NextResponse.json(
      { error: 'Failed to create lab order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    console.log("[LAB_ORDERS_GET] Auth userId:", userId);
    
    if (!userId) {
      console.log("[LAB_ORDERS_GET] No userId found in auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only this patient's orders with all necessary relations
    const orders = await prisma.order.findMany({
      where: { patientId: userId },
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
    console.log("[LAB_ORDERS_GET] Found orders count:", orders.length);
    console.log("[LAB_ORDERS_GET] Raw orders:", orders);

    // Transform the data to match the expected format
    const transformedOrders = orders.map((order: OrderWithRelations) => ({
      id: order.id.toString(),
      orderNumber: order.orderNumber,
      orderDate: order.orderDate.toISOString(),
      status: order.status,
      orderItems: order.orderItems,
      tests: order.orderItems.map((item) => ({
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
      results: order.results.map((result) => ({
        testId: result.test.id.toString(),
        resultValue: result.resultValue,
        normalRange: result.normalRange,
        unit: result.unit,
        status: result.status.toUpperCase(),
        reviewed: result.reviewed,
        fileAttachment: result.fileAttachment,
        test: {
          id: result.test.id.toString(),
          name: result.test.name,
          description: result.test.description || ''
        }
      })),
      userEmail: order.patientEmail,
      userName: `${order.patientFirstName} ${order.patientLastName}`,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus?.toLowerCase(),
      paymentMethod: order.paymentMethod,
      paymentDate: order.paymentDate?.toISOString(),
      transactionId: order.transactionId
    }));

    console.log("[LAB_ORDERS_GET] Transformed orders:", transformedOrders);
    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error("[LAB_ORDERS_GET] Error details:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
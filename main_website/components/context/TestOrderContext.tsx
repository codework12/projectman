"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LabTest } from '@/components/models/LabTest';

export interface TestOrder {
  id: string;
  tests: {
    test: LabTest;
    quantity: number;
  }[];
  orderNumber: string;
  orderDate: string;
  status: 'processing' | 'scheduled' | 'completed' | 'cancelled';
  scheduledDate?: string;
  scheduledTime?: string;
  location?: string;
  results?: {
    testId: string;
    resultValue?: string;
    normalRange?: string;
    unit?: string;
    status: 'pending' | 'processing' | 'completed';
    reviewed?: boolean;
    fileAttachment?: {
      name: string;
      type: string;
      url: string;
    };
  }[];
  userEmail?: string;
  userName?: string;
  // Payment-related fields
  totalAmount?: number;
  paymentStatus?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentDate?: string;
  transactionId?: string;
  // Insurance-related fields
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    primary?: boolean;
    subscriberName?: string;
    subscriberDob?: string;
    relationship?: string;
  };
}

interface TestOrderContextType {
  orders: TestOrder[];
  addOrder: (order: Omit<TestOrder, 'id'>) => TestOrder;
  getOrderById: (id: string) => TestOrder | undefined;
  updateOrderStatus: (id: string, status: TestOrder['status']) => void;
  addReview: (orderId: string, testId: string, rating: number, comment: string) => void;
  // Admin functions
  updateTestResult: (
    orderId: string, 
    testId: string, 
    resultData: { 
      resultValue?: string, 
      normalRange?: string, 
      unit?: string, 
      status: 'pending' | 'processing' | 'completed',
      fileAttachment?: {
        name: string;
        type: string;
        url: string;
      }
    }
  ) => void;
  updateScheduledAppointment: (
    orderId: string,
    scheduledDate: string,
    scheduledTime: string,
    location: string
  ) => void;
  updatePaymentInfo: (
    orderId: string,
    paymentData: {
      totalAmount?: number,
      paymentStatus?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded',
      paymentMethod?: string,
      paymentDate?: string,
      transactionId?: string
    }
  ) => void;
  getAllUserOrders: () => TestOrder[];
}

const TestOrderContext = createContext<TestOrderContextType | undefined>(undefined);

// Next.js safe way to handle localStorage
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export function TestOrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<TestOrder[]>(() => {
    // Mock data for demonstration - in a real app, this would be loaded from an API
    const mockOrder: TestOrder = {
      id: 'order-123456',
      orderNumber: 'LAB1234',
      orderDate: '2025-05-10T14:30:00Z',
      status: 'completed',
      tests: [
        {
          test: {
            id: 'test-cbc',
            name: 'Complete Blood Count (CBC)',
            price: 49.99,
            description: 'Measures several components and features of your blood.',
            category: 'blood',
            code: 'CBC001'
          },
          quantity: 1
        }
      ],
      scheduledDate: '2025-05-12',
      scheduledTime: '10:30 AM',
      location: 'Downtown Medical Lab',
      results: [
        {
          testId: 'test-cbc',
          resultValue: 'Normal',
          normalRange: '4.5-11.0 10^9/L',
          unit: '10^9/L',
          status: 'completed'
        }
      ],
      userEmail: 'patient@example.com',
      userName: 'John Doe',
      totalAmount: 49.99,
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      paymentDate: '2025-05-10',
      transactionId: 'TXN123456'
    };

    // Add another mock order for a different user
    const mockOrder2: TestOrder = {
      id: 'order-789012',
      orderNumber: 'LAB5678',
      orderDate: '2025-05-15T09:15:00Z',
      status: 'processing',
      tests: [
        {
          test: {
            id: 'test-gluc',
            name: 'Glucose Test',
            price: 29.99,
            description: 'Measures the amount of glucose in your blood.',
            category: 'blood',
            code: 'GLUC001'
          },
          quantity: 1
        }
      ],
      userEmail: 'patient2@example.com',
      userName: 'Jane Smith',
      totalAmount: 29.99,
      paymentStatus: 'pending'
    };
    
    // Add a third mock order with more data for variety
    const mockOrder3: TestOrder = {
      id: 'order-345678',
      orderNumber: 'LAB7890',
      orderDate: '2025-05-17T11:20:00Z',
      status: 'scheduled',
      tests: [
        {
          test: {
            id: 'test-lipid',
            name: 'Lipid Panel',
            price: 59.99,
            description: 'Measures cholesterol and triglycerides in your blood.',
            category: 'blood',
            code: 'LIPID001'
          },
          quantity: 1
        },
        {
          test: {
            id: 'test-thyroid',
            name: 'Thyroid Panel',
            price: 89.99,
            description: 'Measures thyroid hormone levels in your blood.',
            category: 'blood',
            code: 'THYR001'
          },
          quantity: 1
        }
      ],
      userEmail: 'patient3@example.com',
      userName: 'Robert Johnson',
      scheduledDate: new Date().toISOString().split('T')[0], // Today
      scheduledTime: '14:00 PM',
      location: 'Central Medical Lab',
      totalAmount: 149.98,
      paymentStatus: 'paid',
      paymentMethod: 'insurance',
      paymentDate: '2025-05-17',
      transactionId: 'TXN789012'
    };

    // Next.js safe way to access localStorage
    const savedOrders = getLocalStorage('testOrders');
    return savedOrders ? JSON.parse(savedOrders) : [mockOrder, mockOrder2, mockOrder3];
  });

  // Save orders to localStorage whenever they change (Next.js safe)
  useEffect(() => {
    setLocalStorage('testOrders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Omit<TestOrder, 'id'>) => {
    const newOrder = {
      ...order,
      id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (id: string, status: TestOrder['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const addReview = (orderId: string, testId: string, rating: number, comment: string) => {
    // In a real app, we would send the review to a backend API
    console.log('Adding review:', { orderId, testId, rating, comment });
    
    // For now, just mark the test as reviewed
    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          const updatedResults = order.results?.map(result => 
            result.testId === testId ? { ...result, reviewed: true } : result
          );
          return { ...order, results: updatedResults };
        }
        return order;
      })
    );
  };

  // Admin functions
  const updateTestResult = (
    orderId: string, 
    testId: string, 
    resultData: { 
      resultValue?: string, 
      normalRange?: string, 
      unit?: string, 
      status: 'pending' | 'processing' | 'completed',
      fileAttachment?: {
        name: string;
        type: string;
        url: string;
      }
    }
  ) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          // Check if results already exist
          if (order.results) {
            // Update existing result
            const updatedResults = order.results.map(result => 
              result.testId === testId 
                ? { ...result, ...resultData } 
                : result
            );
            return { ...order, results: updatedResults };
          } else {
            // Create new results array
            const newResult = {
              testId,
              ...resultData
            };
            return { ...order, results: [newResult] };
          }
        }
        return order;
      })
    );
  };

  const updateScheduledAppointment = (
    orderId: string,
    scheduledDate: string,
    scheduledTime: string,
    location: string
  ) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              scheduledDate, 
              scheduledTime, 
              location,
              status: 'scheduled' as TestOrder['status']
            } 
          : order
      )
    );
  };
  
  // New function to update payment information
  const updatePaymentInfo = (
    orderId: string,
    paymentData: {
      totalAmount?: number,
      paymentStatus?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded',
      paymentMethod?: string,
      paymentDate?: string,
      transactionId?: string
    }
  ) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, ...paymentData } 
          : order
      )
    );
  };

  const getAllUserOrders = () => {
    return orders;
  };

  return (
    <TestOrderContext.Provider value={{
      orders,
      addOrder,
      getOrderById,
      updateOrderStatus,
      addReview,
      updateTestResult,
      updateScheduledAppointment,
      updatePaymentInfo,
      getAllUserOrders
    }}>
      {children}
    </TestOrderContext.Provider>
  );
}

export function useTestOrders() {
  const context = useContext(TestOrderContext);
  if (context === undefined) {
    throw new Error('useTestOrders must be used within a TestOrderProvider');
  }
  return context;
}

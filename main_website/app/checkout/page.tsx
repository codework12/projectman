"use client"
import React, { useState } from 'react';
import { useCart } from '@/components/context/CartContext';
import { useTestOrders } from '@/components/context/TestOrderContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DRAW_FEE } from '@/components/data/labTests';
import PatientInfoForm from './PatientInfoForm';
import SelfPayment from './SelfPayment';
import OrderSummary from './OrderSummary';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, X, User, FileText } from 'lucide-react';

type PatientInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

const Checkout = () => {
  const { items, getSubtotal, getTotal, clearCart } = useCart();
  const { addOrder } = useTestOrders();
  const router = useRouter();
  const { toast } = useToast();
  
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const [isPatientInfoComplete, setIsPatientInfoComplete] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
  // Handle patient info submission
  const handlePatientInfoSubmit = (info: PatientInfo) => {
    setPatientInfo(info);
    setIsPatientInfoComplete(true);
    toast({
      title: "Information saved",
      description: "Your personal information has been saved.",
    });
  };
  
  // Handle successful payment
  const handlePaymentSuccess = (paymentId: string) => {
    try {
      // Create a new order with self-pay payment
      const orderNumber = `LAB-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = addOrder({
        orderNumber,
        orderDate: new Date().toISOString(),
        status: 'scheduled',
        tests: items,
        userEmail: patientInfo.email,
        userName: `${patientInfo.firstName} ${patientInfo.lastName}`,
        totalAmount: getTotal(),
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        paymentDate: new Date().toISOString(),
        transactionId: paymentId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      
      // Show success message
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      });
      
      // Clear cart and redirect to confirmation page
      clearCart();
      router.push(`/order-confirmation?orderId=${newOrder.id}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem processing your payment.",
      });
      setIsPaymentProcessing(false);
    }
  };
  
  // Cancel checkout and go back
  const handleCancel = () => {
    router.push('/');
  };

  // If no items in cart, show message
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-2xl w-full p-8 rounded-2xl shadow-xl bg-white/90 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2 dark:text-gray-100">
              <FileText className="text-blue-600 dark:text-blue-400" size={28} />
              Your cart is empty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-200 mb-4">You have no items in your cart.</p>
            <Button 
              onClick={() => router.push('/')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
            >
              Browse Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Form fields */}
        <div className="md:col-span-2">
          <Card className="rounded-2xl shadow-xl bg-white/90 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center gap-2 dark:text-gray-100">
                <User className="text-blue-600 dark:text-blue-400" size={28} />
                Checkout
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isPatientInfoComplete ? (
                <PatientInfoForm 
                  initialData={patientInfo} 
                  onSubmit={handlePatientInfoSubmit} 
                />
              ) : (
                <div>
                  <div className="p-4 bg-blue-50 dark:bg-neutral-900/60 rounded-lg mb-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium flex items-center gap-2 text-blue-800 dark:text-blue-200"><User size={18} /> Patient Information</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-200">
                        {patientInfo.firstName} {patientInfo.lastName}, {patientInfo.email}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsPatientInfoComplete(false)}>
                      Edit
                    </Button>
                  </div>
                  {/* Payment Method Section */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <ArrowRight size={18} /> Payment Method
                    </h3>
                    <SelfPayment 
                      amount={getTotal()} 
                      onPaymentSuccess={handlePaymentSuccess}
                      isProcessing={isPaymentProcessing}
                      setIsProcessing={setIsPaymentProcessing}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" className="px-7 py-3 text-base" onClick={handleCancel}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right column: Order summary */}
        <div>
          <OrderSummary 
            items={items} 
            subtotal={getSubtotal()} 
            drawFee={DRAW_FEE} 
            total={getTotal()}
            paymentMethod={'self-pay'}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;

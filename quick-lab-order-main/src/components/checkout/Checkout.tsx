
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTestOrders } from '@/context/TestOrderContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Shield, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DRAW_FEE } from '@/data/labTests';
import PatientInfoForm from './PatientInfoForm';
import SelfPayment from './SelfPayment';
import InsuranceForm from './InsuranceForm';
import OrderSummary from './OrderSummary';

const Checkout = () => {
  const { items, getSubtotal, getTotal, clearCart } = useCart();
  const { addOrder } = useTestOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("self-pay");
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
  
  const [insuranceInfo, setInsuranceInfo] = useState({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    primary: true,
    subscriberName: '',
    subscriberDob: '',
    relationship: 'self',
  });
  
  const [isPatientInfoComplete, setIsPatientInfoComplete] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
  // Handle patient info submission
  const handlePatientInfoSubmit = (info) => {
    setPatientInfo(info);
    setIsPatientInfoComplete(true);
    toast({
      title: "Information saved",
      description: "Your personal information has been saved.",
    });
  };
  
  // Handle insurance form submission
  const handleInsuranceSubmit = async (info) => {
    setInsuranceInfo(info);
    setIsPaymentProcessing(true);
    
    try {
      // Create a new order with insurance payment
      const orderNumber = `LAB-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = addOrder({
        orderNumber,
        orderDate: new Date().toISOString(),
        status: 'processing',
        tests: items,
        userEmail: patientInfo.email,
        userName: `${patientInfo.firstName} ${patientInfo.lastName}`,
        totalAmount: getTotal(),
        paymentStatus: 'pending',
        paymentMethod: 'insurance',
        insuranceDetails: info,
      });
      
      // Show success message
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed with insurance. You'll be notified when it's approved.",
      });
      
      // Clear cart and redirect to confirmation page
      clearCart();
      navigate('/order-confirmation', { state: { orderId: newOrder.id, insurancePending: true } });
    } catch (error) {
      console.error('Error processing insurance order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem placing your order.",
      });
      setIsPaymentProcessing(false);
    }
  };
  
  // Handle successful payment
  const handlePaymentSuccess = (paymentId) => {
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
      navigate('/order-confirmation', { state: { orderId: newOrder.id } });
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
    navigate('/');
  };

  // If no items in cart, show message
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">You have no items in your cart.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-elab-medical-blue hover:bg-blue-700"
            >
              Browse Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Form fields */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              {!isPatientInfoComplete ? (
                <PatientInfoForm 
                  initialData={patientInfo} 
                  onSubmit={handlePatientInfoSubmit} 
                />
              ) : (
                <div>
                  <div className="p-4 bg-blue-50 rounded-lg mb-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Patient Information</h3>
                      <p className="text-sm text-gray-600">
                        {patientInfo.firstName} {patientInfo.lastName}, {patientInfo.email}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsPatientInfoComplete(false)}>
                      Edit
                    </Button>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="self-pay" className="flex items-center gap-2">
                        <CreditCard size={18} />
                        Self Pay
                      </TabsTrigger>
                      <TabsTrigger value="insurance" className="flex items-center gap-2">
                        <Shield size={18} />
                        Insurance
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="self-pay">
                      <SelfPayment 
                        amount={getTotal()} 
                        onPaymentSuccess={handlePaymentSuccess}
                        isProcessing={isPaymentProcessing}
                        setIsProcessing={setIsPaymentProcessing}
                      />
                    </TabsContent>
                    
                    <TabsContent value="insurance">
                      <InsuranceForm 
                        initialData={insuranceInfo} 
                        onSubmit={handleInsuranceSubmit}
                        isProcessing={isPaymentProcessing}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleCancel}>
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
            paymentMethod={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;

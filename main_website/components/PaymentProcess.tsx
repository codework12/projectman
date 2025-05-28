import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Check, Calendar, ShieldCheck, Info, Timer, FileText, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
};

type MotionDivProps = HTMLMotionProps<"div"> & {
  className?: string;
};

const MotionDiv = motion.div as React.ComponentType<MotionDivProps>;

const PaymentProcess = () => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'paypal' | 'bank' | 'insurance'>('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState<string>('');
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [insuranceGroupNumber, setInsuranceGroupNumber] = useState<string>('');
  
  // Mock service details
  const serviceDetails = {
    name: 'Online COVID-19 Visit',
    provider: 'Dr. Naurah Gaspard, FNP-BC',
    date: 'May 24, 2025',
    time: '10:00 AM',
    duration: '30 minutes',
    price: 75.00,
    tax: 0,
    total: 75.00
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Different handling based on payment method
    if (paymentMethod === 'creditCard' || paymentMethod === 'paypal') {
      // Process immediate payment for credit card and PayPal
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Payment Successful",
          description: "Your appointment has been confirmed.",
        });
        
        // Redirect to confirmation or appointments page
        window.location.href = '/appointments';
      }, 2000);
    } else {
      // For bank transfer or insurance, just place the order without processing payment
      toast({
        title: paymentMethod === 'bank' ? "Bank Transfer Order Placed" : "Insurance Claim Submitted",
        description: paymentMethod === 'bank' 
          ? "Please complete the bank transfer to confirm your appointment." 
          : "Your insurance information has been saved. Our team will verify your coverage.",
      });
      
      // Redirect to confirmation page
      window.location.href = '/appointments';
    }
  };

  const insuranceProviders = [
    "Blue Cross Blue Shield",
    "Aetna",
    "Cigna",
    "UnitedHealthcare",
    "Medicare",
    "Medicaid",
    "Kaiser Permanente",
    "Humana",
    "Anthem",
    "Other"
  ];
  
  // Add platform fee
  const platformFee = 2.99;
  const totalWithFee = serviceDetails.total + platformFee;
  
  return (
    <MotionDiv 
      initial="hidden"
      animate="show"
      variants={container}
      className="py-8 px-2 md:px-8 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] min-h-[80vh]"
    >
      <MotionDiv variants={item} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600">Secure your appointment with a payment method</p>
      </MotionDiv>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MotionDiv variants={item}>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Method</h3>
                
                <Tabs 
                  defaultValue="creditCard" 
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'creditCard' | 'paypal' | 'bank' | 'insurance')}
                >
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger 
                      value="creditCard" 
                      className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
                    >
                      <CreditCard className="h-4 w-4 mr-2" /> Credit Card
                    </TabsTrigger>
                    <TabsTrigger 
                      value="bank" 
                      className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
                    >
                      <Building className="h-4 w-4 mr-2" /> Bank Transfer
                    </TabsTrigger>
                    <TabsTrigger 
                      value="insurance" 
                      className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
                    >
                      <FileText className="h-4 w-4 mr-2" /> Insurance
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="creditCard" className="space-y-4">
                    <form onSubmit={handlePaymentSubmit}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber" className="text-gray-700">Card Number</Label>
                          <div className="relative">
                            <Input 
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="pl-10"
                            />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate" className="text-gray-700">Expiry Date</Label>
                            <div className="relative">
                              <Input 
                                id="expiryDate"
                                placeholder="MM/YY"
                                className="pl-10"
                              />
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="cvv" className="text-gray-700">CVV</Label>
                            <Input 
                              id="cvv"
                              placeholder="123"
                              type="password"
                              maxLength={4}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="cardName" className="text-gray-700">Name on Card</Label>
                          <Input 
                            id="cardName"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center">
                        <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          Your payment information is encrypted and secure
                        </span>
                      </div>
                      
                      <div className="mt-8">
                        <Button 
                          type="submit" 
                          className="w-full bg-[#10b981] hover:bg-[#0e9e6e] text-white font-bold rounded-xl shadow-lg text-lg py-4 px-8 mt-8 transition-all duration-200"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            <span>Complete Payment</span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="bank">
                    <div className="space-y-4 p-6 border border-gray-100 rounded-lg bg-gray-50">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Bank Transfer Instructions</p>
                          <p className="text-xs text-gray-600">
                            Please use the following details to make a bank transfer. Your appointment will be placed now, and confirmed once payment is received.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 bg-white p-4 rounded-md">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-sm font-medium text-gray-600">Bank Name:</div>
                          <div className="col-span-2 text-sm text-gray-800">HealthBank National</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-sm font-medium text-gray-600">Account Name:</div>
                          <div className="col-span-2 text-sm text-gray-800">OurTopClinic Medical Services</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-sm font-medium text-gray-600">Account Number:</div>
                          <div className="col-span-2 text-sm text-gray-800">9876543210</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-sm font-medium text-gray-600">Routing Number:</div>
                          <div className="col-span-2 text-sm text-gray-800">123456789</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-sm font-medium text-gray-600">Reference:</div>
                          <div className="col-span-2 text-sm text-gray-800">
                            APPT-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center pt-2">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          After making the transfer, please email the receipt to billing@ourtopclinic.com
                        </span>
                      </div>
                      
                      <form onSubmit={handlePaymentSubmit} className="mt-6">
                        <Button 
                          type="submit" 
                          className="w-full bg-[#10b981] hover:bg-[#0e9e6e] text-white font-bold rounded-xl shadow-lg text-lg py-4 px-8 mt-8 transition-all duration-200"
                        >
                          Place Order Now
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="insurance" className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <p className="text-sm text-blue-800">
                          We'll submit a claim to your insurance provider. You may be responsible for any copay, coinsurance, or deductible amounts as determined by your insurance coverage.
                        </p>
                      </div>
                    </div>
                    
                    <form onSubmit={handlePaymentSubmit}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="insuranceProvider" className="text-gray-700">Insurance Provider</Label>
                          <Select
                            value={insuranceProvider}
                            onValueChange={setInsuranceProvider}
                          >
                            <SelectTrigger id="insuranceProvider" className="w-full">
                              <SelectValue placeholder="Select your insurance provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {insuranceProviders.map((provider) => (
                                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="policyNumber" className="text-gray-700">Policy Number</Label>
                          <Input 
                            id="policyNumber"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            placeholder="e.g. ABC123456789"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="groupNumber" className="text-gray-700">Group Number (if applicable)</Label>
                          <Input 
                            id="groupNumber"
                            value={insuranceGroupNumber}
                            onChange={(e) => setInsuranceGroupNumber(e.target.value)}
                            placeholder="e.g. G123456"
                          />
                        </div>
                        
                        <div className="flex items-center pt-2">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            Please have your insurance card ready for your appointment
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <Button 
                          type="submit" 
                          className="w-full bg-[#10b981] hover:bg-[#0e9e6e] text-white font-bold rounded-xl shadow-lg text-lg py-4 px-8 mt-8 transition-all duration-200"
                          disabled={!insuranceProvider || !policyNumber}
                        >
                          Submit Insurance Information
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
        
        <div className="md:col-span-1">
          <MotionDiv variants={item}>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Order Summary</h3>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-healthcare-primary">{serviceDetails.name}</h4>
                  <p className="text-sm text-gray-600">{serviceDetails.provider}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{serviceDetails.date} at {serviceDetails.time}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Timer className="h-4 w-4 mr-1" />
                    <span>{serviceDetails.duration}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="font-medium">${serviceDetails.price.toFixed(2)}</span>
                  </div>
                  {/* Platform Fee */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee:</span>
                    <span className="font-medium">$2.99</span>
                  </div>
                  {serviceDetails.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">${serviceDetails.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-dashed border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">Total:</span>
                      <span className="font-bold text-healthcare-primary">${totalWithFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Insurance patients: your final price may be adjusted based on your insurance coverage.</span>
                  </div>
                </div>
                
                {(paymentMethod === 'creditCard' || paymentMethod === 'paypal') && (
                  <Button 
                    onClick={handlePaymentSubmit}
                    className="w-full mt-6 bg-[#10b981] hover:bg-[#0e9e6e] text-white font-bold rounded-xl shadow-lg text-lg py-4 px-8 mt-8 transition-all duration-200"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>Pay ${totalWithFee.toFixed(2)}</span>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
      </div>
      <MotionDiv variants={item} className="mt-8 flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-50 font-bold min-w-[140px] py-4 px-8 rounded-xl shadow text-lg transition-all duration-200"
          onClick={() => {
            // Reset booking process and navigate back to Select Service step
            const event = new CustomEvent('bookingStepChange', { detail: { step: 'services' } });
            document.dispatchEvent(event);
          }}
        >
          Cancel
        </Button>
      </MotionDiv>
    </MotionDiv>
  );
};

export default PaymentProcess;

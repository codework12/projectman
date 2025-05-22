
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield } from 'lucide-react';
import { LabTest } from '@/components/models/LabTest';

interface OrderSummaryProps {
  items: { test: LabTest; quantity: number }[];
  subtotal: number;
  drawFee: number;
  total: number;
  paymentMethod: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  subtotal, 
  drawFee, 
  total,
  paymentMethod
}) => {
  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.test.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.test.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {item.test.code}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
              <p className="font-medium">${(item.test.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Draw Fee</span>
            <span>${drawFee.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Payment Method</h4>
            {paymentMethod === 'self-pay' ? (
              <div className="flex items-center">
                <CreditCard size={18} className="mr-2 text-blue-600" />
                <span>Self Pay - Credit Card</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Shield size={18} className="mr-2 text-green-600" />
                <span>Insurance</span>
              </div>
            )}
            
            {paymentMethod === 'insurance' && (
              <p className="text-sm text-gray-500 mt-2">
                Your insurance will be verified before processing. You may be responsible for a portion of the charges.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;

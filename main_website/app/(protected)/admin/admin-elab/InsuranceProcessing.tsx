
import React, { useState } from 'react';
import { useTestOrders, TestOrder } from '@/context/TestOrderContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, Search, Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InsuranceProcessingProps {
  orders: TestOrder[];
}

const InsuranceProcessing: React.FC<InsuranceProcessingProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { updatePaymentInfo, updateOrderStatus } = useTestOrders();
  const { toast } = useToast();
  
  // Filter only orders with insurance payment method and not yet approved
  const insuranceOrders = orders.filter(order => 
    order.paymentMethod === 'insurance' && 
    order.paymentStatus !== 'paid' && 
    order.status !== 'cancelled'
  );
  
  // Filter based on search term
  const filteredOrders = insuranceOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleApproveInsurance = (orderId: string) => {
    // Update payment status to paid
    updatePaymentInfo(orderId, {
      paymentStatus: 'paid',
      paymentDate: new Date().toISOString(),
    });
    
    // Update order status to scheduled
    updateOrderStatus(orderId, 'scheduled');
    
    toast({
      title: "Insurance Approved",
      description: "The insurance has been approved and the patient has been notified.",
    });
  };
  
  const handleRejectInsurance = (orderId: string) => {
    // Update payment status to failed
    updatePaymentInfo(orderId, {
      paymentStatus: 'failed',
    });
    
    // Cancel the order
    updateOrderStatus(orderId, 'cancelled');
    
    toast({
      title: "Insurance Rejected",
      description: "The insurance has been rejected and the patient has been notified.",
    });
  };
  
  if (insuranceOrders.length === 0) {
    return (
      <div className="text-center py-10">
        <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No Insurance Orders</h3>
        <p className="text-gray-500">There are no insurance orders requiring processing.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search insurance orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Insurance Provider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="text-gray-500">No insurance orders found matching your criteria</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{order.userName || 'N/A'}</TableCell>
                  <TableCell>
                    {order.insuranceDetails?.provider || 'Not specified'}
                    {order.insuranceDetails?.policyNumber && (
                      <div className="text-xs text-gray-500">
                        Policy: {order.insuranceDetails.policyNumber}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>${order.totalAmount?.toFixed(2) || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                        onClick={() => handleApproveInsurance(order.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                        onClick={() => handleRejectInsurance(order.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="text-blue-800 font-medium mb-2">Insurance Processing Guidelines</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Verify insurance policy is active and coverage applies to lab tests</li>
          <li>Check for any pre-authorization requirements</li>
          <li>Confirm patient information matches insurance records</li>
          <li>Determine if any deductibles or co-pays apply</li>
        </ul>
      </div>
    </div>
  );
};

export default InsuranceProcessing;

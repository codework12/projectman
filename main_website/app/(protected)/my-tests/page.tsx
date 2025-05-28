"use client"
import React, { useState, useEffect } from 'react';
import { useTestOrders } from '@/components/context/TestOrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';        
import { useRouter } from 'next/navigation'; 
import { FileText, Calendar, ArrowRight, FileSearch, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ElabNavbar } from "@/components/elab/ElabNavbar";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";

interface TestResult {
  id: number;
  testId: number;
  resultValue: string | null;
  normalRange: string | null;
  unit: string | null;
  status: string;
  reviewed: boolean;
  test: {
    name: string;
    description: string | null;
  };
}

interface OrderItem {
  id: number;
  testId: number;
  test: {
    name: string;
    description: string | null;
  };
  testName: string;
  testCode: string | null;
  testDescription: string | null;
  testPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate: string;
  orderDate: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientPhone: string;
  patientDob: string;
  patientGender: string;
  patientAddress: string;
  patientCity: string;
  patientState: string;
  patientZipCode: string;
  orderItems: OrderItem[];
  results: TestResult[];
}

const MyTests = () => {
  const { getAllUserOrders } = useTestOrders();
  const router = useRouter(); 
  const { toast } = useToast();
  const { userId } = useAuth();
  
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const ordersFromContext = getAllUserOrders();
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user:", userId);
        const response = await fetch("/api/lab-orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);
  
  // Filter orders based on the active tab
  const filteredOrders = orders.filter(order => {
    console.log("Filtering order:", order);
    if (activeTab === 'all') return true;
    if (activeTab === 'scheduled') {
      // Show orders that are scheduled and not completed
      const isScheduled = order.status.toUpperCase() === 'SCHEDULED';
      console.log("Order scheduled status:", isScheduled);
      return isScheduled;
    }
    if (activeTab === 'completed') {
      // Show orders that are completed
      const isCompleted = order.status.toUpperCase() === 'COMPLETED';
      console.log("Order completed status:", isCompleted);
      return isCompleted;
    }
    return true;
  });

  // Separate orders into past and upcoming
  const today = new Date();
  const pastOrders = orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    const isPast = orderDate < today && order.status.toUpperCase() === 'COMPLETED';
    console.log("Order past status:", isPast, "Date:", orderDate, "Status:", order.status);
    return isPast;
  });

  const upcomingOrders = orders.filter(order => {
    const isUpcoming = order.status.toUpperCase() === 'SCHEDULED';
    console.log("Order upcoming status:", isUpcoming, "Status:", order.status);
    return isUpcoming;
  });
  
  console.log("Filtered orders:", filteredOrders);
  console.log("Past orders:", pastOrders);
  console.log("Upcoming orders:", upcomingOrders);
  
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDownloadFile = (url: string, fileName: string) => {
    window.open(url, '_blank');
    
    toast({
      title: "File Download",
      description: `${fileName} is being downloaded.`,
    });
  };
  
  const selectedOrder = selectedOrderId ? orders.find(order => order.id === selectedOrderId) : null;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No test orders found</div>
      </div>
    );
  }
  
  return (
    <>
      <ElabNavbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Lab Tests</h1>
            <p className="text-gray-500">View your test orders and results</p>
          </div>
          <Button 
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => router.push('/Elabs')}
          >
            Order New Test
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full sm:w-auto bg-gray-100 p-1">
            <TabsTrigger value="all" className="px-6 py-2">All Tests</TabsTrigger>
            <TabsTrigger value="scheduled" className="px-6 py-2">Scheduled</TabsTrigger>
            <TabsTrigger value="completed" className="px-6 py-2">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
            <FileSearch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">No tests found</h2>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all' 
                ? "You haven't ordered any lab tests yet." 
                : activeTab === 'scheduled'
                  ? "You don't have any scheduled tests."
                  : "You don't have any completed tests."}
            </p>
            <Button 
              className="bg-elab-medical-blue hover:bg-blue-700"
              onClick={() => router.push('/Elabs')}
            >
              Browse Lab Tests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
                      {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Order #{order.orderNumber}
                    </h2>
                    <p className="text-gray-600">
                      Date: {format(new Date(order.orderDate), "PPP")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                  </div>

                <div className="space-y-4">
                  {order.orderItems?.map((item) => {
                    const result = order.results.find((r) => r.test && r.test.name === item.testName);
                    return (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.testName}</h3>
                            {item.testDescription && (
                              <p className="text-gray-600 text-sm mt-1">
                                {item.testDescription}
                              </p>
                            )}
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm ${
                              result?.status?.toUpperCase() === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {result?.status?.toUpperCase() || "SCHEDULED"}
                          </div>
                        </div>

                        {result?.status?.toUpperCase() === "COMPLETED" && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Result</p>
                              <p className="font-medium">{result.resultValue}</p>
                            </div>
                            {result.normalRange && (
                              <div>
                                <p className="text-sm text-gray-600">Normal Range</p>
                                <p className="font-medium">{result.normalRange}</p>
                              </div>
                            )}
                            {result.unit && (
                              <div>
                                <p className="text-sm text-gray-600">Unit</p>
                                <p className="font-medium">{result.unit}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Order details dialog */}
        <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                Order #{selectedOrder?.orderNumber}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>
                
                {/* Tests and Results Section */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Tests & Results</h3>
                  <div className="rounded-md border overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Test</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Normal Range</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.orderItems?.map((item) => {
                          const result = selectedOrder.results?.find((r) => r.test && r.test.name === item.testName);
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.testName}</TableCell>
                              <TableCell className="text-gray-600">{item.testCode}</TableCell>
                              <TableCell>
                                {result?.status === 'COMPLETED'
                                  ? <span className="font-medium">{result.resultValue} {result.unit}</span>
                                  : <span className="text-gray-400 italic">Not available</span>
                                }
                              </TableCell>
                              <TableCell className="text-gray-600">{result?.normalRange || 'N/A'}</TableCell>
                              <TableCell>{getStatusBadge(result?.status || 'SCHEDULED')}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Payment Section */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium">
                          {selectedOrder.paymentMethod === 'CARD'
                            ? 'Credit Card'
                            : 'Insurance'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className="font-medium">
                          {selectedOrder.paymentStatus === 'PAID'
                            ? 'Paid'
                            : 'Pending'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold">
                          ${selectedOrder.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  {selectedOrder.paymentStatus === 'paid' && (
                    <Button variant="outline" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Download Invoice
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedOrderId(null)} 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Test History Section - Redesigned */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Test History</h2>
          {pastOrders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastOrders.map(order => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                      <TableCell>
                        {order.orderItems?.length > 1 ? (
                          <span>{order.orderItems[0].testName} +{order.orderItems.length - 1} more</span>
                        ) : (
                          order.orderItems?.[0]?.testName
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.results?.filter(r => r.status === 'COMPLETED').length || 0} of {order.orderItems?.length || 0}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedOrderId(order.id)}
                          className="text-blue-600"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No test history available yet</p>
            </div>
          )}
        </div>

        {/* Upcoming Tests Section - Redesigned */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upcoming Tests</h2>
          {upcomingOrders.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {upcomingOrders.map(order => (
                <Card key={order.id} className="overflow-hidden border-blue-100">
                  <CardHeader className="bg-blue-50 pb-3">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>#{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Scheduled Date</p>
                          <p className="font-medium">{format(new Date(order.orderDate), "PPP")}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Tests</p>
                      <div className="space-y-1">
                        {order.orderItems?.map(item => (
                          <div key={item.id} className="text-sm">
                            <strong>{item.testName}</strong>
                            {item.testCode && <> (Code: {item.testCode})</>}
                            {item.testDescription && <div className="text-xs text-gray-500">{item.testDescription}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
              <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No upcoming tests scheduled</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyTests; 
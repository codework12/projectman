
import React, { useState } from 'react';
import { useTestOrders } from '@/context/TestOrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, ArrowRight, FileSearch, Eye, Download, FileImage, Clock, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

const MyTests = () => {
  const { getAllUserOrders } = useTestOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const orders = getAllUserOrders();
  
  // Filter orders based on the active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'processing';
    if (activeTab === 'scheduled') return order.status === 'scheduled';
    if (activeTab === 'completed') return order.status === 'completed';
    return true;
  });

  // Separate orders into past and upcoming
  const today = new Date();
  const pastOrders = orders.filter(order => {
    if (!order.scheduledDate) return order.status === 'completed';
    const orderDate = new Date(order.scheduledDate);
    return orderDate < today || order.status === 'completed';
  });

  const upcomingOrders = orders.filter(order => {
    if (!order.scheduledDate) return false;
    const orderDate = new Date(order.scheduledDate);
    return orderDate >= today && order.status !== 'completed' && order.status !== 'cancelled';
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return null;
    
    if (fileType.includes('image')) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />; // Changed from FilePdf to FileText
    } else {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleDownloadFile = (url: string, fileName: string) => {
    // In a real app, this would handle downloading the file from a server
    window.open(url, '_blank');
    
    toast({
      title: "File Download",
      description: `${fileName} is being downloaded.`,
    });
  };
  
  const selectedOrder = selectedOrderId ? orders.find(order => order.id === selectedOrderId) : null;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Lab Tests</h1>
          <p className="text-gray-500">View your test orders and results</p>
        </div>
        <Button 
          className="bg-elab-medical-blue hover:bg-blue-700"
          onClick={() => navigate('/')}
        >
          Order New Test
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full sm:w-auto bg-gray-100 p-1">
          <TabsTrigger value="all" className="px-6 py-2">All Tests</TabsTrigger>
          <TabsTrigger value="pending" className="px-6 py-2">Pending</TabsTrigger>
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
              : `You don't have any ${activeTab} tests.`}
          </p>
          <Button 
            className="bg-elab-medical-blue hover:bg-blue-700"
            onClick={() => navigate('/')}
          >
            Browse Lab Tests
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Test Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {order.tests.length > 1 ? (
                            <span>{order.tests[0].test.name} +{order.tests.length - 1} more</span>
                          ) : (
                            order.tests[0]?.test.name
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
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
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Test Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Tests:</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed:</span>
                  <span className="font-medium">{orders.filter(o => o.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Upcoming:</span>
                  <span className="font-medium">{upcomingOrders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Results Available:</span>
                  <span className="font-medium">{orders.filter(o => o.results && o.results.some(r => r.status === 'completed')).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointment Card */}
            {upcomingOrders.length > 0 && (
              <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Next Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">{upcomingOrders[0].scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">{upcomingOrders[0].scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">{upcomingOrders[0].location}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-100"
                      onClick={() => setSelectedOrderId(upcomingOrders[0].id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Latest Result Card */}
            {pastOrders.some(order => order.results && order.results.length > 0) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    Latest Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pastOrders
                      .filter(order => order.results && order.results.length > 0)
                      .slice(0, 1)
                      .map(order => (
                        <div key={order.id} className="space-y-2">
                          <div className="text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                          <div>
                            {order.tests.slice(0, 1).map(item => (
                              <div key={item.test.id} className="font-medium">
                                {item.test.name}
                              </div>
                            ))}
                            {order.tests.length > 1 && (
                              <div className="text-sm text-gray-500">
                                +{order.tests.length - 1} more tests
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full mt-2 border-green-200 text-green-700 hover:bg-green-50"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            View Results
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {/* Order details dialog */}
      <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              Order #{selectedOrder?.orderNumber}
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-medium">{selectedOrder.paymentMethod === 'credit_card' ? 'Credit Card' : 'Insurance'}</p>
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
                        <TableHead>Documents</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.tests.map((item) => {
                        const result = selectedOrder.results?.find(r => r.testId === item.test.id);
                        return (
                          <TableRow key={item.test.id}>
                            <TableCell className="font-medium">{item.test.name}</TableCell>
                            <TableCell className="text-gray-600">{item.test.code}</TableCell>
                            <TableCell>
                              {result?.status === 'completed' ? (
                                <span className="font-medium">
                                  {result.resultValue} {result.unit}
                                </span>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-gray-600">{result?.normalRange || 'N/A'}</TableCell>
                            <TableCell>
                              {result?.fileAttachment ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50"
                                  onClick={() => result.fileAttachment?.url && 
                                    handleDownloadFile(
                                      result.fileAttachment.url, 
                                      result.fileAttachment.name
                                    )
                                  }
                                >
                                  {getFileIcon(result.fileAttachment.type)}
                                  <span className="ml-1">Download</span>
                                </Button>
                              ) : (
                                <span className="text-gray-500 text-sm">No documents</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Appointment Section */}
              {selectedOrder.scheduledDate && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Appointment Details</h3>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{selectedOrder.scheduledDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{selectedOrder.scheduledTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{selectedOrder.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment Section */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">
                        {selectedOrder.paymentMethod === 'credit_card'
                          ? 'Credit Card'
                          : 'Insurance'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className="font-medium">
                        {selectedOrder.paymentStatus === 'paid'
                          ? 'Paid'
                          : selectedOrder.paymentStatus === 'pending'
                            ? 'Pending'
                            : selectedOrder.paymentStatus || 'Pending'}
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
                  className="bg-elab-medical-blue hover:bg-blue-700"
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
                      {order.tests.length > 1 ? (
                        <span>{order.tests[0].test.name} +{order.tests.length - 1} more</span>
                      ) : (
                        order.tests[0]?.test.name
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {order.results?.filter(r => r.status === 'completed').length || 0} of {order.tests.length}
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
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium">{order.scheduledDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-medium">{order.scheduledTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">{order.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Tests</p>
                    <div className="space-y-1">
                      {order.tests.map(item => (
                        <div key={item.test.id} className="text-sm">
                          • {item.test.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-elab-medical-blue hover:bg-blue-700"
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
  );
};

export default MyTests;

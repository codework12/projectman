
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, FileText, Calendar, ArrowRight, File, Eye } from 'lucide-react';
import { useTestOrders } from '@/context/TestOrderContext';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById } = useTestOrders();
  const orderId = location.state?.orderId;
  const insurancePending = location.state?.insurancePending;
  
  const order = orderId ? getOrderById(orderId) : null;
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{name: string, type: string, url: string} | null>(null);
  
  useEffect(() => {
    if (!order) {
      // If no order found, redirect to homepage
      navigate('/');
    }
  }, [order, navigate]);
  
  if (!order) {
    return null;
  }
  
  const hasResultFiles = order.results?.some(result => result.fileAttachment);
  
  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return null;
    
    if (fileType.includes('image')) {
      return <File className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const handleViewFile = (file: {name: string, type: string, url: string}) => {
    setSelectedFile(file);
    setFileViewerOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Order #{order.orderNumber} has been placed on {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Ordered Tests</h3>
                <div className="space-y-3">
                  {order.tests.map(item => (
                    <div key={item.test.id} className="flex justify-between">
                      <div>
                        <p>{item.test.name}</p>
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
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p>{order.paymentMethod === 'credit_card' ? 'Credit Card' : 'Insurance'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <div>
                      {order.paymentStatus === 'paid' ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          {order.paymentStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {order.paymentMethod === 'credit_card' && order.transactionId && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-mono">{order.transactionId}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold">${order.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {order.paymentMethod === 'insurance' && (
                <>
                  <Separator />
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800 mb-2">Insurance Verification Pending</h3>
                    <p className="text-sm text-yellow-700">
                      Your order has been placed with insurance. We will verify your insurance coverage and contact you if there are any issues. 
                      You will receive an email notification when your insurance has been verified.
                    </p>
                  </div>
                </>
              )}
              
              {order.paymentMethod === 'credit_card' && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 cursor-pointer" onClick={() => setInvoiceOpen(true)}>
                      <FileText size={18} className="mr-2" />
                      <span>View Invoice</span>
                    </div>
                    <Button variant="outline" onClick={() => setInvoiceOpen(true)}>
                      Download
                    </Button>
                  </div>
                </>
              )}
              
              {hasResultFiles && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Test Result Files</h3>
                    <div className="space-y-2">
                      {order.results?.filter(result => result.fileAttachment).map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            {getFileIcon(result.fileAttachment?.type)}
                            <span className="ml-2">{result.fileAttachment?.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewFile(result.fileAttachment!)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {order.status === 'scheduled' || order.scheduledDate ? (
          <Card className="mb-8">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-lg text-blue-700 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Appointment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {order.scheduledDate ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{order.scheduledDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{order.scheduledTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{order.location}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Your appointment details will be sent to you via email. You can also view your appointment details in your account.
                </p>
              )}
            </CardContent>
          </Card>
        ) : insurancePending ? (
          <Card className="mb-8">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-lg text-blue-700">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                Once your insurance has been verified, we will contact you to schedule your appointment.
              </p>
            </CardContent>
          </Card>
        ) : null}
        
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
          <Button 
            className="bg-elab-medical-blue" 
            onClick={() => navigate('/my-tests')}
          >
            View My Orders
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
      
      {/* Invoice Viewer Dialog */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice #{order.orderNumber}</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">Elite Labs</h3>
                <p className="text-sm text-gray-500">123 Medical Avenue</p>
                <p className="text-sm text-gray-500">Healthcare City, HC 12345</p>
                <p className="text-sm text-gray-500">Phone: (555) 123-4567</p>
              </div>
              <div className="text-right">
                <h4 className="font-semibold">Invoice</h4>
                <p className="text-sm">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p className="text-sm">Invoice #: INV-{order.orderNumber}</p>
                {order.transactionId && (
                  <p className="text-sm">Transaction ID: {order.transactionId}</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Bill To:</h4>
              <p>{order.userName || 'Patient'}</p>
              <p className="text-sm text-gray-500">{order.userEmail || 'No email provided'}</p>
            </div>
            
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Test</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-right">Unit Price</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.tests.map(item => (
                  <tr key={item.test.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <p>{item.test.name}</p>
                        <p className="text-xs text-gray-500">Code: {item.test.code}</p>
                      </div>
                    </td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">${item.test.price.toFixed(2)}</td>
                    <td className="p-2 text-right">${(item.test.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td className="p-2" colSpan={3}>Total</td>
                  <td className="p-2 text-right">${order.totalAmount?.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="text-sm">
              <h4 className="font-semibold mb-1">Payment Information:</h4>
              <p>Method: {order.paymentMethod === 'credit_card' ? 'Credit Card' : 'Insurance'}</p>
              <p>Status: {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus}</p>
              {order.paymentDate && (
                <p>Date: {new Date(order.paymentDate).toLocaleDateString()}</p>
              )}
            </div>
            
            <div className="text-sm text-gray-500 text-center mt-8">
              <p>Thank you for choosing Elite Labs for your healthcare needs.</p>
              <p>This is a computer-generated document and does not require a signature.</p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  // In a real app, this would download the invoice
                  window.print();
                  // Or you could convert the HTML to PDF using a library
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Save PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* File Viewer */}
      <Sheet open={fileViewerOpen} onOpenChange={setFileViewerOpen}>
        <SheetContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {selectedFile?.name}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 h-[80vh] overflow-auto">
            {selectedFile?.type?.includes('image') ? (
              <div className="flex flex-col items-center">
                <img 
                  src={selectedFile.url} 
                  alt={selectedFile.name}
                  className="max-w-full object-contain rounded-md shadow-md"
                />
                <a 
                  href={selectedFile.url} 
                  download={selectedFile.name}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download Image
                </a>
              </div>
            ) : selectedFile?.type?.includes('pdf') ? (
              <div className="flex flex-col items-center">
                <iframe 
                  src={selectedFile.url} 
                  title={selectedFile.name}
                  className="w-full h-[70vh] border rounded-md shadow-md"
                />
                <a 
                  href={selectedFile.url} 
                  download={selectedFile.name}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download PDF
                </a>
              </div>
            ) : (
              <div className="text-center p-8 border rounded-md">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium">This file type cannot be previewed</p>
                <a 
                  href={selectedFile?.url} 
                  download={selectedFile?.name}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrderConfirmation;

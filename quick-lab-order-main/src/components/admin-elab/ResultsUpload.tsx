import React, { useState, useRef } from 'react';
import { useTestOrders, TestOrder } from '@/context/TestOrderContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, Search, Check, File, FileImage } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ResultsUploadProps {
  orders: TestOrder[];
}

const ResultsUpload: React.FC<ResultsUploadProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [resultValue, setResultValue] = useState('');
  const [normalRange, setNormalRange] = useState('');
  const [unit, setUnit] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateTestResult } = useTestOrders();
  const { toast } = useToast();
  
  // Filter completed orders but without results or with pending/processing results
  const eligibleOrders = orders.filter(order => 
    (order.status === 'completed' || order.status === 'scheduled') &&
    order.paymentStatus === 'paid'
  );
  
  // Filter based on search term
  const filteredOrders = eligibleOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.tests.some(item => 
      item.test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.test.code.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmitResult = (orderId: string, testId: string) => {
    // Create result data object
    const resultData: {
      resultValue: string;
      normalRange: string;
      unit: string;
      status: 'completed';
      fileAttachment?: {
        name: string;
        type: string;
        url: string;
      };
    } = {
      resultValue,
      normalRange,
      unit,
      status: 'completed'
    };

    // Add file attachment if a file was selected
    if (selectedFile) {
      // In a real application, this would upload the file to a server
      // For now, we'll create a fake URL
      const fileUrl = URL.createObjectURL(selectedFile);
      
      resultData.fileAttachment = {
        name: selectedFile.name,
        type: selectedFile.type,
        url: fileUrl
      };
    }
    
    // Update test result
    updateTestResult(orderId, testId, resultData);
    
    // Reset form
    setResultValue('');
    setNormalRange('');
    setUnit('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setActiveOrderId(null);
    setActiveTestId(null);
    
    toast({
      title: "Result Uploaded",
      description: selectedFile 
        ? `The test result and ${selectedFile.name} have been uploaded successfully.`
        : "The test result has been uploaded successfully.",
    });
  };
  
  const getResultStatus = (order: TestOrder, testId: string) => {
    const result = order.results?.find(r => r.testId === testId);
    
    if (!result) {
      return <Badge variant="outline">Pending</Badge>;
    }
    
    switch(result.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const getResultValue = (order: TestOrder, testId: string) => {
    const result = order.results?.find(r => r.testId === testId);
    
    if (!result || !result.resultValue) {
      return 'No result';
    }
    
    return `${result.resultValue} ${result.unit || ''}`;
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return null;
    
    if (fileType.includes('image')) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const hasFileAttachment = (order: TestOrder, testId: string) => {
    const result = order.results?.find(r => r.testId === testId);
    return result?.fileAttachment?.url ? true : false;
  };
  
  if (eligibleOrders.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No Orders Requiring Results</h3>
        <p className="text-gray-500">There are no completed orders requiring test results.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search by order number, patient, or test..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredOrders.map(order => (
        <div key={order.id} className="mb-10 border rounded-md">
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-medium">
                Order #{order.orderNumber} - {order.userName || 'No name'}
              </h3>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.tests.map(item => (
                  <React.Fragment key={item.test.id}>
                    <TableRow>
                      <TableCell className="font-medium">{item.test.name}</TableCell>
                      <TableCell>{item.test.code}</TableCell>
                      <TableCell>{getResultStatus(order, item.test.id)}</TableCell>
                      <TableCell>{getResultValue(order, item.test.id)}</TableCell>
                      <TableCell>
                        {order.results?.find(r => r.testId === item.test.id)?.fileAttachment && (
                          <div className="flex items-center">
                            {getFileIcon(order.results?.find(r => r.testId === item.test.id)?.fileAttachment?.type)}
                            <span className="ml-1 text-xs truncate max-w-[100px]">
                              {order.results?.find(r => r.testId === item.test.id)?.fileAttachment?.name}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setActiveOrderId(order.id);
                            setActiveTestId(item.test.id);
                            
                            // Pre-populate form with existing data if available
                            const existingResult = order.results?.find(r => r.testId === item.test.id);
                            if (existingResult) {
                              setResultValue(existingResult.resultValue || '');
                              setNormalRange(existingResult.normalRange || '');
                              setUnit(existingResult.unit || '');
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            } else {
                              setResultValue('');
                              setNormalRange('');
                              setUnit('');
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }
                          }}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          {hasFileAttachment(order, item.test.id) 
                            ? 'Update Result' 
                            : 'Upload Result'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {activeOrderId === order.id && activeTestId === item.test.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50 p-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Upload Result for {item.test.name}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="col-span-1 md:col-span-3">
                                <Label htmlFor="resultValue">Result Value</Label>
                                <Textarea
                                  id="resultValue"
                                  value={resultValue}
                                  onChange={(e) => setResultValue(e.target.value)}
                                  placeholder="Enter test result value"
                                  className="h-20"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="normalRange">Normal Range</Label>
                                <Input
                                  id="normalRange"
                                  value={normalRange}
                                  onChange={(e) => setNormalRange(e.target.value)}
                                  placeholder="e.g. 70-100 mg/dL"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="unit">Unit</Label>
                                <Input
                                  id="unit"
                                  value={unit}
                                  onChange={(e) => setUnit(e.target.value)}
                                  placeholder="e.g. mg/dL"
                                />
                              </div>
                              
                              <div className="flex flex-col">
                                <Label htmlFor="result-file">Attach File (PDF or Image)</Label>
                                <input 
                                  type="file" 
                                  id="result-file" 
                                  ref={fileInputRef}
                                  className="hidden" 
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileChange}
                                />
                                <div className="flex items-center mt-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Select File
                                  </Button>
                                  {selectedFile && (
                                    <span className="ml-3 text-sm text-gray-500">
                                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Upload a PDF or image file of the test results
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setActiveOrderId(null);
                                  setActiveTestId(null);
                                  setSelectedFile(null);
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={() => handleSubmitResult(order.id, item.test.id)}
                                disabled={!resultValue.trim()}
                                className="bg-elab-medical-blue hover:bg-blue-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Save Result
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found matching your criteria</p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSearchTerm('')}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultsUpload;

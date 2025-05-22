import React, { useState, useRef } from 'react';
import { User, ChevronRight, FileText, Calendar, Clock, Settings, UserRound, X, MapPin, Download, FileImage } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { useTestOrders } from '@/components/context/TestOrderContext';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const UserProfile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'upcoming'>('results');
  const router = useRouter();
  const { orders } = useTestOrders();
  const { toast } = useToast();
  const resultsControls = useDragControls();
  const upcomingControls = useDragControls();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const navigateToMyTests = () => {
    setIsOpen(false);
    router.push('/my-tests');
  };

  const navigateToSettings = () => {
    setIsOpen(false);
    router.push('/account');
  };

  const handleViewDetails = (testId: string) => {
    // In a real app, this would navigate to the test details page
    router.push(`/my-tests?highlight=${testId}`);
    setIsOpen(false);
  };

  // Filter and prepare results for display
  const recentResults = orders
    .filter(order => order.status === 'completed' && order.results && order.results.some(r => r.status === 'completed'))
    .flatMap(order => 
      order.results
        ?.filter(result => result.status === 'completed')
        .map(result => {
          const test = order.tests.find(t => t.test.id === result.testId)?.test;
          return {
            id: result.testId,
            orderId: order.id,
            name: test?.name || 'Unknown Test',
            date: order.orderDate,
            status: result.status,
            resultValue: result.resultValue,
            normalRange: result.normalRange,
            unit: result.unit,
            fileAttachment: result.fileAttachment
          };
        }) || []
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Filter and prepare upcoming appointments
  const upcomingAppointments = orders
    .filter(order => 
      order.status === 'scheduled' && 
      order.scheduledDate && 
      new Date(order.scheduledDate) >= new Date()
    )
    .map(order => ({
      id: order.id,
      name: order.tests.map(t => t.test.name).join(', '),
      date: order.scheduledDate || '',
      time: order.scheduledTime || '',
      location: order.location || '',
      totalTests: order.tests.length
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handleDownloadFile = (url: string, fileName: string) => {
    // In a real app, this would handle downloading the file from a server
    // For now, we'll just open the URL in a new tab
    window.open(url, '_blank');
    
    toast({
      title: "File Download",
      description: `${fileName} is being downloaded.`,
    });
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return null;
    
    if (fileType.includes('image')) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get user details from first order or use default
  const userDetails = orders.length > 0 ? {
    name: orders[0].userName || "Jane Smith",
    email: orders[0].userEmail || "jane.smith@example.com"
  } : {
    name: "Jane Smith",
    email: "jane.smith@example.com"
  };

  return (
    <div className="relative z-20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-9 w-9 rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage alt={userDetails.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(userDetails.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <p className="font-medium">{userDetails.name}</p>
              <p className="text-xs text-gray-500">{userDetails.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={navigateToMyTests} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>My Tests ({orders.length})</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setActiveTab('results'); toggleOpen(); }} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>Test Results ({recentResults.length})</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setActiveTab('upcoming'); toggleOpen(); }} className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Upcoming Tests ({upcomingAppointments.length})</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleOpen}
            />
            <motion.div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage alt={userDetails.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">{getInitials(userDetails.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{userDetails.name}</h2>
                      <p className="text-gray-500">{userDetails.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={toggleOpen}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex border-b border-gray-200 mb-6">
                  <Button
                    variant="ghost"
                    className={`flex-1 rounded-none border-b-2 ${activeTab === 'results' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
                    onClick={() => setActiveTab('results')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Test Results History
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex-1 rounded-none border-b-2 ${activeTab === 'upcoming' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming Tests
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {activeTab === 'results' ? (
                    recentResults.length > 0 ? (
                      <div className="space-y-4">
                        {recentResults.map((test) => (
                          <motion.div
                            key={`${test.orderId}-${test.id}`}
                            drag="y"
                            dragControls={resultsControls}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => setIsDragging(false)}
                            dragConstraints={modalRef}
                            dragElastic={0.1}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
                          >
                            <div 
                              className="cursor-grab active:cursor-grabbing"
                              onPointerDown={(e) => {
                                e.preventDefault();
                                resultsControls.start(e);
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">{new Date(test.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                                </span>
                              </div>
                              {test.status === 'completed' && (
                                <div className="mt-4 pt-3 border-t border-gray-100 text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Result:</span>
                                    <span className="font-medium text-gray-900">{test.resultValue}</span>
                                  </div>
                                  {test.normalRange && (
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-gray-600">Normal Range:</span>
                                      <span className="text-gray-900">{test.normalRange}</span>
                                    </div>
                                  )}
                                  {test.fileAttachment && (
                                    <div className="mt-2 pt-2 border-t border-gray-50">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          {getFileIcon(test.fileAttachment.type)}
                                          <span className="ml-2 text-gray-600 text-xs">
                                            {test.fileAttachment.name}
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-1 h-auto text-blue-600"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isDragging && test.fileAttachment) {
                                              handleDownloadFile(
                                                test.fileAttachment.url,
                                                test.fileAttachment.name
                                              );
                                            }
                                          }}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full mt-3 text-blue-600"
                              onClick={() => !isDragging && handleViewDetails(test.id)}
                            >
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                        <h3 className="text-lg font-medium text-gray-500">No Results Yet</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Your test results will appear here once they're ready
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={navigateToMyTests}
                        >
                          View All Tests
                        </Button>
                      </div>
                    )
                  ) : (
                    upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((test) => (
                          <motion.div
                            key={test.id}
                            drag="y"
                            dragControls={upcomingControls}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => setIsDragging(false)}
                            dragConstraints={modalRef}
                            dragElastic={0.1}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
                          >
                            <div 
                              className="cursor-grab active:cursor-grabbing"
                              onPointerDown={(e) => {
                                e.preventDefault();
                                upcomingControls.start(e);
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  {test.totalTests > 1 ? (
                                    <>
                                      <h3 className="font-medium text-gray-900">
                                        Multiple Tests <Badge variant="outline" className="ml-1">{test.totalTests}</Badge>
                                      </h3>
                                      <p className="text-sm text-gray-600 line-clamp-1">{test.name}</p>
                                    </>
                                  ) : (
                                    <h3 className="font-medium text-gray-900">{test.name}</h3>
                                  )}
                                  
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">{new Date(test.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">{test.time}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">{test.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  if (!isDragging) {
                                    // Show reschedule confirmation
                                    toast({
                                      title: "Reschedule Request",
                                      description: "Your reschedule request has been sent.",
                                    });
                                  }
                                }}
                              >
                                Reschedule
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => {
                                  if (!isDragging) {
                                    // Show cancel confirmation
                                    toast({
                                      title: "Cancel Appointment",
                                      description: "Your appointment has been cancelled.",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                        <h3 className="text-lg font-medium text-gray-500">No Upcoming Tests</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          You don't have any upcoming scheduled tests
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => router.push('/')}
                        >
                          Order New Tests
                        </Button>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <Button
                    variant="ghost"
                    onClick={navigateToMyTests}
                    className="text-blue-600"
                  >
                    View All Tests
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;

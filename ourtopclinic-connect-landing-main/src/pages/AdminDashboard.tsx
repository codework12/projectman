
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Users, Search, Check, X, ChevronDown, ChevronUp, Filter, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock data for doctor applications
const mockDoctors = [
  {
    id: '1',
    fullName: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    email: 'sarah.johnson@example.com',
    licenseNumber: 'MDC123456',
    contactNumber: '9123456789',
    submittedAt: '2025-05-15T14:30:00',
    status: 'pending',
    employmentType: 'Full-Time',
    department: 'OPD',
    address: '1479 Street, Apt 1839-A NY',
    npiNumber: 'NPI1234567',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    yearsInPractice: '8',
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  },
  {
    id: '2',
    fullName: 'Dr. Michael Chen',
    specialization: 'Neurology',
    email: 'michael.chen@example.com',
    licenseNumber: 'MDC789012',
    contactNumber: '9187654321',
    submittedAt: '2025-05-14T10:15:00',
    status: 'pending',
    employmentType: 'Part-Time',
    department: 'Neurology',
    address: '892 Brain Ave, Suite 300',
    npiNumber: 'NPI7891234',
    city: 'Boston',
    state: 'MA',
    zipCode: '02115',
    yearsInPractice: '12',
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: false,
      sunday: false,
    },
  },
  {
    id: '3',
    fullName: 'Dr. Emma Wilson',
    specialization: 'Pediatrics',
    email: 'emma.wilson@example.com',
    licenseNumber: 'MDC456789',
    contactNumber: '9156789123',
    submittedAt: '2025-05-13T16:45:00',
    status: 'approved',
    employmentType: 'Full-Time',
    department: 'Pediatrics',
    address: '456 Child Care Blvd',
    npiNumber: 'NPI4567891',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    yearsInPractice: '5',
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  },
  {
    id: '4',
    fullName: 'Dr. James Rodriguez',
    specialization: 'Orthopedics',
    email: 'james.rodriguez@example.com',
    licenseNumber: 'MDC654321',
    contactNumber: '9189012345',
    submittedAt: '2025-05-12T09:30:00',
    status: 'rejected',
    employmentType: 'Consultant',
    department: 'Orthopedics',
    address: '789 Bone Street',
    npiNumber: 'NPI6543219',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    yearsInPractice: '15',
    workingDays: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false,
    },
  },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(mockDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortColumn, setSortColumn] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter(doctor => {
      // Filter by search query
      const matchesSearch = doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || doctor.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected column
      if (sortColumn === 'submittedAt') {
        return sortDirection === 'asc' 
          ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
      
      // Sort by name
      if (sortColumn === 'name') {
        return sortDirection === 'asc'
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      }
      
      return 0;
    });
    
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handleStatusChange = (doctorId: string, newStatus: 'approved' | 'rejected') => {
    setDoctors(doctors.map(doctor => 
      doctor.id === doctorId ? { ...doctor, status: newStatus } : doctor
    ));
    
    toast({
      title: `Doctor ${newStatus === 'approved' ? 'approved' : 'rejected'}`,
      description: `Doctor application has been ${newStatus}.`,
    });
    
    setIsViewDetailsOpen(false);
  };
  
  const viewDoctorDetails = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsViewDetailsOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col">
        {/* Admin Navbar */}
        <header className="sticky top-0 z-30 bg-background border-b">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">OurTopClinic Admin</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium text-primary">Dashboard</a>
                <a href="#" className="text-sm font-medium text-muted-foreground">Doctors</a>
                <a href="#" className="text-sm font-medium text-muted-foreground">Patients</a>
                <a href="#" className="text-sm font-medium text-muted-foreground">Reports</a>
                <a href="#" className="text-sm font-medium text-muted-foreground">Settings</a>
              </nav>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  Admin User
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => navigate('/')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-8">
          <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Doctor Applications</h1>
              <p className="text-muted-foreground">Manage doctor registrations and applications</p>
            </div>
            
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctors.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <ChevronDown className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctors.filter(d => d.status === 'pending').length}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires your attention
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <Check className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctors.filter(d => d.status === 'approved').length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active doctors
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <X className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctors.filter(d => d.status === 'rejected').length}</div>
                  <p className="text-xs text-muted-foreground">
                    Declined applications
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or specialization..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter by status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Applications Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Doctor Name
                          {sortColumn === 'name' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('submittedAt')}
                      >
                        <div className="flex items-center">
                          Submitted
                          {sortColumn === 'submittedAt' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No doctor applications found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDoctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.fullName}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.licenseNumber}</TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{formatDate(doctor.submittedAt)}</TableCell>
                          <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewDoctorDetails(doctor)}
                              >
                                View Details
                              </Button>
                              {doctor.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleStatusChange(doctor.id, 'approved')}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleStatusChange(doctor.id, 'rejected')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Doctor Details Dialog */}
      {selectedDoctor && (
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Doctor Application Details</DialogTitle>
              <DialogDescription>
                Review the complete application information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Full Name</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.fullName}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.email}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Contact Number</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.contactNumber}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.address}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">City, State, Zip</div>
                    <div className="col-span-2 font-medium">
                      {selectedDoctor.city}, {selectedDoctor.state} {selectedDoctor.zipCode}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Professional Information</h3>
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">License Number</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.licenseNumber}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">NPI Number</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.npiNumber}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Specialization</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.specialization}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Department</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.department}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Employment Type</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.employmentType}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-sm text-muted-foreground">Years in Practice</div>
                    <div className="col-span-2 font-medium">{selectedDoctor.yearsInPractice}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-medium">Working Days</h3>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mt-3">
                  {Object.entries(selectedDoctor.workingDays).map(([day, isWorking]) => (
                    <div
                      key={day}
                      className={`text-center p-2 rounded-md ${
                        isWorking 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <div className="capitalize">{day}</div>
                      <div className="text-xs mt-1">
                        {isWorking ? 'Working' : 'Off'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Application submitted on</p>
                  <p className="font-medium">{formatDate(selectedDoctor.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current status</p>
                  <div>{getStatusBadge(selectedDoctor.status)}</div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              {selectedDoctor.status === 'pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange(selectedDoctor.id, 'rejected')}
                  >
                    Reject Application
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange(selectedDoctor.id, 'approved')}
                  >
                    Approve Application
                  </Button>
                </>
              )}
              {selectedDoctor.status !== 'pending' && (
                <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;

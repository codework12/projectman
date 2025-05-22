import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, FileText, MapPin, Mail, Phone, User, 
  Pill, FileCheck, CalendarCheck, MessageSquare, Video,
  Activity, Heart, Weight, Stethoscope, AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import EditProfileButton from '@/components/profile/EditProfileButton';
import { Progress } from '@/components/ui/progress';

interface Appointment {
  id: string;
  doctorName: string;
  doctorAvatar?: string;
  doctorSpecialty: string;
  date: Date;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface MedicalRecord {
  id: string;
  date: Date;
  doctorName: string;
  type: string;
  summary: string;
  files?: { name: string; url: string }[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  instructions: string;
  prescribedBy: string;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
}

interface VitalRecord {
  date: Date;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate?: number;
  weight?: number;
  notes?: string;
}

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Sample data - in a real app, this would come from your backend
  const patientData = {
    id: '456',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    dateOfBirth: new Date(1992, 5, 15),
    gender: 'Female',
    address: '456 Residential Ave, New York, NY',
    insuranceProvider: 'HealthPlus Insurance',
    insurancePolicyNumber: 'HP98765432',
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Husband',
      phone: '+1 (555) 123-7890'
    },
    bloodType: 'O+',
    allergies: [
      {
        id: 'a1',
        allergen: 'Penicillin',
        severity: 'Severe',
        reaction: 'Rash, difficulty breathing'
      },
      {
        id: 'a2',
        allergen: 'Peanuts',
        severity: 'Moderate',
        reaction: 'Swelling, hives'
      }
    ],
    medicalConditions: ['Asthma', 'Hypertension'],
    medications: [
      {
        id: 'm1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: new Date(2023, 1, 10),
        endDate: undefined,
        instructions: 'Take in the morning with food',
        prescribedBy: 'Dr. Emily Chen'
      },
      {
        id: 'm2',
        name: 'Albuterol Inhaler',
        dosage: '2 puffs',
        frequency: 'As needed',
        startDate: new Date(2022, 6, 5),
        endDate: undefined,
        instructions: 'Use for asthma symptoms',
        prescribedBy: 'Dr. James Wilson'
      }
    ],
    vitalRecords: [
      {
        date: new Date(2023, 4, 15),
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        respiratoryRate: 16,
        weight: 145,
        notes: 'Patient feeling well.'
      },
      {
        date: new Date(2023, 3, 1),
        bloodPressure: '125/82',
        heartRate: 75,
        temperature: 98.4,
        respiratoryRate: 18,
        weight: 146,
        notes: 'Minor seasonal allergies.'
      },
      {
        date: new Date(2023, 1, 10),
        bloodPressure: '130/85',
        heartRate: 78,
        temperature: 99.0,
        respiratoryRate: 20,
        weight: 148,
        notes: 'Patient recovering from cold.'
      }
    ]
  };

  // Sample appointments
  const appointments: Appointment[] = [
    {
      id: '101',
      doctorName: 'Dr. Emily Chen',
      doctorAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      doctorSpecialty: 'Cardiology',
      date: new Date(2023, 5, 25, 10, 30),
      reason: 'Follow-up for blood pressure',
      status: 'upcoming'
    },
    {
      id: '102',
      doctorName: 'Dr. James Wilson',
      doctorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      doctorSpecialty: 'Pulmonology',
      date: new Date(2023, 6, 3, 14, 0),
      reason: 'Asthma check-up',
      status: 'upcoming'
    },
    {
      id: '103',
      doctorName: 'Dr. Emily Chen',
      doctorAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      doctorSpecialty: 'Cardiology',
      date: new Date(2023, 4, 12, 9, 0),
      reason: 'Blood pressure review',
      status: 'completed'
    }
  ];

  // Sample medical records
  const medicalRecords: MedicalRecord[] = [
    {
      id: 'r1',
      date: new Date(2023, 4, 12),
      doctorName: 'Dr. Emily Chen',
      type: 'Consultation',
      summary: "Patient's blood pressure is stable. Continue current medication.",
      files: [
        { name: 'Blood Test Results.pdf', url: '#' },
        { name: 'EKG Report.pdf', url: '#' }
      ]
    },
    {
      id: 'r2',
      date: new Date(2023, 3, 5),
      doctorName: 'Dr. James Wilson',
      type: 'Pulmonary Function Test',
      summary: 'Lung function has improved. Asthma appears well-controlled.',
      files: [
        { name: 'Pulmonary Function Test Results.pdf', url: '#' }
      ]
    },
    {
      id: 'r3',
      date: new Date(2022, 11, 20),
      doctorName: 'Dr. Rebecca Martinez',
      type: 'Annual Physical',
      summary: 'Patient is generally healthy. Some concerns about blood pressure.',
      files: [
        { name: 'Annual Physical Report.pdf', url: '#' },
        { name: 'Lab Results.pdf', url: '#' }
      ]
    }
  ];

  const handleProfileUpdate = (data: any) => {
    console.log('Profile data updated:', data);
    setIsEditing(false);
    // In a real app, you would update the backend here
  };

  // Format date function
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Calculate age from date of birth
  const calculateAge = (birthday: Date) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Profile Header */}
        <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
          {/* Profile Overview */}
          <div className="relative bg-card rounded-xl px-6 py-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
                <AvatarImage src={patientData.avatar} alt={patientData.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {patientData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {/* Profile Info */}
              <div className="mt-2 md:mt-0">
                <div className="flex items-start md:items-center flex-col md:flex-row gap-3 md:gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{patientData.name}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {calculateAge(patientData.dateOfBirth)} years old • {patientData.gender} • Blood Type: {patientData.bloodType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patientData.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patientData.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{patientData.address.split(',')[0]}</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <div className="md:ml-auto">
                <EditProfileButton 
                  profileData={patientData}
                  onProfileUpdate={handleProfileUpdate}
                  dialogTitle="Edit Patient Profile"
                  allowBannerEdit={false}
                />
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="secondary">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Doctor
              </Button>
              <Button variant="outline" className="hidden md:flex">
                <Video className="h-4 w-4 mr-2" />
                Video Consult
              </Button>
              <Button variant="ghost" className="hidden lg:flex">
                <FileCheck className="h-4 w-4 mr-2" />
                View Records
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs and Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medical Conditions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Medical Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {patientData.medicalConditions.length > 0 ? (
                          patientData.medicalConditions.map((condition, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              <span>{condition}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">No medical conditions recorded</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Allergies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Allergies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {patientData.allergies.map((allergy) => (
                          <div key={allergy.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{allergy.allergen}</h4>
                              <Badge variant={allergy.severity === 'Severe' ? 'destructive' : allergy.severity === 'Moderate' ? 'default' : 'outline'}>
                                {allergy.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{allergy.reaction}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Insurance Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                        Insurance Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Provider</p>
                          <p className="font-medium">{patientData.insuranceProvider}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Policy Number</p>
                          <p className="font-medium">{patientData.insurancePolicyNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Emergency Contact */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{patientData.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Relationship</p>
                          <p className="font-medium">{patientData.emergencyContact.relationship}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{patientData.emergencyContact.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="appointments">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Appointments</CardTitle>
                    <Button variant="outline" size="sm">
                      Schedule New
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {appointments.map(appointment => (
                        <div
                          key={appointment.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border ${
                            appointment.status === 'upcoming' ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' : 
                            appointment.status === 'completed' ? 'bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30' :
                            'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              {appointment.doctorAvatar ? (
                                <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                              ) : (
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {appointment.doctorName.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{appointment.doctorName}</h4>
                            <div className="text-xs text-muted-foreground">{appointment.doctorSpecialty}</div>
                            <div className="text-sm mt-1">{appointment.reason}</div>
                            <div className="flex items-center gap-3 mt-1 text-xs">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{appointment.date.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {appointment.status === 'upcoming' && (
                              <>
                                <Button size="sm" variant="default">Join Video</Button>
                                <Button size="sm" variant="outline">Reschedule</Button>
                              </>
                            )}
                            {appointment.status === 'completed' && (
                              <Button size="sm" variant="outline">View Summary</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="records">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Medical Records</CardTitle>
                    <Button variant="outline" size="sm">
                      Request Records
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-6">
                        {medicalRecords.map((record) => (
                          <div key={record.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-lg">{record.type}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(record.date)} • {record.doctorName}
                                </p>
                              </div>
                              <Badge variant="outline">{record.type}</Badge>
                            </div>
                            
                            <p className="mb-4">{record.summary}</p>
                            
                            {record.files && record.files.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Attachments:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {record.files.map((file, i) => (
                                    <Button key={i} variant="outline" className="flex items-center justify-start gap-2 h-auto py-2">
                                      <FileText className="h-4 w-4" />
                                      <span className="text-sm truncate">{file.name}</span>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="medications">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {patientData.medications.map((medication) => (
                        <div key={medication.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{medication.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{medication.dosage} • {medication.frequency}</p>
                            </div>
                            <Badge variant="outline">
                              {medication.endDate ? 'Completed' : 'Active'}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Start Date</p>
                                <p>{formatDate(medication.startDate)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">End Date</p>
                                <p>{medication.endDate ? formatDate(medication.endDate) : 'Ongoing'}</p>
                              </div>
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-muted-foreground">Instructions</p>
                              <p>{medication.instructions}</p>
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-muted-foreground">Prescribed By</p>
                              <p>{medication.prescribedBy}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="vitals">
                <Card>
                  <CardHeader>
                    <CardTitle>Vital Signs History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {patientData.vitalRecords.map((record, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">{formatDate(record.date)}</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <Heart className="h-4 w-4" />
                                <span>Blood Pressure</span>
                              </div>
                              <span className="font-bold text-lg">{record.bloodPressure}</span>
                              <span className="text-xs text-muted-foreground">mmHg</span>
                            </div>
                            
                            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <Activity className="h-4 w-4" />
                                <span>Heart Rate</span>
                              </div>
                              <span className="font-bold text-lg">{record.heartRate}</span>
                              <span className="text-xs text-muted-foreground">bpm</span>
                            </div>
                            
                            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <Stethoscope className="h-4 w-4" />
                                <span>Respiratory Rate</span>
                              </div>
                              <span className="font-bold text-lg">{record.respiratoryRate || 'N/A'}</span>
                              <span className="text-xs text-muted-foreground">breaths/min</span>
                            </div>
                            
                            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <Stethoscope className="h-4 w-4" />
                                <span>Temperature</span>
                              </div>
                              <span className="font-bold text-lg">{record.temperature}</span>
                              <span className="text-xs text-muted-foreground">°F</span>
                            </div>
                            
                            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <Weight className="h-4 w-4" />
                                <span>Weight</span>
                              </div>
                              <span className="font-bold text-lg">{record.weight || 'N/A'}</span>
                              <span className="text-xs text-muted-foreground">lbs</span>
                            </div>
                          </div>
                          
                          {record.notes && (
                            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Notes</p>
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column */}
          <div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.find(a => a.status === 'upcoming') ? (
                    <div className="flex flex-col items-center text-center p-2">
                      <div className="mb-3">
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage 
                            src={appointments.find(a => a.status === 'upcoming')?.doctorAvatar} 
                            alt={appointments.find(a => a.status === 'upcoming')?.doctorName} 
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {appointments.find(a => a.status === 'upcoming')?.doctorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="font-medium">{appointments.find(a => a.status === 'upcoming')?.doctorName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {appointments.find(a => a.status === 'upcoming')?.doctorSpecialty}
                        </p>
                      </div>
                      
                      <div className="w-full space-y-3">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>
                            {appointments.find(a => a.status === 'upcoming')?.date.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>
                            {appointments.find(a => a.status === 'upcoming')?.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-center">
                          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{appointments.find(a => a.status === 'upcoming')?.reason}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 w-full space-y-2">
                        <Button className="w-full">
                          <Video className="h-4 w-4 mr-2" />
                          Join Video Call
                        </Button>
                        <Button variant="outline" className="w-full">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No upcoming appointments</p>
                      <Button className="mt-4" variant="outline">Schedule Now</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Medication Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientData.medications.map((medication) => (
                      <div key={medication.id} className="flex items-start gap-3 p-2 border-b last:border-0 pb-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Pill className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{medication.name}</h4>
                          <p className="text-sm text-muted-foreground">{medication.dosage} • {medication.frequency}</p>
                          <p className="text-xs text-muted-foreground mt-1">{medication.instructions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    View All Medications
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <FooterSection />
      <ScrollToTop />
    </div>
  );
};

export default PatientProfile;

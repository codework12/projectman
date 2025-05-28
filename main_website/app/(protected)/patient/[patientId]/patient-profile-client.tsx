"use client";

import React from 'react';
import { format } from "date-fns";
import { 
  User, Calendar, Phone, MapPin, Droplet, Heart, Users, 
  Edit, FileText, Receipt, FlaskConical, Home, MessageSquare, 
  Video, Activity, AlertTriangle, Stethoscope, Weight
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Badge } from "../../../../components/ui/badge";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import EditProfileButton from "../../../../components/profile/EditProfileButton";
import { Progress } from "../../../../components/ui/progress";
import ScrollToTop from "../../../../components/ScrollToTop";
import Link from "next/link";
import dynamic from 'next/dynamic';

const AppointmentsSection = dynamic(() => import('./appointments-section'), {
  loading: () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Appointments</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/appointments/new">Schedule New</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] flex items-center justify-center text-muted-foreground">
          Loading appointments...
        </div>
      </CardContent>
    </Card>
  ),
});

const RatingsSection = dynamic(() => import('./ratings-section'), {
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Patient Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Loading ratings...
        </div>
      </CardContent>
    </Card>
  ),
});

interface PatientProfileClientProps {
  data: any;
  patientId: string;
  id: string;
}

export default function PatientProfileClient({ data, patientId, id }: PatientProfileClientProps) {
  const infoItems = [
    { label: "Gender", value: data?.gender?.toLowerCase(), icon: <Users className="w-4 h-4 text-primary" /> },
    { label: "Date of Birth", value: format(data?.date_of_birth!, "yyyy-MM-dd"), icon: <Calendar className="w-4 h-4 text-primary" /> },
    { label: "Phone", value: data?.phone, icon: <Phone className="w-4 h-4 text-primary" /> },
    { label: "Blood Group", value: data?.blood_group, icon: <Droplet className="w-4 h-4 text-primary" /> },
    { label: "Address", value: data?.address, icon: <MapPin className="w-4 h-4 text-primary" /> },
    { label: "Contact Person", value: data?.emergency_contact_name, icon: <User className="w-4 h-4 text-primary" /> },
    { label: "Emergency Contact", value: data?.emergency_contact_number, icon: <Phone className="w-4 h-4 text-primary" /> },
    { label: "Last Visit", value: data?.lastVisit ? format(data?.lastVisit!, "yyyy-MM-dd") : "No last visit", icon: <Calendar className="w-4 h-4 text-primary" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Profile Header */}
        <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 w-full relative">
            {data.coverImage ? (
              <img 
                src={data.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-muted-foreground">Add banner</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
          {/* Profile Overview */}
          <div className="relative bg-card rounded-b-xl px-6 py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              {/* Avatar */}
              <div className="absolute -top-16 md:-top-20 left-6 border-4 border-background rounded-full shadow-xl">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage src={data.img} alt={`${data.first_name} ${data.last_name}`} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {data.first_name[0]}{data.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Profile Info */}
              <div className="mt-10 md:mt-0 md:ml-32">
                <div className="flex items-start md:items-center flex-col md:flex-row gap-3 md:gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{data.first_name} {data.last_name}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1">
                      <Badge variant="secondary" className="w-fit">{data.gender}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(data.date_of_birth), 'yyyy')} • Blood Type: {data.blood_group || '-'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{data.phone || '-'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{data.address || '-'}</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              {patientId === "self" && (
                <div className="md:ml-auto">
                  <EditProfileButton profileData={data} />
                </div>
              )}
            </div>
            
            {/* Quick Action Buttons */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <Button asChild>
                <Link href="/appointments/new">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Link>
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
                <FileText className="h-4 w-4 mr-2" />
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
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {infoItems.map((item, index) => (
                            <div key={index}>
                              <p className="text-sm text-muted-foreground">{item.label}</p>
                              <p className="font-medium">{item.value}</p>
                            </div>
                          ))}
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
                          <p className="font-medium">{data.emergency_contact_name || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{data.emergency_contact_number || '-'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Insurance Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Insurance Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Insurance Provider</p>
                          <p className="font-medium">{data.insurance_provider || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Insurance Number</p>
                          <p className="font-medium">{data.insurance_number || '-'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="appointments">
                <AppointmentsSection patientId={id} />
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
                        {/* Add medical records content here */}
                      </div>
                    </ScrollArea>
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
                      {/* Add vitals content here */}
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
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{data.totalAppointments || '-'}</div>
                      <div className="text-sm text-muted-foreground">Appointments</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">
                        {data.lastVisit ? format(new Date(data.lastVisit), 'MMM d') : '-'}
                      </div>
                      <div className="text-sm text-muted-foreground">Last Visit</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <RatingsSection patientId={id} />
            </div>
          </div>
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
} 
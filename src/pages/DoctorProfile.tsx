
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, FileText, MapPin, Mail, Phone, Globe, Star, 
  User, Briefcase, GraduationCap, Clock8, Edit, ChevronRight, 
  Calendar as CalendarIcon, MessageSquare, Video
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { Progress } from '@/components/ui/progress';
import EditProfileButton from '@/components/profile/EditProfileButton';

interface Review {
  id: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
}

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  date: Date;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Sample data - in a real app, this would come from your backend
  const doctorData = {
    id: '123',
    name: 'Dr. Emily Chen',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop',
    specialty: 'Cardiology',
    title: 'Consultant',
    email: 'dr.chen@ourtop.clinic',
    phone: '+1 (555) 123-4567',
    location: '123 Medical Center, New York, NY',
    website: 'www.dremilychen.com',
    languages: ['English', 'Mandarin', 'Spanish'],
    experience: '12 years',
    education: [
      {
        degree: 'MD in Medicine',
        institution: 'Harvard Medical School',
        year: '2011'
      },
      {
        degree: 'Cardiology Residency',
        institution: 'Mayo Clinic',
        year: '2015'
      }
    ],
    certifications: [
      'American Board of Internal Medicine',
      'Certification in Advanced Cardiac Life Support',
      'Fellow of the American College of Cardiology'
    ],
    workingHours: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 1:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Saturday', hours: 'Closed' },
      { day: 'Sunday', hours: 'Closed' }
    ],
    bio: `Dr. Emily Chen is a board-certified cardiologist with over 12 years of experience in diagnosing and treating heart conditions. Her approach combines the latest medical research with personalized care plans tailored to each patient's unique needs.

Dr. Chen specializes in preventive cardiology, heart failure management, and cardiovascular imaging. She is committed to helping patients improve their heart health through both medical interventions and lifestyle modifications.

Throughout her career, Dr. Chen has been recognized for her commitment to patient education and her calm, reassuring bedside manner. She believes in empowering patients with knowledge about their heart health and involving them as active participants in their care journey.`,
    stats: {
      patients: 1200,
      experience: 12,
      reviews: 145,
      rating: 4.8
    }
  };

  // Sample reviews
  const reviews: Review[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 5,
      comment: 'Dr. Chen is incredibly thorough and compassionate. She took the time to explain my condition in detail and answered all my questions patiently.',
      date: new Date(2023, 4, 15)
    },
    {
      id: '2',
      patientName: 'Michael Brown',
      patientAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5,
      comment: "I've been seeing Dr. Chen for over 2 years now. Her expertise in cardiology is exceptional, and she always makes me feel comfortable during appointments.",
      date: new Date(2023, 3, 22)
    },
    {
      id: '3',
      patientName: 'Jennifer Smith',
      rating: 4,
      comment: 'Very knowledgeable doctor who provides excellent care. The only reason for 4 stars is sometimes the wait time can be longer than expected.',
      date: new Date(2023, 2, 10)
    }
  ];

  // Sample appointments
  const appointments: Appointment[] = [
    {
      id: '101',
      patientName: 'Robert Davis',
      patientAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      date: new Date(2023, 4, 25, 10, 30),
      reason: 'Annual Heart Checkup',
      status: 'upcoming'
    },
    {
      id: '102',
      patientName: 'Emma Wilson',
      patientAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      date: new Date(2023, 4, 26, 14, 0),
      reason: 'ECG Review',
      status: 'upcoming'
    },
    {
      id: '103',
      patientName: 'James Thompson',
      date: new Date(2023, 4, 20, 9, 0),
      reason: 'Consultation for Chest Pain',
      status: 'completed'
    }
  ];

  const handleProfileUpdate = (data: any) => {
    console.log('Profile data updated:', data);
    setIsEditing(false);
    // In a real app, you would update the backend here
  };

  // Generate star rating display
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Cover Photo & Profile Header */}
        <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
          {/* Cover Image */}
          <div className="h-48 md:h-64 w-full relative">
            <img 
              src={doctorData.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
          {/* Profile Overview */}
          <div className="relative bg-card rounded-b-xl px-6 py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              {/* Avatar */}
              <div className="absolute -top-16 md:-top-20 left-6 border-4 border-background rounded-full shadow-xl">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage src={doctorData.avatar} alt={doctorData.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {doctorData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Profile Info */}
              <div className="mt-10 md:mt-0 md:ml-32">
                <div className="flex items-start md:items-center flex-col md:flex-row gap-3 md:gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{doctorData.name}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1">
                      <Badge variant="secondary" className="w-fit">{doctorData.specialty}</Badge>
                      <span className="text-sm text-muted-foreground">{doctorData.title}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{doctorData.stats.rating}</span>
                    <span className="text-sm text-muted-foreground">({doctorData.stats.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{doctorData.experience} experience</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{doctorData.stats.patients}+ patients</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{doctorData.location.split(',')[0]}</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <div className="md:ml-auto">
                <EditProfileButton 
                  profileData={doctorData}
                  onProfileUpdate={handleProfileUpdate}
                  dialogTitle="Edit Doctor Profile"
                  dialogDescription="Update your profile information"
                  allowBannerEdit={true}
                />
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <Button>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="secondary">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="hidden md:flex">
                <Video className="h-4 w-4 mr-2" />
                Video Consult
              </Button>
              <Button variant="ghost" className="hidden lg:flex">
                <FileText className="h-4 w-4 mr-2" />
                View CV
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs and Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="prose dark:prose-invert max-w-none">
                        {doctorData.bio.split('\n\n').map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Education</h3>
                        <div className="space-y-4">
                          {doctorData.education.map((edu, i) => (
                            <div key={i} className="flex gap-3">
                              <div className="flex-shrink-0 mt-1">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                  <GraduationCap className="h-4 w-4" />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium">{edu.degree}</h4>
                                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                <p className="text-xs text-muted-foreground">{edu.year}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Certifications</h3>
                        <ul className="space-y-2">
                          {doctorData.certifications.map((cert, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {doctorData.languages.map((lang, i) => (
                            <Badge key={i} variant="outline">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appointments">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <Button variant="outline" size="sm">
                      View All
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
                              {appointment.patientAvatar ? (
                                <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                              ) : (
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {appointment.patientName.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{appointment.patientName}</h4>
                            <div className="text-sm text-muted-foreground">{appointment.reason}</div>
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
                          
                          <div>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Patient Reviews</CardTitle>
                      <CardDescription>
                        Feedback from your patients
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{doctorData.stats.rating}</div>
                      {renderStarRating(doctorData.stats.rating)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="space-y-1 mb-4">
                        {[5, 4, 3, 2, 1].map(rating => {
                          // Calculate percentage of reviews for this rating
                          const reviewsForRating = reviews.filter(r => Math.round(r.rating) === rating).length;
                          const percentage = reviews.length ? (reviewsForRating / reviews.length) * 100 : 0;
                          
                          return (
                            <div key={rating} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-16">
                                <span>{rating}</span>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              </div>
                              <Progress className="h-2" value={percentage} />
                              <span className="text-xs text-muted-foreground w-10">{percentage.toFixed(0)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-6">
                        {reviews.map(review => (
                          <div key={review.id} className="border-b pb-5 last:border-none">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  {review.patientAvatar ? (
                                    <AvatarImage src={review.patientAvatar} alt={review.patientName} />
                                  ) : (
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {review.patientName.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <div className="font-medium">{review.patientName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {review.date.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0">{renderStarRating(review.rating)}</div>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      See All Reviews
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="availability">
                <Card>
                  <CardHeader>
                    <CardTitle>Working Hours</CardTitle>
                    <CardDescription>
                      When patients can book appointments with you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {doctorData.workingHours.map((schedule, i) => (
                        <div key={i} className="flex justify-between py-2 border-b last:border-none">
                          <div className="font-medium">{schedule.day}</div>
                          <div className={schedule.hours === 'Closed' ? 'text-muted-foreground' : ''}>
                            {schedule.hours}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Contact Info */}
          <div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{doctorData.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-medium">{doctorData.phone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Address</div>
                        <div className="font-medium">{doctorData.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Website</div>
                        <div className="font-medium">{doctorData.website}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{doctorData.stats.patients}+</div>
                      <div className="text-sm text-muted-foreground">Patients</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{doctorData.stats.experience}</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{doctorData.stats.reviews}</div>
                      <div className="text-sm text-muted-foreground">Reviews</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold flex items-center justify-center">
                        {doctorData.stats.rating}
                        <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </CardContent>
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

export default DoctorProfile;

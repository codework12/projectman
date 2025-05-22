
import React, { useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Video, MessageSquare, ChevronRight, Star, Activity, Bell, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import FooterSection from '@/components/sections/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';

const AppDoctor = () => {
  useEffect(() => {
    // Update page title
    document.title = 'OurTopClinic - Doctor Dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-4">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" alt="Dr. Emily Chen" />
                </Avatar>
                <div>
                  <h3 className="font-bold">Dr. Emily Chen</h3>
                  <p className="text-sm text-muted-foreground">Cardiologist</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Available</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>4.9/5</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full rounded-lg">View Profile</Button>
              </div>
            </div>
            
            <nav className="glass-card rounded-xl overflow-hidden">
              <ul>
                <li><a href="#" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors bg-secondary">
                  <Users className="h-5 w-5 text-primary" /> Patients
                </a></li>
                <li><a href="#" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
                  <Calendar className="h-5 w-5" /> Appointments
                </a></li>
                <li><a href="#" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
                  <Video className="h-5 w-5" /> Video Calls
                </a></li>
                <li><a href="#" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
                  <MessageSquare className="h-5 w-5" /> Messages
                </a></li>
                <li><a href="#" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
                  <Activity className="h-5 w-5" /> Analytics
                </a></li>
                <li><a href="#" className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors">
                  <Settings className="h-5 w-5" /> Settings
                </a></li>
              </ul>
            </nav>
            
            <div className="mt-4 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">My Patients</h1>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
                <Button>New Patient</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Patient cards */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden hover-card">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between">
                      <Avatar className="h-12 w-12">
                        <img src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 20}.jpg`} alt="Patient" />
                      </Avatar>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="mt-2 text-lg">
                      {['Sarah Johnson', 'Robert Lee', 'Emma Wilson', 'James Brown', 'Olivia Davis', 'Michael Smith'][i-1]}
                    </CardTitle>
                    <CardDescription>
                      {['32 years', '45 years', '28 years', '52 years', '36 years', '41 years'][i-1]} • {['Heart issues', 'Hypertension', 'Diabetes', 'Arthritis', 'Asthma', 'Back pain'][i-1]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Last Visit:</span>
                        <span>{['2 days ago', '1 week ago', 'Yesterday', '3 days ago', '2 weeks ago', '5 days ago'][i-1]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`${['text-green-500', 'text-orange-500', 'text-blue-500'][i % 3]}`}>
                          {['Active', 'Pending Review', 'Treatment'][i % 3]}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-lg">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button className="flex-1 rounded-lg">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Today's Appointments</h2>
              <div className="glass-card rounded-xl p-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <img src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 30}.jpg`} alt="Patient" />
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{['Sarah Johnson', 'Robert Lee', 'Emma Wilson'][i-1]}</h4>
                          <p className="text-sm text-muted-foreground">{['Heart checkup', 'Blood pressure', 'Diabetes follow-up'][i-1]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {['10:30 AM', '1:15 PM', '3:45 PM'][i-1]}
                          </div>
                          <div className="text-xs text-muted-foreground">{['30 min', '45 min', '30 min'][i-1]}</div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full">Join</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FooterSection />
      <ScrollToTop />
    </div>
  );
};

export default AppDoctor;


import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, Plus, FileText, Pill, Heart, Activity, Bell, User, Home, Search, Settings, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const PatientDashboard = () => {
  useEffect(() => {
    document.title = 'Patient Dashboard - OurTopClinic';
  }, []);

  const [activeTab, setActiveTab] = useState('overview');

  // Health stats data
  const healthStats = [
    { name: 'Steps', icon: Activity, value: '8,547', target: '10,000', progress: 85 },
    { name: 'Sleep', icon: Clock, value: '7.5h', target: '8h', progress: 94 },
    { name: 'Water', icon: Heart, value: '1.8L', target: '2.5L', progress: 72 },
    { name: 'Heart Rate', icon: Activity, value: '72 bpm', target: 'Normal', progress: 100 },
  ];

  // Activity data
  const activityData = [
    { day: 'Mon', steps: 6500, calories: 320 },
    { day: 'Tue', steps: 8200, calories: 350 },
    { day: 'Wed', steps: 7800, calories: 340 },
    { day: 'Thu', steps: 9500, calories: 380 },
    { day: 'Fri', steps: 5600, calories: 280 },
    { day: 'Sat', steps: 10200, calories: 420 },
    { day: 'Sun', steps: 7400, calories: 310 },
  ];
  
  // Sleep data
  const sleepData = [
    { day: 'Mon', deep: 2.5, light: 5.0, rem: 1.5 },
    { day: 'Tue', deep: 2.2, light: 4.8, rem: 1.2 },
    { day: 'Wed', deep: 2.7, light: 5.2, rem: 1.6 },
    { day: 'Thu', deep: 2.0, light: 4.5, rem: 1.3 },
    { day: 'Fri', deep: 2.3, light: 4.7, rem: 1.4 },
    { day: 'Sat', deep: 2.8, light: 5.5, rem: 1.7 },
    { day: 'Sun', deep: 2.6, light: 5.1, rem: 1.5 },
  ];

  // Upcoming appointments
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sophie Williams',
      specialty: 'Cardiologist',
      date: 'Today',
      time: '2:30 PM',
      isVideo: true,
      avatar: '',
    },
    {
      id: 2,
      doctor: 'Dr. Marcus Chen',
      specialty: 'Dermatologist',
      date: 'Tomorrow',
      time: '10:15 AM',
      isVideo: false,
      avatar: '',
    },
    {
      id: 3,
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'Nutritionist',
      date: 'May 25, 2025',
      time: '3:45 PM',
      isVideo: true,
      avatar: '',
    }
  ];

  // Medications
  const medications = [
    { 
      name: 'Lisinopril', 
      dosage: '10mg',
      schedule: 'Once daily',
      time: 'Morning',
      nextDose: 'Today, 8:00 AM',
      remaining: 12,
      adherence: 98
    },
    { 
      name: 'Metformin', 
      dosage: '500mg',
      schedule: 'Twice daily',
      time: 'Morning/Evening',
      nextDose: 'Today, 8:00 PM',
      remaining: 8,
      adherence: 95
    },
    { 
      name: 'Atorvastatin', 
      dosage: '20mg',
      schedule: 'Once daily',
      time: 'Evening',
      nextDose: 'Today, 9:00 PM',
      remaining: 15,
      adherence: 100
    },
  ];

  // Health radar data
  const healthRadarData = [
    { subject: 'Cardio', score: 80, fullMark: 100 },
    { subject: 'Flexibility', score: 70, fullMark: 100 },
    { subject: 'Strength', score: 65, fullMark: 100 },
    { subject: 'Endurance', score: 75, fullMark: 100 },
    { subject: 'Balance', score: 60, fullMark: 100 },
    { subject: 'Nutrition', score: 85, fullMark: 100 },
  ];

  const COLORS = ['#2E7D32', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
              <Heart className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">OurTopClinic</h1>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="#search">
                <Search className="h-5 w-5" />
              </a>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">3</span>
            </Button>
            
            <div className="flex items-center gap-2 ml-2 bg-muted/40 p-1.5 rounded-full">
              <Avatar className="h-7 w-7 border border-white">
                <AvatarFallback className="text-xs bg-primary text-white">JL</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm mr-1 hidden sm:inline-block">Jay</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:flex">
        {/* Sidebar navigation */}
        <aside className="lg:w-64 lg:mr-6 mb-6 lg:mb-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 sticky top-20">
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                <Home className="h-4 w-4 mr-3" />
                <span>Dashboard</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                <Calendar className="h-4 w-4 mr-3" />
                <span>Appointments</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                <Pill className="h-4 w-4 mr-3" />
                <span>Medications</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                <FileText className="h-4 w-4 mr-3" />
                <span>Medical Records</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                <Activity className="h-4 w-4 mr-3" />
                <span>Health Tracking</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                <User className="h-4 w-4 mr-3" />
                <span>Profile</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                <Settings className="h-4 w-4 mr-3" />
                <span>Settings</span>
              </Button>
            </nav>
            
            <div className="mt-6 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Need help?</h3>
              <p className="text-xs text-muted-foreground mb-3">Contact our support team for assistance</p>
              <Button size="sm" variant="outline" className="w-full text-sm">Contact Support</Button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1">
          {/* Welcome header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, Jay! 👋</h1>
            <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {healthStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <CardDescription>{stat.target}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mb-1">{stat.name}</p>
                    <Progress value={stat.progress} className="h-1 mt-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Tabs for different content sections */}
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar & Appointments */}
                <Card className="lg:col-span-2 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Upcoming Appointments
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-sm">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-3">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {appointment.doctor.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{appointment.doctor}</h4>
                              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{appointment.date}</span>
                                <Clock className="h-3 w-3 ml-2 mr-1" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant={appointment.isVideo ? "default" : "outline"} size="sm" className={appointment.isVideo ? "gradient-bg" : ""}>
                            {appointment.isVideo ? (
                              <>
                                <Video className="h-3.5 w-3.5 mr-1.5" />
                                Join Now
                              </>
                            ) : (
                              'View Details'
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Radar chart */}
                <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-primary" />
                      Health Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={healthRadarData}>
                          <PolarGrid stroke="#e5e5e5" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                          <Radar name="Health" dataKey="score" stroke="#2E7D32" fill="#2E7D32" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Medications */}
              <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <Pill className="h-5 w-5 mr-2 text-primary" />
                      Medications
                    </CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <CardDescription>Your current medication schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medications.map((medication, i) => (
                      <div key={i} className="p-4 rounded-lg bg-muted/30 border border-muted">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Pill className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">{medication.name}</h4>
                            <p className="text-sm text-muted-foreground">{medication.dosage} • {medication.schedule}</p>
                            <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                              {medication.nextDose}
                            </Badge>
                            <div className="mt-3 flex items-center text-xs">
                              <span className="text-muted-foreground">Adherence</span>
                              <span className="ml-auto font-medium">{medication.adherence}%</span>
                            </div>
                            <Progress value={medication.adherence} className="h-1 mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Step Count</CardTitle>
                    <CardDescription>Your activity over the past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="steps" fill="#2E7D32" name="Steps" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Calories Burned</CardTitle>
                    <CardDescription>Daily energy expenditure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData}>
                          <defs>
                            <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ff9800" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <RechartsTooltip />
                          <Area type="monotone" dataKey="calories" stroke="#ff9800" fillOpacity={1} fill="url(#colorCalories)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Sleep Tab */}
            <TabsContent value="sleep">
              <Card>
                <CardHeader>
                  <CardTitle>Sleep Analysis</CardTitle>
                  <CardDescription>Your sleep patterns over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sleepData} barGap={0} barCategoryGap={12}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="deep" name="Deep Sleep" stackId="a" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="light" name="Light Sleep" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="rem" name="REM Sleep" stackId="a" fill="#93C5FD" radius={[0, 0, 4, 4]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#1E40AF] mr-2"></div>
                        <span className="text-sm">Deep Sleep</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-2"></div>
                        <span className="text-sm">Light Sleep</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#93C5FD] mr-2"></div>
                        <span className="text-sm">REM</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Nutrition Tab */}
            <TabsContent value="nutrition">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Overview</CardTitle>
                    <CardDescription>Your dietary breakdown for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Protein', value: 30 },
                              { name: 'Carbs', value: 45 },
                              { name: 'Fats', value: 25 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {[0, 1, 2].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold">30%</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                          <div className="w-full h-1 bg-muted mt-1">
                            <div className="h-full bg-[#2E7D32]" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">45%</div>
                          <div className="text-xs text-muted-foreground">Carbs</div>
                          <div className="w-full h-1 bg-muted mt-1">
                            <div className="h-full bg-[#8884d8]" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">25%</div>
                          <div className="text-xs text-muted-foreground">Fats</div>
                          <div className="w-full h-1 bg-muted mt-1">
                            <div className="h-full bg-[#82ca9d]" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Water Intake</CardTitle>
                    <CardDescription>Track your daily hydration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-b-full transition-all duration-500"
                          style={{ height: '72%', borderRadius: '50%' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">72%</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-bold">1.8 / 2.5L</h3>
                        <p className="text-sm text-muted-foreground">Today's water intake</p>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 mt-6 w-full">
                        {[1, 2, 3, 4].map((_, i) => (
                          <Button key={i} variant="outline" size="sm" className="h-12 flex flex-col items-center p-1">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"></path>
                            </svg>
                            <span className="text-xs mt-1">+250ml</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;

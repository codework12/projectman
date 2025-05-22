
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, addDays, isSameDay, isValid } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  ArrowRight, 
  Clock,
  Video
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CallTimer from '@/components/video-call/CallTimer';
import { generateMockAppointments, Appointment } from '@/components/video-call/MockAppointmentData';

const AppointmentSchedule: React.FC = () => {
  const [userType, setUserType] = useState<'doctor' | 'patient'>('patient');
  const [date, setDate] = useState<Date>(new Date());
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Determine if we're on the doctor or patient side based on URL
    if (location.pathname.includes('doctor')) {
      setUserType('doctor');
    } else {
      setUserType('patient');
    }
    
    // Generate mock appointments
    const mockAppts = generateMockAppointments(userType);
    setAppointments(mockAppts);
    
    // Create array of dates for the week view
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setVisibleDates(dates);
  }, [location.pathname, userType]);
  
  // Find the next upcoming appointment
  const nextAppointment = appointments
    .filter(app => {
      const appointmentDate = new Date(app.date);
      return isValid(appointmentDate) && appointmentDate > new Date() && app.status === 'upcoming';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
  // Get appointments for the selected date
  const selectedDateAppointments = appointments
    .filter(app => {
      const appointmentDate = new Date(app.date);
      return isValid(appointmentDate) && isSameDay(appointmentDate, selectedDate);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  // Function to join a video call
  const joinAppointment = (appointment: Appointment) => {
    navigate(userType === 'doctor' ? '/app/doctor/video-call' : '/app/patient/video-call');
  };
  
  // Function to navigate between weeks
  const navigateWeek = (direction: 'prev' | 'next') => {
    const firstDate = visibleDates[0];
    const newDates = visibleDates.map(date => 
      addDays(date, direction === 'next' ? 7 : -7)
    );
    setVisibleDates(newDates);
    // Also update selected date
    setSelectedDate(addDays(selectedDate, direction === 'next' ? 7 : -7));
  };
  
  // Function to highlight days with appointments on the calendar
  const isDayWithAppointments = (day: Date) => {
    return appointments.some(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isValid(appointmentDate) && isSameDay(day, appointmentDate);
    });
  };

  // Safe format function to handle invalid dates
  const safeFormat = (date: Date | null | undefined, formatStr: string): string => {
    if (!date || !isValid(date)) {
      return 'Invalid date';
    }
    return format(date, formatStr);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {userType === 'doctor' ? 'Doctor Schedule' : 'My Appointments'}
        </h1>
        <Tabs defaultValue={userType} className="w-[200px]" onValueChange={(val) => setUserType(val as 'doctor' | 'patient')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Next appointment alert */}
      {nextAppointment && (
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <h3 className="text-lg font-semibold">Next Appointment</h3>
              <p className="text-gray-600">
                {userType === 'doctor' 
                  ? `With ${nextAppointment.patientName}` 
                  : `With Dr. ${nextAppointment.doctorName}`}
                {' - '}
                {nextAppointment.reason}
              </p>
              <p className="text-sm text-muted-foreground">
                {safeFormat(new Date(nextAppointment.date), 'EEEE, MMMM d, yyyy')} at {safeFormat(new Date(nextAppointment.date), 'h:mm a')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <CallTimer 
                durationMinutes={0}
                startTime={null}
                appointmentTime={new Date(nextAppointment.date)}
                className="text-base font-medium"
              />
              <Button 
                onClick={() => joinAppointment(nextAppointment)}
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Join Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mb-4"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {safeFormat(selectedDate, 'MMMM yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  modifiers={{
                    hasAppointment: (day) => isDayWithAppointments(day)
                  }}
                  modifiersStyles={{
                    hasAppointment: {
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                      textDecoration: 'underline',
                    }
                  }}
                  className="rounded-md pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">Legend</h3>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Cancelled</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Week view and appointments */}
        <div className="lg:col-span-3 space-y-6">
          {/* Week navigation */}
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4 border-b">
                <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous Week
                </Button>
                <h3 className="font-medium">
                  {safeFormat(visibleDates[0], 'MMM d')} - {safeFormat(visibleDates[6], 'MMM d, yyyy')}
                </h3>
                <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                  Next Week <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Week view */}
              <div className="grid grid-cols-7 border-b">
                {visibleDates.map((date, index) => (
                  <div 
                    key={index}
                    className={`p-3 text-center cursor-pointer transition-colors hover:bg-accent ${
                      isSameDay(date, selectedDate) ? 'bg-accent/50' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <p className="text-xs text-muted-foreground">{safeFormat(date, 'EEE')}</p>
                    <p className={`text-lg ${isSameDay(date, new Date()) ? 'font-bold text-primary' : ''}`}>
                      {safeFormat(date, 'd')}
                    </p>
                    {/* Indicator for appointments */}
                    {appointments.some(app => {
                      const appointmentDate = new Date(app.date);
                      return isValid(appointmentDate) && isSameDay(appointmentDate, date);
                    }) && (
                      <div className="flex justify-center mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Appointments for selected date */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Appointments for {safeFormat(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedDateAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    userType={userType}
                    onJoin={joinAppointment}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Appointments</h3>
                  <p className="text-muted-foreground">
                    You don't have any appointments scheduled for this day.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  userType: 'doctor' | 'patient';
  onJoin: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, userType, onJoin }) => {
  const appointmentTime = new Date(appointment.date);
  const isPast = isValid(appointmentTime) && appointmentTime < new Date();
  const isOngoing = appointment.status === 'ongoing';
  const isUpcoming = !isPast && appointment.status === 'upcoming';
  
  // Safe format function to handle invalid dates
  const safeFormat = (date: Date | null | undefined, formatStr: string): string => {
    if (!date || !isValid(date)) {
      return 'Invalid date';
    }
    return format(date, formatStr);
  };

  return (
    <Card className={`
      overflow-hidden
      ${isOngoing ? 'border-l-4 border-l-primary' : ''}
      ${isUpcoming ? 'border-l-4 border-l-blue-500' : ''}
    `}>
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Time column */}
          <div className="bg-accent/40 p-4 text-center flex flex-col justify-center items-center min-w-[120px]">
            <p className="text-xl font-semibold">{safeFormat(appointmentTime, 'h:mm')}</p>
            <p className="text-sm">{safeFormat(appointmentTime, 'a')}</p>
            <p className="text-xs text-muted-foreground mt-1">{appointment.durationMinutes} min</p>
          </div>
          
          {/* Details column */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">
                    {userType === 'doctor' ? appointment.patientName : appointment.doctorName}
                  </h4>
                  <Badge variant={
                    appointment.status === 'completed' ? 'success' :
                    appointment.status === 'ongoing' ? 'default' :
                    appointment.status === 'cancelled' ? 'destructive' : 'info'
                  } className="text-xs">
                    {appointment.status === 'upcoming' ? 'Scheduled' : 
                     appointment.status === 'ongoing' ? 'In Progress' : 
                     appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                
                {/* Countdown timer for upcoming appointments */}
                {isUpcoming && isValid(appointmentTime) && (
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <CallTimer 
                      durationMinutes={0}
                      startTime={null}
                      appointmentTime={appointmentTime}
                      className="text-xs"
                    />
                  </div>
                )}
              </div>
              
              {/* Action button */}
              <div>
                {isOngoing || isUpcoming ? (
                  <Button 
                    onClick={() => onJoin(appointment)}
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Video className="h-3 w-3" />
                    {isOngoing ? 'Join Now' : 'Enter Waiting Room'}
                  </Button>
                ) : appointment.status === 'completed' ? (
                  <Button variant="outline" size="sm">
                    View Summary
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentSchedule;


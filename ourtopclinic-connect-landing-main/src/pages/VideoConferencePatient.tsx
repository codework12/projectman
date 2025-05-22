
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  Video, VideoOff, Mic, MicOff, MessageSquare, 
  ChevronRight, User, Phone, Volume, VolumeX,
  ScreenShare, ScreenShareOff, Hand, Activity
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import WaitingRoom from '@/components/video-call/WaitingRoom';
import VideoCallChat from '@/components/video-call/VideoCallChat';
import CallTimer from '@/components/video-call/CallTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientControls from '@/components/video-call/PatientControls';

const VideoConferencePatient = () => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showDoctorInfo, setShowDoctorInfo] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [callStarted, setCallStarted] = useState<Date | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [currentTab, setCurrentTab] = useState("info");
  const [callQuality, setCallQuality] = useState<'good' | 'fair' | 'poor'>('good');
  
  // Sample doctor data
  const doctorData = {
    id: '123',
    name: 'Dr. Emily Chen',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    specialty: 'Cardiology',
    qualifications: 'MD, FACC',
    hospital: 'City General Hospital',
    languages: ['English', 'Mandarin', 'Spanish'],
    rating: 4.8,
    reviews: 145
  };

  // This would typically come from actual appointment data
  const appointmentDetails = {
    durationMinutes: 15,
    scheduledTime: '10:30 AM',
    reason: 'Follow-up consultation for heart palpitations',
    previousAppointment: '2 weeks ago',
    nextSteps: 'Review test results and adjust medication if needed'
  };

  // Simulate doctor admitting the patient after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStarted(new Date());
      
      setTimeout(() => {
        setIsAdmitted(true);
        toast({
          title: "You've been admitted",
          description: "The doctor has started the session.",
        });
      }, 5000);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  // Simulate occasional network quality changes
  useEffect(() => {
    if (isAdmitted) {
      const qualityInterval = setInterval(() => {
        const qualities: Array<'good' | 'fair' | 'poor'> = ['good', 'good', 'good', 'fair', 'good', 'good'];
        const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
        
        if (randomQuality !== callQuality && randomQuality === 'fair') {
          toast({
            title: "Network quality reduced",
            description: "Your connection quality has decreased. Video might be affected.",
            variant: "default"
          });
        }
        
        setCallQuality(randomQuality);
      }, 45000);
      
      return () => clearInterval(qualityInterval);
    }
  }, [isAdmitted, callQuality, toast]);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    toast({
      title: isCameraOn ? "Camera turned off" : "Camera turned on",
      description: isCameraOn ? "Your video is now disabled" : "Your video is now enabled",
    });
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast({
      title: isMicOn ? "Microphone muted" : "Microphone unmuted",
      description: isMicOn ? "Your microphone is now muted" : "Your microphone is now unmuted",
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      description: isScreenSharing ? "You've stopped sharing your screen" : "You're now sharing your screen",
    });
  };

  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
    toast({
      title: handRaised ? "Hand lowered" : "Hand raised",
      description: handRaised ? "Your hand is now lowered" : "You've raised your hand. The doctor will be notified.",
    });
  };

  const toggleVolume = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Audio unmuted" : "Audio muted",
      description: isMuted ? "You can now hear the doctor" : "Doctor's audio is now muted",
    });
  };

  const endCall = () => {
    toast({
      title: "Call ended",
      description: "The video call has been ended.",
    });
    // Redirect to patient dashboard or another appropriate page
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's up",
      description: "Your scheduled appointment time has ended.",
      variant: "destructive"
    });
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Main Content */}
      <div className={`flex flex-col w-full h-full ${showChat && !isSmallScreen ? 'md:w-3/4' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-card/80 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={doctorData.avatar} alt={doctorData.name} />
              <AvatarFallback>{doctorData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{doctorData.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {isAdmitted ? "Live" : "Waiting"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{doctorData.specialty}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`
                ${callQuality === 'good' ? 'border-green-500 text-green-600' : 
                  callQuality === 'fair' ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-600'}
              `}
            >
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>{callQuality === 'good' ? 'Good' : callQuality === 'fair' ? 'Fair' : 'Poor'}</span>
              </div>
            </Badge>
            
            <button 
              className="text-sm text-primary hover:underline flex items-center gap-1"
              onClick={() => setShowDoctorInfo(!showDoctorInfo)}
            >
              <User className="h-4 w-4" />
              {showDoctorInfo ? 'Hide Info' : 'Doctor Info'}
            </button>
            
            <CallTimer 
              durationMinutes={appointmentDetails.durationMinutes} 
              startTime={callStarted} 
              onTimeUp={handleTimeUp} 
              className="hidden sm:flex"
            />

            {!isSmallScreen && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="h-4 w-4" />
                {showChat ? 'Hide Chat' : 'Show Chat'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Video Area */}
        <div className="flex-1 bg-black relative overflow-hidden">
          {!isAdmitted ? (
            <WaitingRoom 
              doctorName={doctorData.name}
              doctorAvatar={doctorData.avatar}
              doctorSpecialty={doctorData.specialty}
              appointmentTime={appointmentDetails.scheduledTime}
              reason={appointmentDetails.reason}
            />
          ) : (
            <>
              {/* Main Video (Doctor) */}
              <div className="w-full h-full flex items-center justify-center">
                {isCameraOn ? (
                  <div className="relative w-full h-full">
                    <img 
                      src="https://randomuser.me/api/portraits/women/42.jpg" 
                      alt="Doctor Video Stream" 
                      className="w-full h-full object-cover"
                    />
                    {/* Network quality indicator overlay */}
                    {callQuality !== 'good' && (
                      <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Poor connection</span>
                      </div>
                    )}
                    
                    {/* Doctor name overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
                      {doctorData.name} • Speaking
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white">
                    <User className="h-16 w-16 mb-2" />
                    <p>Doctor's camera is off</p>
                  </div>
                )}
              </div>
              
              {/* Patient's Video (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-primary">
                {isCameraOn ? (
                  <div className="relative h-full">
                    <img 
                      src="https://randomuser.me/api/portraits/women/33.jpg" 
                      alt="Patient Video Stream" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white px-2 py-0.5 rounded-md text-xs">
                      You
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white">
                    <User className="h-10 w-10 mb-1" />
                    <p className="text-sm">Your camera is off</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Video Controls */}
        <div className="flex flex-col bg-card/90 backdrop-blur-sm pt-2 pb-4">
          {/* Patient specific controls */}
          <PatientControls 
            handRaised={handRaised}
            onRaiseHand={toggleHandRaise}
            isAdmitted={isAdmitted}
          />
          
          <CallTimer 
            durationMinutes={appointmentDetails.durationMinutes} 
            startTime={callStarted} 
            onTimeUp={handleTimeUp} 
            className="flex sm:hidden mx-auto mb-2"
          />
          
          {/* Standard video controls */}
          <div className="flex items-center justify-center gap-3 p-2">
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-11 w-11 ${!isMicOn ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''}`}
              onClick={toggleMic}
              disabled={!isAdmitted}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-11 w-11 ${!isCameraOn ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''}`}
              onClick={toggleCamera}
              disabled={!isAdmitted}
            >
              {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant={isScreenSharing ? "secondary" : "outline"}
              size="icon" 
              className="rounded-full h-11 w-11"
              onClick={toggleScreenShare}
              disabled={!isAdmitted}
            >
              {isScreenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-11 w-11"
              onClick={toggleVolume}
              disabled={!isAdmitted}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full h-11 w-11"
              onClick={endCall}
            >
              <Phone className="h-5 w-5 rotate-135" />
            </Button>

            {isSmallScreen && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-11 w-11"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Doctor Info Side Panel */}
      {showDoctorInfo && (
        <div className={`w-full md:w-[350px] border-l bg-background flex flex-col ${isSmallScreen ? 'fixed inset-0 z-50' : ''}`}>
          <div className="flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm">
            <h3 className="font-medium">Doctor Information</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowDoctorInfo(false)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 p-2 mx-3 mt-2">
              <TabsTrigger value="info">Profile</TabsTrigger>
              <TabsTrigger value="appointment">Appointment</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="flex-1 overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {/* Doctor Profile */}
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarImage src={doctorData.avatar} alt={doctorData.name} />
                      <AvatarFallback>{doctorData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-medium">{doctorData.name}</h2>
                    <p className="text-muted-foreground">{doctorData.specialty}</p>
                    <p className="text-sm">{doctorData.qualifications}</p>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Hospital</h3>
                      <p className="text-sm">{doctorData.hospital}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {doctorData.languages.map((language, i) => (
                          <div key={i} className="bg-muted/50 text-xs px-2 py-1 rounded-md">
                            {language}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Rating</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(doctorData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm">{doctorData.rating} ({doctorData.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">About</h3>
                      <p className="text-sm">
                        Dr. Emily Chen is a board-certified cardiologist with over 12 years of experience in diagnosing and treating heart conditions. Her approach combines the latest medical research with personalized care plans tailored to each patient's unique needs.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="appointment" className="flex-1 overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Reason for Visit</h3>
                    <p className="text-sm">{appointmentDetails.reason}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Scheduled Time</h3>
                    <p className="text-sm">{appointmentDetails.scheduledTime}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Duration</h3>
                    <p className="text-sm">{appointmentDetails.durationMinutes} minutes</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Previous Appointment</h3>
                    <p className="text-sm">{appointmentDetails.previousAppointment}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Expected Next Steps</h3>
                    <p className="text-sm">{appointmentDetails.nextSteps}</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="notes" className="flex-1 overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Consultation Notes</h3>
                    <p className="text-sm text-muted-foreground">
                      The doctor will share consultation notes with you after the session. They will appear in your medical records once the appointment is complete.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-1">Your Notes</h3>
                    <textarea 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      rows={6}
                      placeholder="Take notes during your appointment..."
                    />
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-1">Questions to Ask</h3>
                    <textarea 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      rows={4}
                      placeholder="List questions you want to ask the doctor..."
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Chat Side Panel */}
      {showChat && (
        <div className={`${isSmallScreen ? 'fixed inset-0 z-50' : 'w-1/4'} flex flex-col h-full`}>
          <VideoCallChat 
            onClose={isSmallScreen ? () => setShowChat(false) : undefined} 
          />
        </div>
      )}
    </div>
  );
};

export default VideoConferencePatient;

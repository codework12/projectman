import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Video, VideoOff, Mic, MicOff, MessageSquare, FileText, 
  ChevronRight, Save, User, Phone, Activity 
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import CallTimer from '@/components/video-call/CallTimer';
import VideoCallChat from '@/components/video-call/VideoCallChat';
import DoctorControls from '@/components/video-call/DoctorControls';

const VideoConferenceDoctor = () => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [diagnosisNote, setDiagnosisNote] = useState('');
  const [activeSidePanel, setActiveSidePanel] = useState('notes');
  const [showChat, setShowChat] = useState(false);
  const [callStarted, setCallStarted] = useState<Date | null>(null);
  const [patientWaiting, setPatientWaiting] = useState(false);
  const [patientAdmitted, setPatientAdmitted] = useState(false);
  
  // Sample patient data
  const patientData = {
    id: '456',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    age: 32,
    gender: 'Female',
    appointmentReason: 'Follow-up for blood pressure',
    medicalConditions: ['Hypertension', 'Asthma'],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'As needed' }
    ],
    allergies: [
      { allergen: 'Penicillin', severity: 'Severe' },
      { allergen: 'Peanuts', severity: 'Moderate' }
    ],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6
    },
    notes: [
      { date: new Date(2023, 3, 15), content: 'Patient complained about occasional headaches. Recommended to monitor blood pressure daily.' },
      { date: new Date(2023, 2, 1), content: 'Increased Lisinopril dosage from 5mg to 10mg daily. Follow-up in 6 weeks.' }
    ]
  };

  // This would typically come from actual appointment data
  const appointmentDetails = {
    durationMinutes: 15,
    scheduledTime: '10:30 AM'
  };

  const handleSaveDiagnosis = () => {
    console.log('Saving diagnosis:', diagnosisNote);
    toast({
      title: 'Diagnosis saved',
      description: 'The diagnosis has been saved to the patient records.',
    });
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const endCall = () => {
    toast({
      title: 'Call ended',
      description: 'The video call has been ended.',
    });
    // Redirect to doctor dashboard or another appropriate page
  };

  const handleStartCall = () => {
    setCallStarted(new Date());
    
    // Simulate patient joining waiting room after a short delay
    setTimeout(() => {
      setPatientWaiting(true);
      toast({
        title: 'Patient waiting',
        description: 'Sarah Johnson has joined the waiting room.',
      });
    }, 3000);
  };

  const handleAdmitPatient = () => {
    setPatientAdmitted(true);
    setPatientWaiting(false);
  };

  const handleRemovePatient = () => {
    setPatientAdmitted(false);
    
    toast({
      title: 'Patient removed',
      description: 'The patient has been removed from the call.',
    });
  };

  const handleTimeUp = () => {
    toast({
      title: 'Session ended',
      description: 'The scheduled appointment time has ended.',
      variant: 'destructive'
    });
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Main Content */}
      <div className={`flex flex-col w-full h-full ${showChat && !isSmallScreen ? 'md:w-3/4' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={patientData.avatar} alt={patientData.name} />
              <AvatarFallback>{patientData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{patientData.name}</h3>
              <p className="text-xs text-muted-foreground">{patientData.age} years • {patientData.gender}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={callStarted ? "outline" : "secondary"} className={callStarted ? "border-green-500 text-green-600" : ""}>
              {callStarted ? "Live Session" : "Not Started"}
            </Badge>
            
            <CallTimer 
              durationMinutes={appointmentDetails.durationMinutes} 
              startTime={callStarted} 
              onTimeUp={handleTimeUp} 
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
          {/* Main Video (Patient) - only show if patient is admitted */}
          <div className="w-full h-full flex items-center justify-center">
            {patientAdmitted ? (
              isCameraOn ? (
                <img 
                  src="https://randomuser.me/api/portraits/women/33.jpg" 
                  alt="Patient Video Stream" 
                  className="max-w-full max-h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <User className="h-16 w-16 mb-2" />
                  <p>Patient's camera is off</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                {!callStarted ? (
                  <>
                    <Video className="h-16 w-16 mb-4 opacity-50" />
                    <h2 className="text-xl font-bold mb-2">Start the session</h2>
                    <p className="text-muted-foreground max-w-md text-center">
                      Click the "Start Session" button below to begin the video call with Sarah Johnson
                    </p>
                  </>
                ) : patientWaiting ? (
                  <>
                    <User className="h-16 w-16 mb-4 opacity-70" />
                    <h2 className="text-xl font-bold mb-2">Patient is waiting</h2>
                    <p className="text-muted-foreground max-w-md text-center">
                      Sarah Johnson is in the waiting room. Click "Admit Patient" to let them join.
                    </p>
                  </>
                ) : (
                  <>
                    <Video className="h-16 w-16 mb-4 opacity-50" />
                    <h2 className="text-xl font-bold mb-2">Waiting for patient</h2>
                    <p className="text-muted-foreground max-w-md text-center">
                      The patient hasn't joined the waiting room yet
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Doctor's Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-background">
            {isCameraOn ? (
              <img 
                src="https://randomuser.me/api/portraits/women/42.jpg" 
                alt="Doctor Video Stream" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <User className="h-10 w-10 mb-1" />
                <p className="text-sm">Camera is off</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Video Controls */}
        <div className="flex flex-col bg-card px-4 pt-2 pb-4">
          {/* Doctor specific controls */}
          <DoctorControls
            onStartCall={handleStartCall}
            onAdmitPatient={handleAdmitPatient}
            onRemovePatient={handleRemovePatient}
            callStarted={callStarted !== null}
            patientWaiting={patientWaiting}
            patientAdmitted={patientAdmitted}
          />
          
          {/* Standard video controls */}
          <div className="flex items-center justify-center gap-4 p-4">
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-12 w-12 ${!isMicOn ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''}`}
              onClick={toggleMic}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-12 w-12 ${!isCameraOn ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''}`}
              onClick={toggleCamera}
            >
              {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={endCall}
            >
              <Phone className="h-5 w-5 rotate-135" />
            </Button>
            
            {isSmallScreen && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            )}
            
            {isSmallScreen && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12"
                onClick={() => setActiveSidePanel(activeSidePanel === 'notes' ? 'patient' : 'notes')}
              >
                {activeSidePanel === 'notes' ? <User className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Side Panel (if not on mobile) */}
      {showChat && !isSmallScreen && (
        <div className="w-1/4 flex flex-col h-full">
          <VideoCallChat />
        </div>
      )}
      
      {/* Side Panel */}
      <div className={`w-[350px] border-l bg-background flex flex-col ${isSmallScreen || showChat ? 'hidden' : ''}`}>
        <Tabs defaultValue="notes" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 p-2">
            <TabsTrigger value="notes">Diagnosis & Notes</TabsTrigger>
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="flex-1 flex flex-col">
            <div className="p-4 flex-1 overflow-hidden flex flex-col">
              <h3 className="font-medium mb-2">Medical Notes</h3>
              <div className="mb-4">
                <Label htmlFor="diagnosis" className="text-sm">Diagnosis</Label>
                <Select defaultValue="hypertension">
                  <SelectTrigger>
                    <SelectValue placeholder="Select diagnosis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hypertension">Hypertension</SelectItem>
                    <SelectItem value="asthma">Asthma</SelectItem>
                    <SelectItem value="diabetes">Diabetes</SelectItem>
                    <SelectItem value="migraine">Migraine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="notes" className="text-sm">Notes</Label>
                  <span className="text-xs text-muted-foreground">{diagnosisNote.length}/500</span>
                </div>
                <Textarea 
                  id="notes" 
                  placeholder="Enter your diagnosis and notes..." 
                  className="resize-none h-32"
                  value={diagnosisNote}
                  onChange={(e) => setDiagnosisNote(e.target.value)}
                  maxLength={500}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-1 block">Medications</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="med1" />
                      <label htmlFor="med1" className="text-sm">Continue Lisinopril 10mg daily</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="med2" />
                      <label htmlFor="med2" className="text-sm">Adjust dosage</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="med3" />
                      <label htmlFor="med3" className="text-sm">New prescription</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm mb-1 block">Follow-up</Label>
                  <Select defaultValue="2weeks">
                    <SelectTrigger>
                      <SelectValue placeholder="Select follow-up time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1week">1 week</SelectItem>
                      <SelectItem value="2weeks">2 weeks</SelectItem>
                      <SelectItem value="1month">1 month</SelectItem>
                      <SelectItem value="3months">3 months</SelectItem>
                      <SelectItem value="custom">Custom date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <Switch id="share-with-patient" />
                <Label htmlFor="share-with-patient">Share with patient</Label>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <Button className="w-full" onClick={handleSaveDiagnosis}>
                <Save className="h-4 w-4 mr-2" />
                Save Diagnosis
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="patient" className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Patient Overview */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={patientData.avatar} alt={patientData.name} />
                      <AvatarFallback>{patientData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{patientData.name}</h3>
                      <p className="text-sm text-muted-foreground">{patientData.age} years • {patientData.gender}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2">
                    <span className="font-medium">Reason for visit:</span> {patientData.appointmentReason}
                  </p>
                </div>
                
                {/* Vital Signs */}
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Activity className="h-4 w-4 text-primary" /> 
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-md p-2 text-center">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-medium">{patientData.vitalSigns.bloodPressure}</p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2 text-center">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-medium">{patientData.vitalSigns.heartRate} bpm</p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2 text-center">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-medium">{patientData.vitalSigns.temperature}°F</p>
                    </div>
                  </div>
                </div>
                
                {/* Medical Conditions */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Medical Conditions</h3>
                  <div className="space-y-1">
                    {patientData.medicalConditions.map((condition, i) => (
                      <div key={i} className="bg-muted/50 rounded-md px-3 py-2 text-sm">
                        {condition}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Allergies */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Allergies</h3>
                  <div className="space-y-2">
                    {patientData.allergies.map((allergy, i) => (
                      <div key={i} className="flex justify-between items-center bg-muted/50 rounded-md px-3 py-2">
                        <span className="text-sm">{allergy.allergen}</span>
                        <Badge variant={allergy.severity === 'Severe' ? 'destructive' : 'outline'}>
                          {allergy.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Medications */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Current Medications</h3>
                  <div className="space-y-2">
                    {patientData.medications.map((medication, i) => (
                      <div key={i} className="bg-muted/50 rounded-md px-3 py-2">
                        <p className="font-medium text-sm">{medication.name}</p>
                        <p className="text-xs text-muted-foreground">{medication.dosage} • {medication.frequency}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Previous Notes */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Previous Notes</h3>
                  <div className="space-y-3">
                    {patientData.notes.map((note, i) => (
                      <div key={i} className="border rounded-md p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {new Intl.DateTimeFormat('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          }).format(note.date)}
                        </p>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Full Medical Record
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Mobile Side Panel (only visible on small screens) */}
      {isSmallScreen && (showChat || activeSidePanel) && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            {showChat ? (
              <VideoCallChat onClose={() => setShowChat(false)} />
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">{activeSidePanel === 'notes' ? 'Diagnosis & Notes' : 'Patient Info'}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setActiveSidePanel('')}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                
                <ScrollArea className="flex-1">
                  {activeSidePanel === 'notes' ? (
                    <div className="p-4">
                      <h3 className="font-medium mb-2">Medical Notes</h3>
                      <div className="mb-4">
                        <Label htmlFor="mobile-diagnosis" className="text-sm">Diagnosis</Label>
                        <Select defaultValue="hypertension">
                          <SelectTrigger>
                            <SelectValue placeholder="Select diagnosis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hypertension">Hypertension</SelectItem>
                            <SelectItem value="asthma">Asthma</SelectItem>
                            <SelectItem value="diabetes">Diabetes</SelectItem>
                            <SelectItem value="migraine">Migraine</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="mobile-notes" className="text-sm">Notes</Label>
                          <span className="text-xs text-muted-foreground">{diagnosisNote.length}/500</span>
                        </div>
                        <Textarea 
                          id="mobile-notes" 
                          placeholder="Enter your diagnosis and notes..." 
                          className="resize-none h-32"
                          value={diagnosisNote}
                          onChange={(e) => setDiagnosisNote(e.target.value)}
                          maxLength={500}
                        />
                      </div>
                      
                      {/* Additional fields as in desktop view */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-1 block">Medications</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="mobile-med1" />
                              <label htmlFor="mobile-med1" className="text-sm">Continue Lisinopril 10mg daily</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="mobile-med2" />
                              <label htmlFor="mobile-med2" className="text-sm">Adjust dosage</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="mobile-med3" />
                              <label htmlFor="mobile-med3" className="text-sm">New prescription</label>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm mb-1 block">Follow-up</Label>
                          <Select defaultValue="2weeks">
                            <SelectTrigger>
                              <SelectValue placeholder="Select follow-up time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1week">1 week</SelectItem>
                              <SelectItem value="2weeks">2 weeks</SelectItem>
                              <SelectItem value="1month">1 month</SelectItem>
                              <SelectItem value="3months">3 months</SelectItem>
                              <SelectItem value="custom">Custom date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-2">
                        <Switch id="mobile-share-with-patient" />
                        <Label htmlFor="mobile-share-with-patient">Share with patient</Label>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-6">
                      {/* Patient Overview */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={patientData.avatar} alt={patientData.name} />
                            <AvatarFallback>{patientData.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{patientData.name}</h3>
                            <p className="text-sm text-muted-foreground">{patientData.age} years • {patientData.gender}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-2">
                          <span className="font-medium">Reason for visit:</span> {patientData.appointmentReason}
                        </p>
                      </div>
                      
                      {/* Same patient info content as in desktop view */}
                      {/* Vital Signs */}
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Activity className="h-4 w-4 text-primary" /> 
                          Vital Signs
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-muted/50 rounded-md p-2 text-center">
                            <p className="text-xs text-muted-foreground">Blood Pressure</p>
                            <p className="font-medium">{patientData.vitalSigns.bloodPressure}</p>
                          </div>
                          <div className="bg-muted/50 rounded-md p-2 text-center">
                            <p className="text-xs text-muted-foreground">Heart Rate</p>
                            <p className="font-medium">{patientData.vitalSigns.heartRate} bpm</p>
                          </div>
                          <div className="bg-muted/50 rounded-md p-2 text-center">
                            <p className="text-xs text-muted-foreground">Temperature</p>
                            <p className="font-medium">{patientData.vitalSigns.temperature}°F</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Rest of patient info sections */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Medical Conditions</h3>
                        <div className="space-y-1">
                          {patientData.medicalConditions.map((condition, i) => (
                            <div key={i} className="bg-muted/50 rounded-md px-3 py-2 text-sm">
                              {condition}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Allergies</h3>
                        <div className="space-y-2">
                          {patientData.allergies.map((allergy, i) => (
                            <div key={i} className="flex justify-between items-center bg-muted/50 rounded-md px-3 py-2">
                              <span className="text-sm">{allergy.allergen}</span>
                              <Badge variant={allergy.severity === 'Severe' ? 'destructive' : 'outline'}>
                                {allergy.severity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Current Medications</h3>
                        <div className="space-y-2">
                          {patientData.medications.map((medication, i) => (
                            <div key={i} className="bg-muted/50 rounded-md px-3 py-2">
                              <p className="font-medium text-sm">{medication.name}</p>
                              <p className="text-xs text-muted-foreground">{medication.dosage} • {medication.frequency}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
                
                {activeSidePanel === 'notes' && (
                  <div className="p-4 border-t">
                    <Button className="w-full" onClick={handleSaveDiagnosis}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Diagnosis
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConferenceDoctor;

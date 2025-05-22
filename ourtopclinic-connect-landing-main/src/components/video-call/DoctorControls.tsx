
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import {
  Play,
  UserPlus,
  UserX,
  Crown,
  Video,
  Mic,
  Phone,
  Settings,
  ScreenShare,
  ScreenShareOff,
  Share,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DoctorControlsProps {
  onStartCall: () => void;
  onAdmitPatient: () => void;
  onRemovePatient: () => void;
  onToggleChat?: () => void;
  onShareScreen?: () => void;
  onShareFile?: () => void;
  onOpenSettings?: () => void;
  callStarted: boolean;
  patientWaiting: boolean;
  patientAdmitted: boolean;
  isScreenSharing?: boolean;
}

const DoctorControls: React.FC<DoctorControlsProps> = ({
  onStartCall,
  onAdmitPatient,
  onRemovePatient,
  onToggleChat,
  onShareScreen,
  onShareFile,
  onOpenSettings,
  callStarted,
  patientWaiting,
  patientAdmitted,
  isScreenSharing = false
}) => {
  const { toast } = useToast();

  const handleStartCall = () => {
    onStartCall();
    toast({
      title: "Video call started",
      description: "You can now admit patients to the call.",
    });
  };

  const handleAdmitPatient = () => {
    onAdmitPatient();
    toast({
      title: "Patient admitted",
      description: "The patient has joined the call.",
    });
  };

  const handleRemovePatient = () => {
    onRemovePatient();
    toast({
      title: "Patient removed",
      description: "The patient has been removed from the call.",
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-center gap-2 border-t pt-4">
        {!callStarted ? (
          <Button 
            onClick={handleStartCall}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        ) : (
          <>
            {patientWaiting && !patientAdmitted && (
              <Button 
                onClick={handleAdmitPatient}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Admit Patient
              </Button>
            )}
            
            {patientAdmitted && (
              <>
                <Button 
                  variant="destructive"
                  onClick={handleRemovePatient}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Remove Patient
                </Button>
                
                {onShareScreen && (
                  <Button
                    variant={isScreenSharing ? "secondary" : "outline"}
                    onClick={onShareScreen}
                  >
                    {isScreenSharing ? (
                      <>
                        <ScreenShareOff className="h-4 w-4 mr-2" />
                        Stop Sharing
                      </>
                    ) : (
                      <>
                        <ScreenShare className="h-4 w-4 mr-2" />
                        Share Screen
                      </>
                    )}
                  </Button>
                )}
                
                {onShareFile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={onShareFile}>
                        <FileText className="h-4 w-4 mr-2" />
                        Share Document
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Crown className="h-4 w-4 mr-2" />
                  Host Controls
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Session Controls</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onToggleChat}>
                  Toggle Chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Mute All Participants
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Disable Video For All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpenSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Session Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorControls;

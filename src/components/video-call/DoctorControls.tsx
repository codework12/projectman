
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Play, UserPlus, UserX, Crown, Video, Mic, Phone } from 'lucide-react';

interface DoctorControlsProps {
  onStartCall: () => void;
  onAdmitPatient: () => void;
  onRemovePatient: () => void;
  callStarted: boolean;
  patientWaiting: boolean;
  patientAdmitted: boolean;
}

const DoctorControls: React.FC<DoctorControlsProps> = ({
  onStartCall,
  onAdmitPatient,
  onRemovePatient,
  callStarted,
  patientWaiting,
  patientAdmitted
}) => {
  const { toast } = useToast();

  const handleStartCall = () => {
    onStartCall();
    toast({
      title: 'Video call started',
      description: 'You can now admit patients to the call.',
    });
  };

  const handleAdmitPatient = () => {
    onAdmitPatient();
    toast({
      title: 'Patient admitted',
      description: 'The patient has joined the call.',
    });
  };

  const handleRemovePatient = () => {
    onRemovePatient();
    toast({
      title: 'Patient removed',
      description: 'The patient has been removed from the call.',
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
              <Button 
                onClick={handleRemovePatient}
                variant="destructive"
              >
                <UserX className="h-4 w-4 mr-2" />
                Remove Patient
              </Button>
            )}
            
            <Button variant="outline">
              <Crown className="h-4 w-4 mr-2" />
              Host Controls
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorControls;

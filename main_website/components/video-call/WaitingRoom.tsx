
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User } from "lucide-react";

interface WaitingRoomProps {
  doctorName: string;
  doctorAvatar?: string;
  doctorSpecialty?: string;
  appointmentTime?: string;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  doctorName,
  doctorAvatar,
  doctorSpecialty,
  appointmentTime
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/30">
      <Card className="max-w-md w-full p-6 space-y-6 text-center">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            {doctorAvatar ? (
              <AvatarImage src={doctorAvatar} alt={doctorName} />
            ) : (
              <AvatarFallback>{doctorName.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          
          <h2 className="text-2xl font-bold">{doctorName}</h2>
          {doctorSpecialty && (
            <p className="text-muted-foreground">{doctorSpecialty}</p>
          )}
        </div>

        <div className="py-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            {appointmentTime ? (
              <span>Appointment scheduled for {appointmentTime}</span>
            ) : (
              <span>Your appointment is scheduled for today</span>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-medium">Waiting for the doctor to start the session</p>
            <p className="text-sm text-muted-foreground">
              Please make sure your camera and microphone are working properly
            </p>
          </div>
        </div>

        <div className="animate-pulse flex items-center justify-center gap-2 text-primary">
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <div className="h-2 w-2 bg-primary rounded-full"></div>
        </div>
      </Card>
    </div>
  );
};

export default WaitingRoom;

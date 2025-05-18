
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CallTimerProps {
  durationMinutes: number; // Total duration in minutes
  startTime?: Date; // When the call officially started, if undefined, not started yet
  onTimeUp?: () => void; // Callback for when time is up
  className?: string;
}

const CallTimer: React.FC<CallTimerProps> = ({ 
  durationMinutes, 
  startTime, 
  onTimeUp,
  className
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  useEffect(() => {
    if (!startTime) {
      setTimeLeft(null);
      return;
    }

    const totalSeconds = durationMinutes * 60;
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeElapsed(elapsedSeconds);
      
      const remaining = totalSeconds - elapsedSeconds;
      setTimeLeft(remaining > 0 ? remaining : 0);
      
      if (remaining <= 0 && onTimeUp) {
        onTimeUp();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onTimeUp]);

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Clock className="h-4 w-4 text-muted-foreground" />
      {startTime ? (
        <div className="flex items-center text-sm">
          <span className={`${timeLeft && timeLeft < 60 ? 'text-red-500 font-medium' : ''}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-muted-foreground mx-1">/</span>
          <span>{durationMinutes}:00</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Not started</span>
      )}
    </div>
  );
};

export default CallTimer;

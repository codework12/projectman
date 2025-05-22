
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Image, FileText } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
  attachment?: {
    type: 'image' | 'file';
    name: string;
    url: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  senderName,
  senderAvatar,
  isRead = false,
  attachment
}) => {
  const isUser = sender === 'user';
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).format(date);
  };

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar className="h-8 w-8">
        {senderAvatar ? (
          <AvatarImage src={senderAvatar} alt={senderName || sender} />
        ) : (
          <AvatarFallback>{(senderName || sender).charAt(0)}</AvatarFallback>
        )}
      </Avatar>
      
      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">
            {senderName || (isUser ? 'You' : 'Other')}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(timestamp)}
          </span>
        </div>
        
        <div 
          className={`rounded-lg px-3 py-2 text-sm ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }`}
        >
          <p>{content}</p>
          
          {attachment && (
            <div className="mt-2">
              {attachment.type === 'image' ? (
                <div className="relative rounded-md overflow-hidden mt-2">
                  <img 
                    src={attachment.url} 
                    alt={attachment.name} 
                    className="max-w-full h-auto object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Image className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-background/50 rounded-md p-2 mt-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs truncate">{attachment.name}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isUser && (
          <div className="flex items-center mt-1">
            <span className="text-xs text-muted-foreground mr-1">
              {isRead ? 'Read' : 'Delivered'}
            </span>
            <Check className={`h-3 w-3 ${isRead ? 'text-blue-500' : 'text-muted-foreground'}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

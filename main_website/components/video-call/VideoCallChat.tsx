
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface VideoCallChatProps {
  onClose?: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  isRead: boolean;
}

const VideoCallChat: React.FC<VideoCallChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I can see you have questions during our session. Feel free to ask anything here.',
      sender: 'other',
      senderName: 'Dr. Emily Chen',
      senderAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      timestamp: new Date(Date.now() - 120000),
      isRead: true
    }
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      senderName: 'You',
      senderAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate doctor response after a short delay
    if (messages.length < 2) {
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: "I see you have a question. Let me address that during our session, but feel free to ask more questions here if needed.",
          sender: 'other',
          senderName: 'Dr. Emily Chen',
          senderAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
          timestamp: new Date(),
          isRead: true
        };
        setMessages(prev => [...prev, response]);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-full border-l bg-background">
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <h3 className="font-medium">Live Chat</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              senderName={message.senderName}
              senderAvatar={message.senderAvatar}
              isRead={message.isRead}
            />
          ))}
        </div>
      </ScrollArea>
      
      <ChatInput 
        onSend={handleSendMessage}
        placeholder="Type a message..."
        className="border-t"
      />
    </div>
  );
};

export default VideoCallChat;

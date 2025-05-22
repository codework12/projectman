
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ChatList, { ChatUser } from '@/components/chat/ChatList';
import ChatHeader from '@/components/chat/ChatHeader';
import FooterSection from '@/components/sections/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';
import { useMediaQuery } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
  isRead: boolean;
}

const MessageCenter = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // Sample data - this would come from your database in real app
  const users: ChatUser[] = [
    {
      id: '1',
      name: 'Dr. Emily Chen',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      lastMessage: 'Your test results look good!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      unreadCount: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Dr. James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastMessage: 'Let me know if you have any questions.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      online: false,
    },
    {
      id: '3',
      name: 'Dr. Maria Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      lastMessage: 'We should schedule a follow-up appointment.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 1,
      online: true,
    },
    {
      id: '4',
      name: 'Dr. Robert Taylor',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      lastMessage: 'Your prescription has been sent to the pharmacy.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      online: false,
    },
  ];

  // Get the selected user based on ID
  const selectedUser = users.find(user => user.id === selectedUserId);
  
  // Sample messages for demo - would come from database
  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        content: 'Hello Dr. Chen! I\'ve been feeling better since our last appointment.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true,
      },
      {
        id: '2',
        content: 'That\'s great to hear! Have you been taking your medication regularly?',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        isRead: true,
      },
      {
        id: '3',
        content: 'Yes, every day as prescribed.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        isRead: true,
      },
      {
        id: '4',
        content: 'Perfect. I\'ve reviewed your recent lab results and everything looks good!',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        isRead: false,
      },
    ],
    '2': [
      {
        id: '1',
        content: 'Good morning Dr. Wilson. I had a question about the side effects we discussed.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        isRead: true,
      },
      {
        id: '2',
        content: 'Of course! What specifically would you like to know?',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isRead: true,
      },
    ],
    '3': [
      {
        id: '1',
        content: 'Dr. Rodriguez, when would you recommend scheduling my follow-up?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
        isRead: true,
      },
      {
        id: '2',
        content: 'I think we should meet again in about 3 weeks. How does your schedule look?',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: false,
      },
    ],
  };

  const currentMessages = selectedUserId ? (messages[selectedUserId] || []) : [];

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    if (isMobile) {
      setShowChatOnMobile(true);
    }
  };

  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content, 'to user:', selectedUserId);
    // In a real app, you would send this to your API
    // and then update the local state with the new message
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-0 sm:px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card shadow-lg rounded-lg overflow-hidden border border-border">
            <div className="flex h-[calc(80vh)]">
              {/* Chat List - Hidden on mobile when a chat is selected */}
              <div 
                className={cn(
                  "w-full md:w-1/3 md:block border-r",
                  isMobile && showChatOnMobile && "hidden"
                )}
              >
                <ChatList 
                  users={users} 
                  selectedUserId={selectedUserId}
                  onSelectUser={handleSelectUser}
                />
              </div>
              
              {/* Chat Area - Shown on mobile only when a chat is selected */}
              <div 
                className={cn(
                  "flex flex-col w-full md:w-2/3",
                  isMobile && !showChatOnMobile && "hidden"
                )}
              >
                {selectedUser ? (
                  <>
                    <ChatHeader 
                      name={selectedUser.name}
                      avatar={selectedUser.avatar}
                      status={selectedUser.online ? "Online" : "Offline"}
                      showBackButton={isMobile}
                      onBack={handleBackToList}
                    />
                    
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {currentMessages.length > 0 ? (
                          currentMessages.map((message) => (
                            <ChatMessage
                              key={message.id}
                              content={message.content}
                              sender={message.sender}
                              timestamp={message.timestamp}
                              senderName={message.sender === 'user' ? 'You' : selectedUser.name}
                              senderAvatar={message.sender === 'user' ? undefined : selectedUser.avatar}
                              isRead={message.isRead}
                            />
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Start a conversation with {selectedUser.name}</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    <ChatInput 
                      onSend={handleSendMessage} 
                      placeholder={`Message ${selectedUser.name}...`}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">Choose a doctor or patient to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FooterSection />
      <ScrollToTop />
    </div>
  );
};

export default MessageCenter;

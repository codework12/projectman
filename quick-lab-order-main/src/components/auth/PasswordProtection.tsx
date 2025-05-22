
import React, { useState, useEffect } from 'react';
import { Lock, Mail, KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

// Next.js safe way to handle localStorage and sessionStorage
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const getSessionStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
};

const setSessionStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, value);
  }
};

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [email, setEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'reset'>('login');
  
  // Check if there's already a password set (Next.js safe)
  const hasPassword = getLocalStorage('app-password') !== null;
  
  useEffect(() => {
    // Check if user is already authenticated in this session (Next.js safe)
    const authenticated = getSessionStorage('authenticated');
    if (authenticated === 'true') {
      setIsUnlocked(true);
      return;
    }
    
    // If there's no password set yet, prompt to create one
    if (!hasPassword) {
      setShowDialog(true);
    } else {
      // Otherwise, show the login dialog
      setShowDialog(true);
    }
  }, []);

  const handleSetPassword = () => {
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // In a real app, we would hash the password
    localStorage.setItem('app-password', password);
    localStorage.setItem('app-email', email || 'default@example.com');
    
    sessionStorage.setItem('authenticated', 'true');
    setIsUnlocked(true);
    setShowDialog(false);
    
    toast.success('Password set successfully');
  };

  const handleLogin = () => {
    const storedPassword = localStorage.getItem('app-password');
    
    if (currentPassword === storedPassword) {
      sessionStorage.setItem('authenticated', 'true');
      setIsUnlocked(true);
      setShowDialog(false);
      toast.success('Logged in successfully');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleRequestReset = () => {
    const storedEmail = localStorage.getItem('app-email');
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (email === storedEmail) {
      setResetRequested(true);
      // In a real app, we would send a reset email
      toast.success('Password reset link sent to your email');
      
      // For demonstration purposes, we'll just reset it immediately
      setTimeout(() => {
        localStorage.removeItem('app-password');
        setShowDialog(true);
        setActiveTab('login');
        setResetRequested(false);
        toast.info('For demo purposes, your password has been reset. Please set a new one.');
      }, 3000);
    } else {
      toast.error('Email address not recognized');
    }
  };

  if (!isUnlocked) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {hasPassword ? 'Enter Password' : 'Set Password'}
            </DialogTitle>
            <DialogDescription>
              {hasPassword 
                ? 'Please enter your password to access the application' 
                : 'Create a password to protect your account'}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'reset')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{hasPassword ? 'Login' : 'Set Password'}</TabsTrigger>
              <TabsTrigger value="reset" disabled={!hasPassword}>Reset Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 py-4">
              {!hasPassword ? (
                // Set new password form
                <>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">New Password</label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <Button onClick={handleSetPassword} className="w-full mt-4">
                    Set Password
                  </Button>
                </>
              ) : (
                // Login form
                <>
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">Password</label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>

                  <Button onClick={handleLogin} className="w-full mt-4">
                    Login
                  </Button>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="reset" className="space-y-4 py-4">
              {!resetRequested ? (
                <>
                  <p className="text-sm text-gray-500">
                    Enter the email address associated with your account, and we'll send a link to reset your password.
                  </p>
                  <div className="space-y-2">
                    <label htmlFor="resetEmail" className="text-sm font-medium">Email</label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <Button onClick={handleRequestReset} className="w-full mt-4">
                    Request Password Reset
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Check your email</h3>
                  <p className="text-gray-500 mt-2">
                    We've sent a password reset link to your email address
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
};

export default PasswordProtection;

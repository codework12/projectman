import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AdminAccessToggle from '../components/admin-elab/AdminAccessToggle';

const AccountSettings = () => {
  const [name, setName] = React.useState('John Doe');
  const [email, setEmail] = React.useState(() => {
    return localStorage.getItem('app-email') || 'john.doe@example.com';
  });

  const saveProfile = () => {
    // In a real app, this would call an API
    localStorage.setItem('app-email', email);
    toast.success('Profile updated successfully');
  };

  const changePassword = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, this would call an API
    toast.success('Password changed successfully');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      // Keep password and admin status, but clear all other data
      const password = localStorage.getItem('app-password');
      const email = localStorage.getItem('app-email');
      const isAdmin = localStorage.getItem('isAdmin');
      
      localStorage.clear();
      
      // Restore auth data
      if (password) localStorage.setItem('app-password', password);
      if (email) localStorage.setItem('app-email', email);
      if (isAdmin) localStorage.setItem('isAdmin', isAdmin);
      
      toast.success('All data cleared successfully');
    }
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Account deleted successfully');
      
      // In a real app, this would redirect to a logout page
      window.location.href = '/';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={changePassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="submit">Change Password</Button>
                </div>
              </form>
              
              <div className="pt-4 border-t mt-6">
                <AdminAccessToggle />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Manage your account data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Clear All Data</h3>
                <p className="text-sm text-gray-500">
                  This will clear all your test data and preferences, but will keep your account.
                </p>
                <Button variant="outline" className="mt-2" onClick={clearAllData}>
                  Clear All Data
                </Button>
              </div>
              
              <div className="space-y-2 pt-4 border-t mt-6">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <p className="text-sm text-gray-500">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" className="mt-2" onClick={deleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;

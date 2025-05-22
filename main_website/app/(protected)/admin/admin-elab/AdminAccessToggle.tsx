
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

const AdminAccessToggle = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);
  
  const toggleAdminAccess = () => {
    const newStatus = !isAdmin;
    localStorage.setItem('isAdmin', String(newStatus));
    setIsAdmin(newStatus);
    
    if (newStatus) {
      toast.success('Admin access enabled');
    } else {
      toast.info('Admin access disabled');
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-gray-500" />
          <span>Admin Access</span>
        </div>
        <Button 
          variant={isAdmin ? "destructive" : "outline"} 
          size="sm" 
          onClick={toggleAdminAccess}
        >
          {isAdmin ? 'Disable Admin' : 'Enable Admin'}
        </Button>
      </div>
      
      {isAdmin && (
        <Button 
          variant="default" 
          className="w-full" 
          onClick={() => window.location.href = '/admin'}
        >
          Go to Admin Panel
        </Button>
      )}
    </div>
  );
};

export default AdminAccessToggle;

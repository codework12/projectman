
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin and log access attempt
    const adminStatus = localStorage.getItem('isAdmin');
    const adminEmail = localStorage.getItem('adminEmail');
    
    if (adminStatus === 'true') {
      setIsAdmin(true);
      console.log(`Admin access granted for ${adminEmail || 'unknown user'}`);
    } else {
      setIsAdmin(false);
      console.log(`Admin access denied at ${new Date().toISOString()}`);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    toast.error("You don't have permission to access the admin panel", {
      description: "Please contact an administrator if you believe this is an error.",
      duration: 5000
    });
    
    // Use React Router navigate instead of Next.js router
    navigate('/');
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;

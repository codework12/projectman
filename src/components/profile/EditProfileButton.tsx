
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ProfileEditForm from './ProfileEditForm';
import { Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EditProfileButtonProps extends ButtonProps {
  profileData: any;
  onProfileUpdate: (data: any) => void;
  dialogTitle?: string;
  dialogDescription?: string;
  className?: string;
  children?: React.ReactNode;
  allowBannerEdit?: boolean;
  hideFields?: string[];
}

const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  profileData,
  onProfileUpdate,
  dialogTitle = "Edit Profile",
  dialogDescription,
  className,
  children,
  allowBannerEdit = false,
  hideFields = [],
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const handleProfileUpdate = (data: any) => {
    onProfileUpdate(data);
    setIsOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <>
      <Button
        variant={props.variant || "outline"}
        className={cn("flex items-center gap-2", className)}
        onClick={() => setIsOpen(true)}
        {...props}
      >
        {children || (
          <>
            <Edit className="h-4 w-4" />
            Edit Profile
          </>
        )}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
          </DialogHeader>
          <ProfileEditForm
            initialData={profileData}
            onSubmit={handleProfileUpdate}
            onCancel={() => setIsOpen(false)}
            allowBannerEdit={allowBannerEdit}
            hideFields={hideFields}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileButton;

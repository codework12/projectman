
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface InsuranceFormProps {
  initialData: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    primary: boolean;
    subscriberName: string;
    subscriberDob: string;
    relationship: string;
  };
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({ initialData, onSubmit, isProcessing }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData,
  });
  const { toast } = useToast();
  
  const isPrimary = watch("primary");
  
  const submitHandler = (data) => {
    // Simulating validation of insurance information
    if (data.policyNumber.length < 5) {
      toast({
        variant: "destructive",
        title: "Invalid policy number",
        description: "Please enter a valid policy number.",
      });
      return;
    }
    
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
        <h4 className="font-medium text-yellow-800">Insurance Information</h4>
        <p className="text-sm text-yellow-700 mt-1">
          Your order will be placed immediately, but payment processing will be pending until your insurance is verified.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="provider">Insurance Provider</Label>
          <Input
            id="provider"
            {...register("provider", { required: "Insurance provider is required" })}
            className={errors.provider ? "border-red-500" : ""}
            disabled={isProcessing}
          />
          {errors.provider && (
            <p className="text-red-500 text-sm mt-1">{errors.provider.message as string}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="policyNumber">Policy Number</Label>
          <Input
            id="policyNumber"
            {...register("policyNumber", { required: "Policy number is required" })}
            className={errors.policyNumber ? "border-red-500" : ""}
            disabled={isProcessing}
          />
          {errors.policyNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.policyNumber.message as string}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="groupNumber">Group Number</Label>
          <Input
            id="groupNumber"
            {...register("groupNumber")}
            disabled={isProcessing}
          />
        </div>
        
        <div>
          <div className="flex items-center space-x-2 pt-5">
            <Checkbox 
              id="primary" 
              checked={isPrimary} 
              onCheckedChange={(checked) => {
                setValue("primary", !!checked);
              }}
              disabled={isProcessing}
            />
            <Label htmlFor="primary" className="cursor-pointer">I am the primary insurance holder</Label>
          </div>
        </div>
        
        {!isPrimary && (
          <>
            <div>
              <Label htmlFor="subscriberName">Subscriber Name</Label>
              <Input
                id="subscriberName"
                {...register("subscriberName", { required: !isPrimary && "Subscriber name is required" })}
                className={errors.subscriberName ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {errors.subscriberName && (
                <p className="text-red-500 text-sm mt-1">{errors.subscriberName.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="subscriberDob">Subscriber Date of Birth</Label>
              <Input
                id="subscriberDob"
                type="date"
                {...register("subscriberDob", { required: !isPrimary && "Subscriber date of birth is required" })}
                className={errors.subscriberDob ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {errors.subscriberDob && (
                <p className="text-red-500 text-sm mt-1">{errors.subscriberDob.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="relationship">Relationship to Subscriber</Label>
              <Select
                disabled={isProcessing}
                onValueChange={(value) => setValue("relationship", value)}
                defaultValue={initialData.relationship}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center p-4 border-t mt-4 pt-4">
        <input 
          type="file" 
          id="insurance-card" 
          className="hidden" 
          accept="image/*,.pdf" 
        />
        <label 
          htmlFor="insurance-card"
          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center"
        >
          Upload Insurance Card (Optional)
        </label>
        <p className="text-sm text-gray-500 ml-4">
          You can also submit your insurance information during your appointment.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-elab-medical-blue hover:bg-blue-700"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Place Order with Insurance
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default InsuranceForm;

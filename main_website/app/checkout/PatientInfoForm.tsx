import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight } from 'lucide-react';

interface PatientInfoFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onSubmit: (data: any) => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ initialData, onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: initialData,
    mode: 'onChange'
  });
  
  const submitHandler = (data) => {
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-medium mb-4">Patient Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName", { required: "Last name is required" })}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email"
                }
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone", { required: "Phone number is required" })}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              {...register("dob", { required: "Date of birth is required" })}
              className={errors.dob ? "border-red-500" : ""}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob.message as string}</p>
            )}
          </div>
          
          <div>
            <Label>Gender</Label>
            <RadioGroup 
              defaultValue={initialData.gender} 
              {...register("gender", { required: "Gender is required" })}
            >
              <div className="flex items-center space-x-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">Other</Label>
                </div>
              </div>
            </RadioGroup>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender.message as string}</p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city", { required: "City is required" })}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register("state", { required: "State is required" })}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              {...register("zipCode", { required: "ZIP code is required" })}
              className={errors.zipCode ? "border-red-500" : ""}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode.message as string}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center justify-center gap-2 transition-all duration-150"
        >
          Continue to Payment
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </form>
  );
};

export default PatientInfoForm;

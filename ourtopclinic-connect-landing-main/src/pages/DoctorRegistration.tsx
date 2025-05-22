
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { HeartPulse, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const specializations = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Obstetrics",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Urology"
];

const doctorFormSchema = z.object({
  employmentType: z.string().min(1, { message: "Please select an employment type" }),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  specialization: z.string().min(1, { message: "Please select a specialization" }),
  department: z.string().min(1, { message: "Department is required" }),
  licenseNumber: z.string().min(5, { message: "Valid license number is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contactNumber: z.string().min(10, { message: "Valid contact number is required" }),
  address: z.string().min(5, { message: "Valid address is required" }),
  npiNumber: z.string().min(5, { message: "Valid NPI number is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
  yearsInPractice: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Years in practice must be a number",
  }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  workingDays: z.object({
    sunday: z.boolean().optional(),
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
  }),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

const DoctorRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      employmentType: "Full-Time",
      fullName: "",
      specialization: "",
      department: "",
      licenseNumber: "",
      email: "",
      contactNumber: "",
      address: "",
      npiNumber: "",
      city: "",
      state: "",
      zipCode: "",
      yearsInPractice: "",
      password: "",
      workingDays: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      },
    },
  });

  const onSubmit = async (data: DoctorFormValues) => {
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call to your backend
      console.log('Doctor registration data:', data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Registration submitted",
        description: "Your application is under review. You will be notified once approved.",
      });
      
      // Redirect to the pending approval page
      navigate('/app/doctor/pending-approval');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was a problem submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mr-3">
            <HeartPulse className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">OurTopClinic</h1>
        </div>
        
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Doctor Registration</CardTitle>
            <CardDescription>
              Complete your profile to join our healthcare provider network
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {/* Employment Type */}
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-Time">Full-Time</SelectItem>
                            <SelectItem value="Part-Time">Part-Time</SelectItem>
                            <SelectItem value="Consultant">Consultant</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doctor's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Specialization and Department */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specializations.map((specialization) => (
                                <SelectItem key={specialization} value={specialization}>
                                  {specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="OPD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* License Number */}
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="License Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email and Contact Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="9123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="1479 Street, Apt 1839-A NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* NPI Number */}
                  <FormField
                    control={form.control}
                    name="npiNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NPI Number</FormLabel>
                        <FormControl>
                          <Input placeholder="NPI Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Years in Practice */}
                  <FormField
                    control={form.control}
                    name="yearsInPractice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years in Practice</FormLabel>
                        <FormControl>
                          <Input placeholder="Years in Practice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a secure password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Working Days */}
                  <div>
                    <FormLabel>Working Days</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {[
                        { day: "sunday", label: "Sunday" },
                        { day: "monday", label: "Monday" },
                        { day: "tuesday", label: "Tuesday" },
                        { day: "wednesday", label: "Wednesday" },
                        { day: "thursday", label: "Thursday" },
                        { day: "friday", label: "Friday" },
                        { day: "saturday", label: "Saturday" },
                      ].map(({ day, label }) => (
                        <FormField
                          key={day}
                          control={form.control}
                          name={`workingDays.${day}` as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {label}
                              </FormLabel>
                              <div className="ml-auto text-xs text-muted-foreground">
                                {field.value ? "Working" : "Not working on this day"}
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="font-medium">Important Notice</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your registration will be reviewed by our administrators. 
                      You will receive access to the full platform once your credentials are verified.
                    </p>
                  </div>
                </div>
                
                <CardFooter className="flex justify-between px-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/onboarding')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="gradient-bg"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DoctorRegistration;

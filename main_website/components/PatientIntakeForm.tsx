import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Upload, X, Check, AlertCircle, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createNewAppointment } from '@/app/actions/appointment';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
};

type MotionDivProps = HTMLMotionProps<"div"> & {
  className?: string;
};

const MotionDiv = motion.div as React.ComponentType<MotionDivProps>;

type PatientIntakeFormProps = {
  onComplete: () => void;
  doctorName?: string;
  serviceName?: string;
  doctorsList: Array<{ id: string; name: string }>;
  selectedServiceId?: number;
  doctorId?: string;
  type?: string;
  mode?: string;
};

const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({ onComplete, doctorName = "Dr. John Doe", serviceName = "General Consultation", doctorsList = [], selectedServiceId, doctorId, type, mode }) => {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM',
  ];
  
  const form = useForm({
    defaultValues: {
      chiefComplaint: '',
      allergies: '',
      currentMedications: '',
      pastMedicalConditions: '',
      bloodPressure: '',
      temperature: '',
      pharmacyName: '',
      pharmacyAddress: '',
      pharmacyPhone: '',
      hasInsurance: 'no',
      insuranceId: '',
    },
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!doctorId) {
      toast.error("Doctor information is missing. Please try booking again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formValues = form.getValues();
      const formData = {
        ...formValues,
        patient_id: user?.id,
        appointment_date: appointmentDate ? appointmentDate.toISOString().split('T')[0] : '',
        time: appointmentTime,
        service_id: selectedServiceId,
        doctor_id: doctorId,
        type: type || 'regular',
        mode: mode || 'inperson'
      };

      console.log('Booking data received:', formData);

      const res = await createNewAppointment(formData);
      if (res.success) {
        toast.success("Booking done!");
        router.push("/record/appoiment");
      } else {
        toast.error("Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MotionDiv 
      initial="hidden"
      animate="show"
      variants={container}
      className="py-8 px-2 md:px-8 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] min-h-[80vh]"
    >
      <MotionDiv variants={item} className="mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] mb-2 tracking-tight">Patient Intake Form</h2>
        <p className="text-[#64748b] text-lg">Please provide your medical information to help us serve you better</p>
      </MotionDiv>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Your Name</span>
            <span className="font-bold text-lg text-[#10b981]">{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Doctor</span>
            <span className="font-bold text-lg text-[#1e293b]">{doctorName}</span>
          </div>
        </div>
        <div className="bg-[#e0f2fe] rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Service</span>
          <span className="font-bold text-lg text-[#1e293b]">{serviceName}</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <MotionDiv variants={item} className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-sm text-blue-700">
                  This information is kept secure and will be used by your healthcare provider to prepare for your visit.
                </p>
              </MotionDiv>
              
              <MotionDiv variants={item} className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Reason for Visit</h3>
                <FormField
                  control={form.control}
                  name="chiefComplaint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Chief Complaint</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe your current symptoms and reason for visit" 
                          className="resize-none h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MotionDiv>
              
              <MotionDiv variants={item} className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Allergies</h3>
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Please list any drug, food, or environmental allergies and reactions
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Example: Penicillin (hives), Peanuts (anaphylaxis), etc." 
                          className="resize-none h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MotionDiv>
              
              <MotionDiv variants={item} className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Medical History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currentMedications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Current Medications</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List all current medications and dosages" 
                            className="resize-none h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pastMedicalConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Past Medical Conditions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List significant past medical conditions" 
                            className="resize-none h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Last Blood Pressure Reading and Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Example: 120/80 on 05/15/2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Last Temperature Reading and Date</FormLabel>
                        <FormControl>
                          <Input placeholder="Example: 98.6°F on 05/15/2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </MotionDiv>
              
              <MotionDiv variants={item} className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Preferred Pharmacy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="pharmacyName"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel className="text-gray-700">Pharmacy Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Example: CVS Pharmacy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pharmacyAddress"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-1">
                        <FormLabel className="text-gray-700">Pharmacy Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pharmacy address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pharmacyPhone"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel className="text-gray-700">Pharmacy Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Example: (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </MotionDiv>
              
              <MotionDiv variants={item} className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <FormLabel className="text-gray-700">Select Appointment Date</FormLabel>
                    <input
                      type="date"
                      className="w-full mt-2 border rounded-md p-3 text-base"
                      value={appointmentDate ? appointmentDate.toISOString().split('T')[0] : ''}
                      onChange={e => setAppointmentDate(e.target.value ? new Date(e.target.value) : null)}
                      min={new Date().toISOString().split('T')[0]}
                      />
                  </div>
                  <div>
                    <FormLabel className="text-gray-700">Select Appointment Time</FormLabel>
                    <select
                      className="w-full mt-2 border rounded-md p-3 text-base"
                      value={appointmentTime}
                      onChange={e => setAppointmentTime(e.target.value)}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
                    </div>
                </div>
              </MotionDiv>
              
              <MotionDiv 
                variants={item}
                className="mt-8 flex justify-end gap-4"
              >
                <Button 
                  type="button"
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50 font-bold min-w-[140px] py-4 px-8 rounded-xl shadow text-lg transition-all duration-200"
                  onClick={() => {
                    // Trigger navigation back to Select Service step
                    const event = new CustomEvent('bookingStepChange', { detail: { step: 'services' } });
                    document.dispatchEvent(event);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#10b981] hover:bg-[#0e9e6e] text-white font-bold min-w-[180px] py-4 px-8 rounded-xl shadow-lg text-lg transition-all duration-200"
                >
                  Continue to Payment
                </Button>
              </MotionDiv>
            </CardContent>
          </Card>
        </form>
      </Form>
    </MotionDiv>
  );
};

export default PatientIntakeForm;

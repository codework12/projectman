"use client";

import { useUser } from "@clerk/nextjs";
// import { Patient } from "@prisma/client";
import { Phone } from "lucide-react"; 
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Form } from "./ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormSchema } from "@/lib/schema";
import { z } from "zod";
import { CustomInput } from "./custom-input";
import { GENDER, RELATION } from "@/lib";
import { Button } from "./ui/button";
import { createNewPatient, updatePatient } from "@/app/actions/patient";
import { toast } from "sonner";

interface DataProps {
  data?: any;
  type: "create" | "update";
}
export const NewPatient = ({ data, type }: DataProps) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [imgURL, setImgURL] = useState<any>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = type === "create" ? "new-patient" : (data?.id || user?.id);

  console.log("NewPatient component rendered with:", {
    patientId,
    type,
    hasData: !!data,
    userId: user?.id
  });

  const userData = {
    first_name: user?.firstName || "",
    last_name: user?.lastName || "",
    email: user?.emailAddresses[0].emailAddress || "",
    phone: user?.phoneNumbers?.toString() || "",
  };

  const userId = user?.id;
  const form = useForm({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      ...userData,
      address: "",
      date_of_birth: new Date(),
      gender: "PREFER_NOT_TO_SAY",
      city: "",
      state: "",
      zip_code: "",
      height: 0,
      weight: 0,
      preferred_contact_method: "",
      preferred_appointment_type: "",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "other",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      insurance_number: "",
      insurance_provider: "",
      medical_history: "",
      medical_consent: false,
      privacy_consent: false,
      service_consent: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof PatientFormSchema>) => {
    console.log("=== Form Submission Debug ===");
    console.log("Raw form data:", JSON.stringify(data, null, 2));
    console.log("Medical fields in submission:", {
      conditions: data.medical_conditions,
      history: data.medical_history,
      type: typeof data.medical_conditions
    });

    try {
      setLoading(true);

      let response;
      if (type === "create") {
        response = await createNewPatient(data, userId!);
      } else if (type === "update" && patientId) {
        response = await updatePatient(data, patientId);
      }

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success(type === "create" ? "Patient created successfully!" : "Patient updated successfully!");
      
      // Wait a moment for the role to be set in Clerk
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Force a hard refresh to ensure the new role is picked up
      window.location.href = "/patient";
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type === "create") {
      userData && form.reset({ 
        ...userData,
        gender: "PREFER_NOT_TO_SAY",
        preferred_contact_method: "",
        preferred_appointment_type: "",
        relation: "other"
      });
    } else if (type === "update" && data) {
      console.log("=== Form Update Debug ===");
      console.log("Received data:", JSON.stringify(data, null, 2));
      console.log("Data type:", typeof data);
      console.log("Data keys:", Object.keys(data));
      console.log("Form fields:", {
        gender: data.gender,
        preferred_contact_method: data.preferred_contact_method,
        preferred_appointment_type: data.preferred_appointment_type,
        type: typeof data.gender
      });
      
      // Parse the date string into a Date object
      let dateOfBirth;
      try {
        dateOfBirth = data.date_of_birth ? new Date(data.date_of_birth) : new Date();
        if (isNaN(dateOfBirth.getTime())) {
          console.warn("Invalid date_of_birth, using current date");
          dateOfBirth = new Date();
        }
      } catch (error) {
        console.warn("Error parsing date_of_birth, using current date");
        dateOfBirth = new Date();
      }

      const formData = {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        date_of_birth: dateOfBirth,
        gender: data.gender || "PREFER_NOT_TO_SAY",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zip_code: data.zip_code || "",
        height: Number(data.height) || 0,
        weight: Number(data.weight) || 0,
        preferred_contact_method: data.preferred_contact_method || "Email",
        preferred_appointment_type: data.preferred_appointment_type || "In-person",
        emergency_contact_name: data.emergency_contact_name || "",
        emergency_contact_number: data.emergency_contact_number || "",
        relation: data.relation || "other",
        blood_group: data.blood_group || "",
        allergies: data.allergies || "",
        medical_conditions: data.medical_conditions || "",
        medical_history: data.medical_history || "",
        insurance_number: data.insurance_number || "",
        insurance_provider: data.insurance_provider || "",
        medical_consent: Boolean(data.medical_consent),
        privacy_consent: Boolean(data.privacy_consent),
        service_consent: Boolean(data.service_consent),
        img: data.img || "",
      };
      
      console.log("Form data being set:", JSON.stringify(formData, null, 2));
      console.log("Form fields in form data:", {
        gender: formData.gender,
        preferred_contact_method: formData.preferred_contact_method,
        preferred_appointment_type: formData.preferred_appointment_type
      });
      form.reset(formData);
    }
  }, [data, type, user, form]);

  // Add this debug effect to monitor form values
  useEffect(() => {
    const subscription = form.watch((value: any) => {
      console.log("Form values changed:", value);
      console.log("Form fields in form:", {
        gender: value.gender,
        preferred_contact_method: value.preferred_contact_method,
        preferred_appointment_type: value.preferred_appointment_type
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card className="max-w-5xl w-full mx-auto p-0 shadow-2xl rounded-3xl border border-emerald-100 bg-white/95">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-3xl border-b border-emerald-100 p-10">
        <CardTitle className="text-3xl font-bold tracking-tight text-emerald-800">
          {type === "create" ? "Patient Registration" : "Update Patient Information"}
        </CardTitle>
        <CardDescription className="text-lg text-gray-500 mt-2">
          {type === "create" 
            ? "Please provide all the information below to help us understand you better and provide quality service."
            : "Update your information to keep your profile current and accurate."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-10">
        <Form {...form}>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (loading) return;
              console.log("Form submitted");
              await form.handleSubmit(onSubmit)(e);
            }} 
            className="space-y-14"
          >
            {/* Personal Information */}
            <div>
              <h3 className="uppercase text-sm font-bold tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                <span>Personal Information</span>
                <span className="flex-1 h-px bg-emerald-100"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-2">
                <div className="md:col-span-6">
                  <CustomInput type="input" control={form.control} name="first_name" placeholder="John" label="First Name" />
                </div>
                <div className="md:col-span-6">
                  <CustomInput type="input" control={form.control} name="last_name" placeholder="Doe" label="Last Name" />
                </div>
                <div className="md:col-span-6">
                  <CustomInput type="input" control={form.control} name="email" placeholder="john@example.com" label="Email Address" />
                </div>
                <div className="md:col-span-6">
                  <CustomInput type="datepicker" control={form.control} name="date_of_birth" placeholder="01-05-2000" label="Date of Birth" />
                </div>
                <div className="md:col-span-6">
                  <div className="w-full min-w-[220px]">
                    <CustomInput type="select" control={form.control} name="gender" placeholder="Select gender" label="Gender" selectList={GENDER!} />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <CustomInput type="input" control={form.control} name="height" placeholder="170" label="Height (cm)" />
                </div>
                <div className="md:col-span-3">
                  <CustomInput type="input" control={form.control} name="weight" placeholder="65" label="Weight (kg)" />
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div>
              <h3 className="uppercase text-sm font-bold tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                <span>Contact & Address</span>
                <span className="flex-1 h-px bg-emerald-100"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-3">
                <div className="md:col-span-4">
                  <CustomInput type="input" control={form.control} name="phone" placeholder="9225600735" label="Contact Number" />
                </div>
                <div className="md:col-span-8">
                  <CustomInput type="input" control={form.control} name="address" placeholder="1479 Street, Apt 1839-G, NY" label="Address" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
                <div className="md:col-span-4">
                  <CustomInput type="input" control={form.control} name="city" placeholder="New York" label="City" />
                </div>
                <div className="md:col-span-4">
                  <CustomInput type="input" control={form.control} name="state" placeholder="NY" label="State" />
                </div>
                <div className="md:col-span-4">
                  <CustomInput type="input" control={form.control} name="zip_code" placeholder="10001" label="Zip Code" />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="uppercase text-sm font-bold tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                <span>Preferences</span>
                <span className="flex-1 h-px bg-emerald-100"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CustomInput type="select" control={form.control} name="preferred_contact_method" placeholder="Select preferred contact method" label="Preferred Contact Method" selectList={[{ label: "Email", value: "Email" }, { label: "Phone", value: "Phone" }, { label: "Text", value: "Text" }]} />
                <CustomInput type="select" control={form.control} name="preferred_appointment_type" placeholder="Select preferred appointment type" label="Preferred Appointment Type" selectList={[{ label: "In-person", value: "In-person" }, { label: "Visual", value: "Visual" }, { label: "Both", value: "Both" }]} />
              </div>
            </div>

            {/* Family Information */}
            <div>
              <h3 className="uppercase text-sm font-bold tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                <span>Family Information</span>
                <span className="flex-1 h-px bg-emerald-100"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CustomInput type="input" control={form.control} name="emergency_contact_name" placeholder="Anne Smith" label="Emergency contact name" />
                <CustomInput type="input" control={form.control} name="emergency_contact_number" placeholder="675444467" label="Emergency contact" />
                <CustomInput type="select" control={form.control} name="relation" placeholder="Select relation with contact person" label="Relation" selectList={RELATION} />
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="uppercase text-sm font-bold tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                <span>Medical Information</span>
                <span className="flex-1 h-px bg-emerald-100"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CustomInput type="input" control={form.control} name="blood_group" placeholder="A+" label="Blood group" />
                <CustomInput type="input" control={form.control} name="allergies" placeholder="Milk" label="Allergies" />
                <CustomInput type="input" control={form.control} name="medical_conditions" placeholder="Medical conditions" label="Medical conditions" />
                <CustomInput type="input" control={form.control} name="medical_history" placeholder="Medical history" label="Medical history" />
                <CustomInput type="input" control={form.control} name="insurance_provider" placeholder="Insurance provider" label="Insurance provider" />
                <CustomInput type="input" control={form.control} name="insurance_number" placeholder="Insurance number" label="Insurance number" />
              </div>
            </div>

            {/* Consent - FIXED LAYOUT */}
            {type !== "update" && (
            <div>
            <h3 className="uppercase text-sm font-bold tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
              <span>Consent</span>
              <span className="flex-1 h-px bg-emerald-100"></span>
            </h3>
                <div className="space-y-6">
                  <CustomInput
                    name="privacy_consent"
                    label="Privacy Policy Agreement"
                    placeholder=" I consent to the collection, storage, and use of my
                    personal and health information as outlined in the Privacy
                    Policy. I understand how my data will be used, who it may
                    be shared with, and my rights regarding access,
                    correction, and deletion of my data."
                    type="checkbox"
                    control={form.control}
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="service_consent"
                    label=" Terms of Service Agreement"
                    placeholder=" I agree to the Terms of Service, including my
                    responsibilities as a user of this healthcare management
                    system, the limitations of liability, and the dispute
                    resolution process. I understand that continued use of
                    this service is contingent upon my adherence to these
                    terms."
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="medical_consent"
                    label="Informed Consent for Medical Treatment"
                    placeholder="I provide informed consent to receive medical treatment
                    and services through this healthcare management system. I
                    acknowledge that I have been informed of the nature,
                    risks, benefits, and alternatives to the proposed
                    treatments and that I have the right to ask questions and
                    receive further information before proceeding."
                  />
                </div>
              </div>
            )}
            <Button
              disabled={loading}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (loading) return;
                console.log("Button clicked");
                form.handleSubmit(onSubmit)(e);
              }}
              className="w-full py-4 text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-2xl shadow-xl hover:from-emerald-600 hover:to-teal-500 transition-all"
            >
              {loading ? "Updating..." : type === "create" ? "Submit" : "Update Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
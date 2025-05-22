"use server";

import db from "@/lib/db";
import { PatientFormSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

export async function updatePatient(data: any, pid: string) {
  console.log("=== Update Patient Function Started ===");
  console.log("Patient ID:", pid);
  console.log("Received data:", JSON.stringify(data, null, 2));

  if (!pid) {
    console.error("No patient ID provided");
    return {
      success: false,
      error: true,
      msg: "Patient ID is required",
    };
  }

  try {
    // Add validation logging
    console.log("Starting data validation...");
    const validateData = PatientFormSchema.safeParse(data);
    console.log("Validation result:", validateData);

    if (!validateData.success) {
      console.error("Validation error:", validateData.error);
      return {
        success: false,
        error: true,
        msg: "Please provide all required fields correctly",
      };
    }

    const patientData = validateData.data;
    console.log("Validated patient data:", JSON.stringify(patientData, null, 2));
    console.log("Medical fields in submission:", {
      conditions: patientData.medical_conditions,
      history: patientData.medical_history
    });

    // Update database first
    try {
      console.log("Attempting to update database with ID:", pid);
      
      // First check if patient exists
      const existingPatient = await db.patient.findUnique({
        where: { id: pid }
      });

      if (!existingPatient) {
        console.error("Patient not found in database");
        return {
          success: false,
          error: true,
          msg: "Patient not found in database",
        };
      }

      console.log("Found existing patient:", existingPatient);

      const updatedPatient = await db.patient.update({
        where: { 
          id: pid 
        },
        data: {
          first_name: patientData.first_name,
          last_name: patientData.last_name,
          date_of_birth: patientData.date_of_birth,
          gender: patientData.gender,
          phone: patientData.phone,
          email: patientData.email,
          height: patientData.height,
          weight: patientData.weight,
          address: patientData.address,
          emergency_contact_name: patientData.emergency_contact_name,
          emergency_contact_number: patientData.emergency_contact_number,
          relation: patientData.relation,
          blood_group: patientData.blood_group,
          allergies: patientData.allergies,
          medical_conditions: patientData.medical_conditions,
          medical_history: patientData.medical_history,
          insurance_provider: patientData.insurance_provider,
          insurance_number: patientData.insurance_number,
          city: patientData.city,
          state: patientData.state,
          zip_code: patientData.zip_code,
          preferred_contact_method: patientData.preferred_contact_method,
          preferred_appointment_type: patientData.preferred_appointment_type,
        },
      });

      console.log("Database update successful:", JSON.stringify(updatedPatient, null, 2));

      if (!updatedPatient) {
        throw new Error("Failed to update patient record - no record was updated");
      }

      // Update Clerk user data after successful database update
      try {
        console.log("Attempting to update Clerk user...");
        const client = await clerkClient();
        
        // First get the current user to ensure it exists
        const currentUser = await client.users.getUser(pid);
        console.log("Current user found:", currentUser);

        if (!currentUser) {
          throw new Error("User not found in Clerk");
        }

        // Update the user with new data
        const updatedUser = await client.users.updateUser(pid, {
          firstName: patientData.first_name,
          lastName: patientData.last_name,
          publicMetadata: {
            email: patientData.email,
            phone: patientData.phone,
            role: "patient",
            status: "active"
          }
        });

        console.log("Clerk user updated successfully:", updatedUser);
      } catch (clerkError: any) {
        console.error("Error updating Clerk user:", clerkError);
        // Don't throw here, just log the error since the database update was successful
        console.warn("Clerk user update failed but database was updated:", clerkError.message);
      }

      return {
        success: true,
        error: false,
        msg: "Patient information updated successfully",
      };
    } catch (dbError: any) {
      console.error("Database update error:", dbError);
      console.error("Error details:", {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      });
      return {
        success: false,
        error: true,
        msg: `Failed to update patient record in database: ${dbError.message}`,
      };
    }
  } catch (error: any) {
    console.error("Error in updatePatient:", error);
    return { 
      success: false, 
      error: true, 
      msg: error?.message || "An error occurred while updating patient information" 
    };
  }
}

export async function createNewPatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        msg: "Provide all required fields",
      };
    }

    const patientData = validateData.data;
    let patient_id = pid;

    const client = await clerkClient();
    if (pid === "new-patient") {
      const user = await client.users.createUser({
        emailAddress: [patientData.email],
        password: patientData.phone,
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        publicMetadata: { 
          role: "patient",
          status: "active"
        },
      });

      patient_id = user?.id;
    } else {
      // For existing users, ensure role is set to patient
      await client.users.updateUser(pid, {
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        publicMetadata: { 
          role: "patient",
          status: "active"
        },
      });
    }

    await db.patient.create({
      data: {
        ...patientData,
        id: patient_id,
      },
    });

    return { 
      success: true, 
      error: false, 
      msg: "Patient created successfully",
      userId: patient_id 
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, msg: error?.message };
  }
}
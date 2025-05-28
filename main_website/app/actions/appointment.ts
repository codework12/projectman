"use server";

import { VitalSignsFormData } from "@/components/dialogs/add-vital-signs";
import db from "@/lib/db";
import { AppointmentSchema, VitalSignsSchema } from "@/lib/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AppointmentStatus } from "@prisma/client";

export async function createNewAppointment(data: any) {
  try {
    console.log("Booking data received:", data);
    const validatedData = AppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      console.log("Validation failed:", validatedData.error);
      return { success: false, msg: "Invalid data" };
    }
    const validated = validatedData.data;

    // Create the appointment first
    console.log("Creating appointment with:", {
      patient_id: data.patient_id,
      doctor_id: validated.doctor_id,
      time: validated.time,
      type: validated.type,
      appointment_date: new Date(validated.appointment_date),
      note: validated.note,
      mode: validated.mode,
    });
    const appointment = await db.appointment.create({
      data: {
        patient_id: data.patient_id,
        doctor_id: validated.doctor_id,
        time: validated.time,
        type: validated.type,
        appointment_date: new Date(validated.appointment_date),
        note: validated.note,
        mode: validated.mode,
      },
    });
    console.log("Appointment created:", appointment);

    // Create the PatientIntake record, if intake fields are present
    if (data.chiefComplaint) {
      console.log("Creating PatientIntake with:", {
        appointment_id: appointment.id,
        patient_id: data.patient_id,
        doctor_id: validated.doctor_id,
        service_id: data.service_id,
        chiefComplaint: data.chiefComplaint,
        allergies: data.allergies,
        currentMedications: data.currentMedications,
        pastMedicalConditions: data.pastMedicalConditions,
        bloodPressure: data.bloodPressure,
        temperature: data.temperature,
        pharmacyName: data.pharmacyName,
        pharmacyAddress: data.pharmacyAddress,
        pharmacyPhone: data.pharmacyPhone,
      });
      await db.patientIntake.create({
        data: {
          appointment_id: appointment.id,
          patient_id: data.patient_id,
          doctor_id: validated.doctor_id,
          service_id: data.service_id,
          chiefComplaint: data.chiefComplaint,
          allergies: data.allergies,
          currentMedications: data.currentMedications,
          pastMedicalConditions: data.pastMedicalConditions,
          bloodPressure: data.bloodPressure,
          temperature: data.temperature,
          pharmacyName: data.pharmacyName,
          pharmacyAddress: data.pharmacyAddress,
          pharmacyPhone: data.pharmacyPhone,
        },
      });
      console.log("PatientIntake created successfully");
    }

    return {
      success: true,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    console.log("Error in createNewAppointment:", error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function appointmentAction(
  id: string | number,

  status: AppointmentStatus,
  reason: string
) {
  try {
    await db.appointment.update({
      where: { id: Number(id) },
      data: {
        status,
        reason,
      },
    });

    return {
      success: true,
      error: false,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addVitalSigns(
  data: VitalSignsFormData,
  appointmentId: string,
  doctorId: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, msg: "Unauthorized" };
    }

    const validatedData = VitalSignsSchema.parse(data);

    let medicalRecord = null;

    if (!validatedData.medical_id) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          appointment_id: Number(appointmentId),
          doctor_id: doctorId,
        },
      });
    }

    const med_id = validatedData.medical_id || medicalRecord?.id;

    await db.vitalSigns.create({
      data: {
        ...validatedData,
        medical_id: Number(med_id!),
      },
    });

    return {
      success: true,
      msg: "Vital signs added successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
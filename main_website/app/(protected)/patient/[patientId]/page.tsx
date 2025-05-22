import { getPatientFullDataById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import PatientProfileClient from "./patient-profile-client";

export default async function PatientProfile({
  params,
  searchParams,
}: {
  params: { patientId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = await auth();
  const patientId = params.patientId === "self" ? userId : params.patientId;

  if (!patientId) {
    return <div>Patient not found</div>;
  }

  const result = await getPatientFullDataById(patientId);
  if (!result.success) {
    return <div>Error loading patient: {"message" in result ? result.message : "Unknown error"}</div>;
  }
  const { data } = result as { success: true; data: any };

  return <PatientProfileClient data={data} patientId={params.patientId} id={patientId} />;
}

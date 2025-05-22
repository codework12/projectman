import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoDataFound } from "../no-data-found";
import { AddDiagnosis } from "../dialogs/add-diagnosis";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { checkRole } from "@/utils/roles";
import { record } from "zod";
import { MedicalHistoryCard } from "./medical-history-card";
import { Stethoscope } from "lucide-react";

export const DiagnosisContainer = async ({
  patientId,
  doctorId,
  id,
}: {
  patientId: string;
  doctorId: string;
  id: string;
}) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const data = await db.medicalRecords.findFirst({
    where: { appointment_id: Number(id) },
    include: {
      diagnosis: {
        include: { doctor: true },
        orderBy: { created_at: "desc" },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const diagnosis = data?.diagnosis || null;
  const isPatient = await checkRole("PATIENT");

  return (
    <div>
      {diagnosis?.length === 0 || !diagnosis ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <NoDataFound note="No diagnosis found" />
          <AddDiagnosis
            key={new Date().getTime()}
            patientId={patientId}
            doctorId={doctorId}
            appointmentId={id}
            medicalId={data?.id.toString() || ""}
          />
        </div>
      ) : (
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Diagnosis & Medical Records</h2>
          </div>
          {diagnosis?.map((record, id) => (
            <div key={record.id} className="bg-card rounded-2xl shadow border border-border p-4">
              <MedicalHistoryCard record={record} index={id} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
import { AppointmentDetails } from "@/components/appointment/appointment-details";
import AppointmentQuickLinks from "@/components/appointment/appointment-quick-links";
import { BillsContainer } from "@/components/appointment/bills-container";
import ChartContainer from "@/components/appointment/chart-container";
import { DiagnosisContainer } from "@/components/appointment/diagnosis-container";
import { PatientDetailsCard } from "@/components/appointment/patient-details-card";
import { PaymentsContainer } from "@/components/appointment/payment-container";
import { VitalSigns } from "@/components/appointment/vital-signs";
import { MedicalHistoryContainer } from "@/components/medical-history-container";
import { getAppointmentWithMedicalRecordsById } from "@/utils/services/appointment";
import { BarChart, ClipboardList, FileText, Stethoscope, Receipt, HeartPulse, History } from "lucide-react";
import Link from "next/link";

const TABS = [
  { key: "charts", label: "Charts", icon: <BarChart className="w-4 h-4 mr-1" /> },
  { key: "appointments", label: "Appointments", icon: <ClipboardList className="w-4 h-4 mr-1" /> },
  { key: "diagnosis", label: "Diagnosis", icon: <Stethoscope className="w-4 h-4 mr-1" /> },
  { key: "medical-history", label: "Medical History", icon: <History className="w-4 h-4 mr-1" /> },
  { key: "billing", label: "Billing", icon: <Receipt className="w-4 h-4 mr-1" /> },
  { key: "payments", label: "Payments", icon: <FileText className="w-4 h-4 mr-1" /> },
];

interface ParamsProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AppointmentDetailsPage = async (props: ParamsProps) => {
  const params = await props.params;
  const search = await props.searchParams;
  const { id } = params;
  const cat = (search?.cat as string) || "charts";

  const { data } = await getAppointmentWithMedicalRecordsById(Number(id));

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full min-h-screen bg-background p-4 md:p-8">
      {/* Main Content */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        {/* Segmented Control (Tabs) */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`?cat=${tab.key}`}
              className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-150 text-sm ${cat === tab.key ? "bg-primary text-primary-foreground shadow" : "bg-muted text-foreground hover:bg-accent/30"}`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </div>
        {/* Section Content */}
        <div className="bg-card rounded-2xl border border-border shadow p-6">
          {cat === "charts" && <ChartContainer id={data?.patient_id!} />}
          {cat === "appointments" && (
            <>
              <AppointmentDetails
                id={data?.id!}
                patient_id={data?.patient_id!}
                appointment_date={data?.appointment_date!}
                time={data?.time!}
                notes={data?.note!}
              />
              <VitalSigns
                id={id}
                patientId={data?.patient_id!}
                doctorId={data?.doctor_id!}
              />
            </>
          )}
          {cat === "diagnosis" && (
            <DiagnosisContainer
              id={id}
              patientId={data?.patient_id!}
              doctorId={data?.doctor_id!}
            />
          )}
          {cat === "medical-history" && (
            <MedicalHistoryContainer id={id!} patientId={data?.patient_id!} />
          )}
          {cat === "billing" && <BillsContainer id={id} />}
          {cat === "payments" && <PaymentsContainer patientId={data?.patient_id!} />}
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-card rounded-2xl border border-border shadow p-4">
          <AppointmentQuickLinks staffId={data?.doctor_id as string} />
        </div>
        <PatientDetailsCard data={data?.patient!} />
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
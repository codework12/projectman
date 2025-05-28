import { AvailableDoctors } from "@/components/available-doctor";
import { AppointmentChart } from "@/components/charts/appointment-chart";
import { StatSummary } from "@/components/charts/stats-summary";
import { StatCard } from "@/components/stat-card";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { Button } from "@/components/ui/button";
import { checkRole, getRole } from "@/utils/roles";
import { getDoctorDashboardStats } from "@/utils/services/doctor";
import { getDoctorRatings } from "@/utils/services/rating";
import { currentUser } from "@clerk/nextjs/server";
import { BriefcaseBusiness, BriefcaseMedical, Star, User, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { DashboardCardsClient } from "./dashboard-cards-client";
import { ProfileImage } from "@/components/profile-image";
import  RecentPatientsClient  from "./recent-patients-client";

const DoctorDashboard = async () => {
  const user = await currentUser();

  // Add status/role check
  const status = user?.publicMetadata?.status;
  const role = user?.publicMetadata?.role;
  if (role === 'doctor' && status !== 'approved') {
    redirect('/doctor-registration/pending');
  }

  const {
    totalPatient,
    totalAppointment,
    appointmentCounts,
    availableDoctors,
    monthlyData,
    last5Records,
  } = await getDoctorDashboardStats(user?.id!);

  // Get ratings for the current doctor
  const ratings = await getDoctorRatings(user?.id!);
  const averageRating = ratings.length > 0
    ? ratings.reduce((acc: any, curr: any) => acc + curr.rating, 0) / ratings.length
    : 0;

  const cardData = [
    {
      title: "Patients",
      value: totalPatient ?? 0,
      iconKey: "users",
      className: "bg-blue-600/15",
      iconClassName: "bg-blue-600/25 text-blue-600",
      note: "Total patients",
      link: "/record/patient",
    },
    {
      title: "Appointments",
      value: totalAppointment ?? 0,
      iconKey: "briefcaseBusiness",
      className: "bg-yellow-600/15",
      iconClassName: "bg-yellow-600/25 text-yellow-600",
      note: "Successful appointments",
      link: "/record/appointments",
    },
    {
      title: "Consultation",
      value: appointmentCounts?.COMPLETED ?? 0,
      iconKey: "briefcaseMedical",
      className: "bg-emerald-600/15",
      iconClassName: "bg-emerald-600/25 text-emerald-600",
      note: "Total consultation",
      link: "/record/appointments",
    },
    {
      title: "Rating",
      value: `${averageRating.toFixed(1)}`,
      iconKey: "star",
      className: "bg-amber-600/15",
      iconClassName: "bg-amber-600/25 text-amber-600",
      note: `${ratings.length} reviews`,
      link: `/record/doctors/${user?.id}/ratings-list`,
    },
  ];

  const greeting = new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] dark:from-[#0f172a] dark:to-[#134e4a] rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
      {/* LEFT */}
      <div className="w-full xl:w-[69%] flex flex-col h-full">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-6 mb-8 border border-[#10b981]/10 dark:border-[#10b981]/20">
          <div className="flex items-center justify-between mb-6">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] dark:text-white drop-shadow-sm font-sans tracking-tight">
                <span className="font-semibold text-[#10b981] dark:text-[#5eead4]">{greeting},</span> <span className="font-extrabold text-[#2563eb] dark:text-[#38bdf8]">Dr. {user?.firstName}</span>
              </h1>
              <p className="text-[#64748b] dark:text-gray-300 text-base mt-1">
                Here's your dashboard. Wishing you a productive day!
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563eb] dark:border-[#38bdf8] text-[#2563eb] dark:text-[#38bdf8] font-semibold text-sm bg-white dark:bg-[#134e4a] hover:bg-[#e0f2fe] dark:hover:bg-[#164e63] hover:text-[#2563eb] dark:hover:text-[#5eead4] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 dark:focus:ring-[#38bdf8]/30"
            >
              <Link href={`/record/doctors/${user?.id}`}>
                <User className="w-4 h-4 mr-1" />
                View Profile
              </Link>
            </Button>
          </div>

          <DashboardCardsClient cardData={cardData} />
        </div>

        <div className="h-[500px]">
          <AppointmentChart data={monthlyData!} />
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-6 mt-8 border border-[#10b981]/10 dark:border-[#10b981]/20">
          <RecentAppointments data={last5Records!} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-[31%] flex flex-col gap-4 h-full justify-between">
            <div className="animate-fadeInUp transition-all duration-300 hover:scale-[1.02]">
              <StatSummary data={appointmentCounts} total={totalAppointment!} />
            </div>

        {/* Recent Patients Card */}
        <RecentPatientsClient
          patients={
            (last5Records ?? [])
              .filter((a: any, i: number, arr: any[]) =>
                arr.findIndex((x: any) => x.patient?.id === a.patient?.id) === i && a.patient)
              .slice(0, 4)
              .map((a: any) => ({
                id: a.patient.id,
                first_name: a.patient.first_name,
                last_name: a.patient.last_name,
                gender: a.patient.gender,
                img: a.patient.img,
                colorCode: a.patient.colorCode,
              }))
          }
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;
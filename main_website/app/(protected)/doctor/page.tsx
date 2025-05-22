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
import { RecentPatientsClient } from "./recent-patients-client";

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
  } = await getDoctorDashboardStats();

  // Get ratings for the current doctor
  const ratings = await getDoctorRatings(user?.id!);
  const averageRating = ratings.length > 0
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
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
    <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
      {/* LEFT */}
      <div className="w-full xl:w-[69%]">
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm font-sans tracking-tight">
                <span className="font-semibold text-gray-700">{greeting},</span> <span className="font-extrabold text-gray-900">Dr. {user?.firstName} {user?.lastName}</span>
              </h1>
              <p className="text-gray-500 text-base mt-1">
                Here's your dashboard. Wishing you a productive day!
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500 text-blue-600 font-semibold text-sm bg-white hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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

        <div className="bg-white rounded-xl p-4 mt-8">
          <RecentAppointments data={last5Records!} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-[450px] mb-8">
          <StatSummary data={appointmentCounts} total={totalAppointment!} />
        </div>

        {/* Recent Patients Card */}
        <RecentPatientsClient
          recentPatients={
            (last5Records ?? [])
              .filter((a, i, arr) =>
                arr.findIndex(x => x.patient?.id === a.patient?.id) === i && a.patient)
              .slice(0, 4)
              .map(a => ({
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
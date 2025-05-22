import { AvailableDoctors } from "@/components/available-doctor";
import { AppointmentChart } from "@/components/charts/appointment-chart";
import { StatSummary } from "@/components/charts/stats-summary";
import { RecentAppointments } from "@/components/tables/recent-appointment";
import { getAdminDashboardStats } from "@/utils/services/admin";
import React from "react";
import DashboardCardsClient from "./dashboard-cards-client";

export const revalidate = 60;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// Types for admin dashboard stats result

type AdminDashboardStatsSuccess = {
  success: true;
  totalPatient: number;
  totalDoctors: number;
  appointmentCounts: Record<string, number>;
  availableDoctors: any[];
  monthlyData: any[];
  last5Records: any[];
  totalAppointments: number;
  status: number;
};

type AdminDashboardStatsError = {
  error: true;
  message: string;
  details: string;
};

type AdminDashboardStatsResult = AdminDashboardStatsSuccess | AdminDashboardStatsError;

const AdminDashboard = async () => {
  const result = (await getAdminDashboardStats()) as AdminDashboardStatsResult;

  if ("success" in result && result.success) {
    const {
      availableDoctors = [],
      last5Records = [],
      appointmentCounts = {},
      monthlyData = [],
      totalDoctors = 0,
      totalPatient = 0,
      totalAppointments = 0,
    } = result;

    const safeAvailableDoctors = availableDoctors.map((doc: any) => ({
      working_days: [],
      ...doc,
    }));

    const cardData = [
      {
        title: "Patients",
        value: totalPatient ?? 0,
        iconKey: "users" as const,
        note: "Total patients",
        link: "/manage-patients",
      },
      {
        title: "Doctors",
        value: totalDoctors ?? 0,
        iconKey: "user" as const,
        note: "Total doctors",
        link: "/manage-doctors",
      },
      {
        title: "Appointments",
        value: totalAppointments ?? 0,
        iconKey: "briefcaseBusiness" as const,
        note: "Total appointments",
        link: "/manage-appointments",
      },
      {
        title: "Consultation",
        value: (appointmentCounts && typeof appointmentCounts.COMPLETED === 'number') ? appointmentCounts.COMPLETED : 0,
        iconKey: "briefcaseMedical" as const,
        note: "Total consultation",
        link: "/manage-appointments",
      },
    ];

    return (
      <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
        {/* LEFT */}
        <div className="w-full xl:w-[69%]">
          <div className="bg-white rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm font-sans tracking-tight">
                  <span className="font-semibold text-gray-700">{getGreeting()},</span> <span className="font-extrabold text-gray-900">Admin</span>
                </h1>
                <p className="text-gray-500 text-base mt-1">
                  Here's your admin dashboard. Wishing you a productive day!
                </p>
            </div>
            </div>
            <DashboardCardsClient cardData={cardData} />
          </div>

          <div className="h-[500px]">
            <AppointmentChart data={monthlyData} />
          </div>

          <div className="mt-8 bg-white rounded-xl p-4">
            <RecentAppointments data={last5Records} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-[30%]">
          <div className="w-full h-[450px] mb-8">
            <StatSummary data={appointmentCounts} total={totalAppointments ?? 0} />
          </div>
          <AvailableDoctors data={safeAvailableDoctors} />
        </div>
      </div>
    );
  } else {
    // error case
    return <div>Error loading dashboard: {"message" in result ? result.message : "Unknown error"}</div>;
  }
};

export default AdminDashboard;
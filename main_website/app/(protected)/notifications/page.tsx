import React from "react";
import { Bell } from "lucide-react";
import { getRole } from "@/utils/roles";

export default async function NotificationsPage() {
  const role = await getRole();

  let greeting = "All your notifications will appear here.";
  if (role === "admin") {
    greeting = "Hello Admin! Here are all your system and user notifications.";
  } else if (role === "doctor") {
    greeting = "Hello Doctor! Here are your appointment and patient notifications.";
  } else if (role === "patient") {
    greeting = "Hello Patient! Here are your appointment and health notifications.";
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-7 h-7 text-emerald-600" />
        <h1 className="text-2xl font-bold text-emerald-700">Notifications</h1>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-emerald-100">
        <p className="text-gray-500 text-lg text-center py-12">{greeting}</p>
      </div>
    </div>
  );
} 
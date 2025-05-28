"use client";

import { motion, MotionProps } from "framer-motion";
import Link from "next/link";
import { ProfileImage } from "../../../components/profile-image";
import { User, Calendar, Phone, Mail } from 'lucide-react';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  gender?: string | null;
  img?: string | null;
  colorCode?: string | null;
}

interface RecentPatientsClientProps {
  patients: Patient[];
}

const MotionDiv = motion.div as React.ForwardRefExoticComponent<MotionProps & React.RefAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>>;

const RecentPatientsClient = ({ patients }: RecentPatientsClientProps) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg border border-[#10b981]/10 dark:border-[#10b981]/20 p-4 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1e293b] dark:text-white">Recent Patients</h2>
        <Link
          href="/doctor/patients"
          className="text-sm text-[#2563eb] dark:text-[#38bdf8] hover:text-[#174ea6] dark:hover:text-[#5eead4] transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {patients.map((patient) => (
          <MotionDiv
            key={patient.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white dark:bg-[#134e4a] rounded-xl p-4 border border-[#e5e7eb] dark:border-[#2563eb]/20 transition-all duration-200"
            whileHover={{ scale: 1.02, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-[#64748b] dark:text-gray-300" />
              <span className="font-medium text-[#1e293b] dark:text-white">{`${patient.first_name} ${patient.last_name}`}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                ${patient.gender?.toLowerCase() === 'male' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : patient.gender?.toLowerCase() === 'female'
                  ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                {patient.gender || 'Other'}
              </span>
            </div>
            <ProfileImage
              url={patient.img!}
              name={`${patient.first_name} ${patient.last_name}`}
              className="size-10"
            />
          </MotionDiv>
        ))}
      </div>
    </MotionDiv>
  );
};

export default RecentPatientsClient; 
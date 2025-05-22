"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProfileImage } from "@/components/profile-image";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  gender?: string | null;
  img?: string | null;
  colorCode?: string | null;
}

interface RecentPatientsClientProps {
  recentPatients: Patient[];
}

export function RecentPatientsClient({ recentPatients }: RecentPatientsClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="bg-white rounded-2xl shadow-xl border border-blue-100 p-4 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Patients</h2>
        <Link
          href="/record/patients/all"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500 text-blue-600 font-semibold text-sm bg-white hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          View More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <ul className="divide-y divide-gray-100">
        {recentPatients.slice(0, 4).map((p, idx) => {
          const gender = (p.gender ?? '').toLowerCase();
          let genderClass = 'bg-gray-100 text-gray-500';
          if (gender === 'male') genderClass = 'bg-blue-50 text-blue-600';
          else if (gender === 'female') genderClass = 'bg-pink-50 text-pink-600';
          return (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx, type: "spring", stiffness: 100, damping: 18 }}
              className="flex items-center gap-3 py-3"
            >
              <ProfileImage
                url={p.img ?? ""}
                name={`${p.first_name ?? ""} ${p.last_name ?? ""}`}
                className="w-11 h-11 bg-blue-100 border-2 border-white shadow"
                bgColor={p.colorCode ?? ""}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{p.first_name} {p.last_name}</div>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${genderClass}`}>{p.gender ?? 'Other'}</span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
} 
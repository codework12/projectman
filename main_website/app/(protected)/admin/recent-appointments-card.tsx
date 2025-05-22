'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  status: string;
}

interface RecentAppointmentsCardProps {
  data: Appointment[];
}

const RecentAppointmentsCard = ({ data }: RecentAppointmentsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 80, damping: 18 }}
    className="bg-white rounded-2xl shadow-xl border border-blue-100 p-4 mb-8"
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
      <Link
        href="/manage-appointments"
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500 text-blue-600 font-semibold text-sm bg-white hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        View More
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
    <ul className="divide-y divide-gray-100">
      {data && data.length > 0 ? (
        data.slice(0, 4).map((appt) => (
          <li key={appt.id} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
            <span className="font-semibold text-gray-900 flex-1">{appt.patientName}</span>
            <span className="text-gray-500 text-sm flex-1">{appt.date}</span>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 md:mt-0 ${appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'}`}>{appt.status}</span>
          </li>
        ))
      ) : (
        <li className="text-gray-400 py-4 text-center">No recent appointments</li>
      )}
    </ul>
  </motion.div>
);

export default RecentAppointmentsCard; 
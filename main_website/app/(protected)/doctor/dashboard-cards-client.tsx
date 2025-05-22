"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, BriefcaseBusiness, BriefcaseMedical, Star, ArrowRight } from "lucide-react";

interface CardData {
  title: string;
  value: string | number;
  iconKey: string;
  className: string;
  iconClassName: string;
  note: string;
  link: string;
}

interface DashboardCardsClientProps {
  cardData: CardData[];
}

const iconMap: Record<string, any> = {
  users: Users,
  briefcaseBusiness: BriefcaseBusiness,
  briefcaseMedical: BriefcaseMedical,
  star: Star,
};

const themeMap = {
  users: {
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    border: "border-t-4 border-blue-500",
    btn: "bg-blue-100 hover:bg-blue-600 focus:ring-blue-400",
    btnIcon: "text-blue-500 group-hover:text-white",
  },
  briefcaseBusiness: {
    iconBg: "bg-yellow-400",
    iconColor: "text-white",
    border: "border-t-4 border-yellow-400",
    btn: "bg-yellow-100 hover:bg-yellow-400 focus:ring-yellow-300",
    btnIcon: "text-yellow-500 group-hover:text-white",
  },
  briefcaseMedical: {
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    border: "border-t-4 border-emerald-500",
    btn: "bg-emerald-100 hover:bg-emerald-500 focus:ring-emerald-400",
    btnIcon: "text-emerald-500 group-hover:text-white",
  },
  star: {
    iconBg: "bg-amber-400",
    iconColor: "text-white",
    border: "border-t-4 border-amber-400",
    btn: "bg-amber-100 hover:bg-amber-400 focus:ring-amber-300",
    btnIcon: "text-amber-500 group-hover:text-white",
  },
};

export function DashboardCardsClient({ cardData }: DashboardCardsClientProps) {
  return (
    <motion.div
      className="w-full flex flex-wrap gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {cardData?.map((el, index) => {
        const Icon = iconMap[el.iconKey];
        const theme = themeMap[el.iconKey as keyof typeof themeMap];
        return (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`relative flex-1 min-w-[220px] max-w-[270px] rounded-2xl p-6 shadow-lg bg-white ${theme.border} transition-all duration-200`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full shadow-inner ${theme.iconBg}`}> 
                {Icon && <Icon className={`w-7 h-7 ${theme.iconColor}`} />}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">{el.title}</div>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">{el.value}</span>
              {el.title === "Rating" && <span className="text-lg font-semibold text-gray-500">/5</span>}
            </div>
            <div className="text-sm text-gray-500 mt-1">{el.note}</div>
            {/* Modern floating action button for details */}
            <Link
              href={el.link}
              className={`absolute bottom-4 right-4 z-10 rounded-full ${theme.btn} transition-colors shadow-md p-2 group focus:outline-none focus:ring-2`}
              aria-label={`See details for ${el.title}`}
            >
              <ArrowRight className={`w-5 h-5 ${theme.btnIcon} transition-colors`} />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
} 
"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Users } from "lucide-react";
import { formatNumber } from "@/utils";
import { motion } from "framer-motion";

export const StatSummary = ({ data, total }: { data: any; total: number }) => {
  const dataInfo = [
    { name: "Total", count: total || 0, fill: "white" },
    {
      name: "Appointments",
      count: data?.PENDING + data?.SCHEDULED || 0,
      fill: "#000000",
    },
    { name: "Consultation", count: data?.COMPLETED || 0, fill: "#2563eb" },
  ];

  const appointment = dataInfo[1].count;
  const consultation = dataInfo[2].count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      whileHover={{ scale: 1.015, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}
      className="relative bg-card backdrop-blur-xl rounded-2xl shadow-xl border border-border p-2 sm:p-6 w-full h-full overflow-hidden transition-all duration-200"
    >
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent rounded-t-2xl z-10" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary rounded-full p-2 shadow-sm">
            <Users className="w-5 h-5" />
          </span>
          <h1 className="text-base sm:text-2xl font-extrabold text-foreground tracking-tight font-sans">Summary</h1>
        </div>
      </div>
      <div className="relative w-full h-[180px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height={typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 300}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={dataInfo}
          >
            <RadialBar background dataKey={"count"} />
          </RadialBarChart>
        </ResponsiveContainer>
        <Users
          size={30}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-16 mt-2">
        {[1, 2].map((i, idx) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, type: "spring", stiffness: 100, damping: 18 }}
            whileHover={{ scale: 1.04, backgroundColor: "var(--muted)" }}
            className="flex flex-col gap-1 rounded-xl px-3 py-2 transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-xl ${i === 1 ? 'bg-foreground' : 'bg-primary'}`} />
              <div className="flex flex-col">
                <h1 className="font-bold text-base sm:text-xl text-foreground font-sans">{formatNumber(i === 1 ? appointment : consultation)}</h1>
                <h2 className="text-xs text-muted-foreground font-medium">
                  {dataInfo[i].name} ({(((i === 1 ? appointment : consultation) / (appointment + consultation)) * 100).toFixed(0)}%)
                </h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
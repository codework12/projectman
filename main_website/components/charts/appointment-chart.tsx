"use client";
import { AppointmentsChartProps } from "@/types/data-types";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  Legend,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart2 } from "lucide-react";

interface DataProps {
  data: AppointmentsChartProps;
}
export const AppointmentChart = ({ data }: DataProps) => {
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    const updateHeight = () => {
      setChartHeight(window.innerWidth < 640 ? 180 : 300);
    };

    // Set initial height
    updateHeight();

    // Add event listener for window resize
    window.addEventListener('resize', updateHeight);

    // Cleanup
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="relative bg-card rounded-2xl shadow-xl border border-border p-2 sm:p-6 h-full overflow-hidden w-full">
      {/* Animated Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent rounded-t-2xl z-10 animate-shimmer" />
      <div className="flex items-center gap-3 mb-2">
        <span className="relative flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 blur-md scale-110 z-0 animate-pulse" />
          <span className="bg-primary/10 text-primary rounded-full p-2 shadow-sm relative z-10">
            <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
          </span>
        </span>
        <div>
          <h1 className="text-base sm:text-2xl font-extrabold text-foreground tracking-tight">Appointments</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">Monthly Overview</p>
        </div>
      </div>
      <div className="rounded-xl bg-muted p-2 sm:p-4 shadow-inner w-full">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAppointment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis dataKey="name" axisLine={false} tick={{ fill: "var(--foreground)", fontWeight: 500 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "var(--foreground)", fontWeight: 500 }} tickLine={false} />
          <Tooltip
              contentStyle={{ borderRadius: "14px", borderColor: "var(--border)", background: "var(--card)", boxShadow: "0 4px 24px 0 rgba(16,185,129,0.12)" }}
              itemStyle={{ fontWeight: 600, color: "#2563eb" }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 700 }}
          />
          <Legend
            align="left"
            verticalAlign="top"
              iconType="circle"
            wrapperStyle={{
                paddingTop: "10px",
                paddingBottom: "20px",
              textTransform: "capitalize",
                fontWeight: 700,
                color: "var(--primary)",
                fontSize: "1rem",
                letterSpacing: "0.01em",
            }}
          />
            <Area
              type="monotone"
            dataKey="appointment"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorAppointment)"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={900}
          />
            <Area
              type="monotone"
            dataKey="completed"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorCompleted)"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={900}
          />
          </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};
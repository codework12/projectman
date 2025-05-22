"use client";

import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

export const RatingChart = ({
  totalRatings,
  averageRating,
}: {
  totalRatings: number;
  averageRating: number;
}) => {
  const negative = 5 - averageRating;
  const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const positiveColor = isDark ? '#22d3ee' : '#22c55e'; // cyan-400 or green-500
  const negativeColor = isDark ? '#f87171' : '#e74c3c'; // red-400 or red-500

  const data = [
    { name: "Positive", value: averageRating, fill: positiveColor },
    { name: "Negative", value: negative, fill: negativeColor },
  ];

  return (
    <div className="bg-card p-4 rounded-md h-80 relative border border-border">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Ratings</h1>
      </div>

      <ResponsiveContainer width={"100%"} height={"100%"}>
        <PieChart>
          <Pie
            dataKey={"value"}
            startAngle={180}
            endAngle={0}
            data={data}
            cx={"50%"}
            cy={"50%"}
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-2xl font-bold text-foreground">{averageRating?.toFixed(1)}</h1>
        <p className="text-xs text-muted-foreground">of max ratings</p>
      </div>

      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center text-muted-foreground">
        Rated by {totalRatings} patients
      </h2>
    </div>
  );
};
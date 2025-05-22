"use client";

import React, { useEffect, useState } from "react";
import { RatingList } from "./rating-list";

export const PatientRatingContainer = ({ id }: { id?: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/ratings?patientId=${id}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Loading ratings...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          No ratings found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <RatingList data={data} />
    </div>
  );
};
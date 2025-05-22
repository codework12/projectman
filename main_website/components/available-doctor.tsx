import { AvailableDoctorProps } from "@/types/data-types";
import { checkRole } from "@/utils/roles";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card } from "./ui/card";
import { ProfileImage } from "./profile-image";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const getToday = () => {
  const today = new Date().getDay();
  return DAYS_OF_WEEK[today] || DAYS_OF_WEEK[0];
};

const todayDay = getToday();

interface Days {
  day: string;
  start_time: string;
  close_time: string;
}

interface DataProps {
  data: AvailableDoctorProps;
}

export const availableDays = ({ data }: { data: Days[] }) => {
  const isTodayWorkingDay = data?.find(
    (dayObj) => dayObj?.day?.toLowerCase() === todayDay
  );

  return isTodayWorkingDay
    ? `${isTodayWorkingDay?.start_time} - ${isTodayWorkingDay?.close_time}`
    : "Not Available";
};
export const AvailableDoctors = async ({ data }: DataProps) => {
  return (
    <div className="relative bg-card backdrop-blur-xl rounded-2xl shadow-xl border border-border p-6 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent rounded-t-2xl z-10" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Available Doctors</h1>
        {(await checkRole("ADMIN")) && (
          <Button
            asChild
            variant={"outline"}
            disabled={data?.length === 0}
            className="disabled:cursor-not-allowed disabled:text-muted-foreground border-border text-primary font-semibold hover:bg-primary/10 flex items-center gap-2"
          >
            <Link href="/record/doctors/list">View all</Link>
          </Button>
        )}
      </div>
      <div className="w-full space-y-5 md:space-y-0 md:gap-6 flex flex-col md:flex-row md:flex-wrap">
        {data?.map((doc, id) => (
          <Card
            key={id}
            className={`border border-border w-full md:w-[300px] min-h-28 xl:w-full p-4 flex gap-4 ${id % 2 === 0 ? 'bg-muted/50' : 'bg-muted/70'}`}
          >
            <ProfileImage
              url={doc?.img}
              name={doc?.name}
              className={`md:flex min-w-14 min-h-14 md:min-w-16 md:min-h-16`}
              textClassName="text-2xl font-semibold text-foreground"
              bgColor={doc?.colorCode!}
            />
            <div>
              <h2 className="font-semibold text-lg md:text-xl text-foreground">{doc?.name}</h2>
              <p className="text-base capitalize text-muted-foreground">  
                {doc?.specialization}
              </p>
              <p className="text-sm flex items-center text-muted-foreground">
                  <span className="hidden lg:flex">Available Time:</span>
                {availableDays({ data: doc?.working_days })}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
'use client';
import { Star, Quote, User as UserIcon } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DataProps {
  id: number;
  staff_id: string;
  rating: number;
  comment?: string;
  created_at: Date | string;
  patient: { last_name: string; first_name: string; img?: string };
}

function getInitials(first: string, last: string) {
  return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
}

export const RatingList = ({ data }: { data: any[] }) => {
  return (
    <div className="relative bg-card backdrop-blur-lg rounded-2xl shadow-2xl border border-border overflow-hidden">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary to-accent rounded-t-2xl" />
      <div className="flex items-center justify-between p-6 pb-2">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Your Reviews</h1>
      </div>
      <div className="space-y-6 p-4 pt-2 bg-muted/60">
        <AnimatePresence>
          {data?.map((rate, id) => (
            <React.Fragment key={rate?.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: id * 0.09 }}
                className="group bg-card rounded-2xl shadow-lg border border-border p-5 flex flex-col gap-2 transition-all duration-200 hover:shadow-primary/20 hover:shadow-2xl hover:scale-[1.025] relative"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {rate?.patient?.img ? (
                      <img src={rate.patient.img} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30 shadow" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/30 shadow">
                        {getInitials(rate?.patient?.first_name, rate?.patient?.last_name)}
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base font-bold text-foreground flex items-center gap-2">
                        {rate?.patient?.first_name + " " + rate?.patient?.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium mt-0.5">
                        {new Date(rate?.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div className="flex items-center text-yellow-500" initial="hidden" animate="visible" variants={{visible: {transition: {staggerChildren: 0.08}}, hidden: {}}}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: id * 0.09 + index * 0.07, type: 'spring', stiffness: 200 }}
                        >
                          <Star
                            className={`w-5 h-5 ${index < rate.rating ? "fill-yellow-400" : "fill-muted"}`}
                            fill={index < rate.rating ? "#facc15" : "var(--muted)"}
                          />
                        </motion.span>
                      ))}
                    </motion.div>
                    <span className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 font-bold text-sm shadow-inner border border-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-300 dark:border-yellow-900/40">
                      {rate.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                {rate.comment && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 bg-muted/80 border-l-4 border-primary/40 px-5 py-3 rounded-xl italic text-muted-foreground text-base flex items-start gap-2"
                  >
                    <Quote className="w-5 h-5 text-primary mt-0.5" />
                    <span>{rate.comment}</span>
                  </motion.div>
                )}
              </motion.div>
              {/* Divider between reviews */}
              {id !== data.length - 1 && <div className="mx-2 my-1 border-t border-dashed border-border" />}
            </React.Fragment>
          ))}
        </AnimatePresence>
        {data?.length === 0 && (
          <div className="px-2 text-muted-foreground">
            <p>No Reviews</p>
          </div>
        )}
      </div>
    </div>
  );
};
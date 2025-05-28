'use client';

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ display: 'block' }}
      >
        <div className="text-center">
          <div className="mb-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ display: 'block' }}
            >
              <Heart className="w-16 h-16 text-emerald-600" />
            </motion.div>
          </div>
          <div className="text-2xl font-semibold text-gray-800">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'block' }}
            >
              Our Top Clinic
            </motion.div>
          </div>
          <div className="text-gray-600 mt-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'block' }}
            >
              Loading your healthcare experience...
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, Users, User, ArrowRight, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function OnboardingClient() {
  const router = useRouter();
  const [selected, setSelected] = useState<'patient' | 'doctor' | null>(null);

  const handleContinue = () => {
    console.log('Continue clicked, selected:', selected);
    if (selected === 'patient') {
      console.log('Redirecting to patient registration');
      router.push('/patient/registration');
    } else if (selected === 'doctor') {
      console.log('Redirecting to doctor registration');
      router.push('/doctor-registration');
    }
  };

  const handleHealthProviderClick = () => {
    console.log('Healthcare provider clicked');
    router.push('/doctor-registration');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent flex flex-col">
      <div className="py-6 px-4">
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center mr-2">
            <HeartPulse className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">OurTopClinic</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
              Welcome to <span className="gradient-text">OurTopClinic</span>
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              To provide you with the best experience, please let us know how you'd like to proceed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div variants={itemVariants}>
              <Card
                className={`hover-lift cursor-pointer transition-all h-full ${
                  selected === 'patient' ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => setSelected('patient')}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">I'm a Patient</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <CardDescription className="text-base">
                    Access your medical records, book appointments, and connect with healthcare professionals.
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <ul className="w-full space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Book appointments online
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Secure messaging with doctors
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Manage your health records
                    </li>
                  </ul>
                  {selected === 'patient' && (
                    <div className="w-full">
                      <Button className="w-full gradient-bg" size="sm">
                        Selected
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                className={`hover-lift cursor-pointer transition-all h-full ${
                  selected === 'doctor' ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => {
                  setSelected('doctor');
                  router.push('/doctor-registration');
                }}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">I'm a Healthcare Provider</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <CardDescription className="text-base">
                    Manage your practice, patient schedules, and provide remote consultations.
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <ul className="w-full space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      View and manage appointments
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Conduct virtual consultations
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Access patient health records
                    </li>
                  </ul>
                  {selected === 'doctor' && (
                    <div className="w-full">
                      <Button className="w-full gradient-bg" size="sm">
                        Selected
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="text-center">
            <Button
              size="lg"
              className="gradient-bg button-3d"
              onClick={handleContinue}
              disabled={!selected}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="py-4 text-center text-sm text-gray-500">
        <p>© 2025 OurTopClinic. All rights reserved.</p>
      </div>
    </div>
  );
} 
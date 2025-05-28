'use client';

import { Button } from "@/components/ui/button";
import { HeartPulse, User, Stethoscope, Shield, Lock, Smartphone, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { useAuth, useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedSection = ({ children, delay = 0, className = "" }: AnimatedSectionProps) => (
  <div className={className}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  </div>
);

export default function Home() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;

  const handleContinue = () => {
    if (!isSignedIn) {
      window.location.href = '/onboarding';
    } else if (userRole === 'admin') {
      window.location.href = '/admin';
    } else if (userRole === 'doctor') {
      window.location.href = '/doctor';
    } else if (userRole === 'user' || userRole === 'patient') {
      window.location.href = '/patient';
    } else {
      window.location.href = '/onboarding';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Column - Authentication Options */}
          <div className="space-y-8">
            <AnimatedSection delay={0.2}>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {isSignedIn ? "Welcome Back!" : "Access Your Healthcare Dashboard"}
              </h1>
              <p className="text-xl text-gray-300 mt-4">
                {isSignedIn 
                  ? "Your account has been created successfully. Let's continue with the setup."
                  : "Sign in to manage your appointments, prescriptions, and health records"}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={handleContinue}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Continue Setup
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Shield, text: "Secure" },
                  { icon: Lock, text: "Private" },
                  { icon: Smartphone, text: "Mobile" }
                ].map((feature, index) => (
                  <div key={index} className="group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card className="h-full border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <feature.icon className="h-6 w-6 text-emerald-400" />
                          </div>
                          <CardTitle className="text-gray-200">{feature.text}</CardTitle>
                          <CardDescription className="text-gray-400">{feature.text}</CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column - Decorative Elements */}
          <AnimatedSection delay={0.4} className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <HeartPulse className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">Health Records</h3>
                      <p className="text-sm text-gray-400">Access your complete medical history</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">Appointments</h3>
                      <p className="text-sm text-gray-400">Schedule and manage your visits</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">Security</h3>
                      <p className="text-sm text-gray-400">Your data is always protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
    </div>
  );
}
'use client';

import { Button } from "@/components/ui/button";
import { HeartPulse, User, Stethoscope, Shield, Lock, Smartphone, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { useAuth, useUser } from "@clerk/nextjs";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedSection = ({ children, delay = 0, className = "" }: AnimatedSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Column - Authentication Options */}
          <div className="space-y-8">
            <AnimatedSection delay={0.2}>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {isSignedIn ? "Welcome Back!" : "Access Your Healthcare Dashboard"}
              </h1>
              <p className="text-xl text-gray-600 mt-4">
                {isSignedIn 
                  ? "Your account has been created successfully. Let's continue with the setup."
                  : "Sign in to manage your appointments, prescriptions, and health records"}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={handleContinue}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Continue Setup
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, text: "Secure" },
                  { icon: Lock, text: "Private" },
                  { icon: Smartphone, text: "Mobile" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
                  >
                    <feature.icon className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{feature.text}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column - Decorative Elements */}
          <AnimatedSection delay={0.4} className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <HeartPulse className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Health Records</h3>
                      <p className="text-sm text-gray-600">Access your complete medical history</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Appointments</h3>
                      <p className="text-sm text-gray-600">Schedule and manage your visits</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Security</h3>
                      <p className="text-sm text-gray-600">Your data is always protected</p>
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
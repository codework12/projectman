"use client"

import React, { useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/sections/HeroSection1';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CtaSection from '@/components/sections/CtaSection';
import FooterSection from '@/components/sections/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollAnimator from '@/components/ScrollAnimator';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FloatingButton = () => (
  <div className="fixed bottom-6 right-6 z-40">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl"
        onClick={() => window.location.href = '/onboarding'}
      >
        Get Started
      </Button>
    </motion.div>
  </div>
);

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const AnimatedContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-8">
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  </div>
);

const Index = () => {
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  
  useEffect(() => {
    // Update page title
    document.title = 'OurTopClinic - Healthcare Made Simple';
  }, []);

  // Animation for page elements
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        
        {/* Blog preview section */}
        <section className="py-20 bg-gradient-to-b from-white via-emerald-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-emerald-700 drop-shadow-sm">
                Health Knowledge Hub
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                Stay informed with the latest articles and research on health topics that matter to you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
              {/* Wellness Article */}
              <div className="group">
                <div className="bg-white border border-primary/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
                      alt="Boost Immune System"
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      Wellness
                    </span>
                  </div>
                  <div className="p-5 flex flex-col h-full">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-emerald-700 transition">
                      10 Proven Ways to Boost Your Immune System
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                      Discover evidence-based strategies to strengthen your body's natural defenses.
                    </p>
                    <a
                      href="/pages"
                      className="text-emerald-700 hover:underline text-sm font-medium flex items-center mt-auto"
                    >
                      Read more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Medical Article */}
              <div className="group">
                <div className="bg-white border border-primary/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=600&q=80"
                      alt="Boost Immune System"
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      Medical
                    </span>
                  </div>
                  <div className="p-5 flex flex-col h-full">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-emerald-700 transition">
                      Understanding Telehealth: The Future of Medicine
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                      Learn how virtual healthcare is transforming patient experiences and access to care.
                    </p>
                    <a
                      href="/blog"
                      className="text-emerald-700 hover:underline text-sm font-medium flex items-center mt-auto"
                    >
                      Read more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Nutrition Article */}
              <div className="group">
                <div className="bg-white border border-primary/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                      alt="Heart Healthy Eating"
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      Nutrition
                    </span>
                  </div>
                  <div className="p-5 flex flex-col h-full">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-emerald-700 transition">
                      Heart-Healthy Eating Guide
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                      Detailed guidance on dietary choices that support cardiovascular health.
                    </p>
                    <a
                      href="/blog"
                      className="text-emerald-700 hover:underline text-sm font-medium flex items-center mt-auto"
                    >
                      Read more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <a
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition group"
              >
                View All Articles
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>
        
        <TestimonialsSection />
        <CtaSection />
        <FooterSection />
        <ScrollToTop />
        <ScrollAnimator />
        <FloatingButton />
      </motion.div>
    </div>
  );
};

export default Index;

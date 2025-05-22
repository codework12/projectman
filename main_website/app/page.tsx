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

const FloatingButton = () => (
  <motion.div
    className="fixed bottom-6 right-6 z-40"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
  >
    <Link href="/onboarding">
      <Button className="gradient-bg rounded-full shadow-lg h-14 pl-6 pr-5 button-3d">
        Get Started
        <ChevronRight className="ml-1 h-5 w-5" />
      </Button>
    </Link>
  </motion.div>
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
    <motion.div 
      className="min-h-screen overflow-x-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      
      {/* Blog preview section */}
      <section className="py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Health Knowledge Hub</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay informed with the latest articles and research on health topics that matter to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Wellness Article */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover-lift hover-glow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
                  alt="Boost Immune System"
                  className="object-cover w-full h-full"
                />
                <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full z-10">
                  Wellness
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">10 Proven Ways to Boost Your Immune System</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  Discover evidence-based strategies to strengthen your body's natural defenses.
                </p>
                <Link href="/pages" className="text-primary hover:underline text-sm font-medium flex items-center">
                  Read more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Medical Article */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover-lift hover-glow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-40 w-full overflow-hidden">
              <img
                  src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=600&q=80"
                  alt="Boost Immune System"
                  className="object-cover w-full h-full"
                />
                <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full z-10">
                  Medical
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">Understanding Telehealth: The Future of Medicine</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  Learn how virtual healthcare is transforming patient experiences and access to care.
                </p>
                <Link href="/blog" className="text-primary hover:underline text-sm font-medium flex items-center">
                  Read more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Nutrition Article */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover-lift hover-glow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                  alt="Heart Healthy Eating"
                  className="object-cover w-full h-full"
                />
                <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full z-10">
                  Nutrition
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">Heart-Healthy Eating Guide</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  Detailed guidance on dietary choices that support cardiovascular health.
                </p>
                <Link href="/blog" className="text-primary hover:underline text-sm font-medium flex items-center">
                  Read more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center">
            <Button asChild className="gradient-bg group">
              <Link href="/blog">
                View All Articles
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
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
  );
};

export default Index;

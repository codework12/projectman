"use client"
import React, { useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollAnimator from '@/components/ScrollAnimator';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, Users, Clock, HeartPulse, ChevronRight, Building, MapPin, Heart, Calendar, Stethoscope, Shield } from 'lucide-react';

const AboutUs = () => {
  useEffect(() => {
    // Update page title
    document.title = 'About OurTopClinic - Our Story and Mission';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                About <span className="gradient-text">OurTopClinic</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Transforming healthcare through innovation, compassion, and excellence since 2023.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">Patient-Centered Care</span>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">Innovation</span>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">Compassion</span>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">Excellence</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-primary/20 rounded-full opacity-20 animate-ping-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 border border-primary/20 rounded-full opacity-30 animate-ping-slow" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-0">
                  <img
                    src="/about_us.png"
                    alt="Compassionate care at OurTopClinic"
                    className="object-contain w-full max-w-md rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Founded in 2023 by a group of passionate healthcare providers, OurTopClinic was born out of frustration with the broken, impersonal, and often inaccessible healthcare system. As clinicians who have worked on the front lines, we witnessed firsthand how patients were often left behind by bureaucracy, long wait times, and insurance hurdles. We knew there had to be a better way — so we built one.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                At OurTopClinic, we are on a mission to transform the way care is delivered. We believe in putting patients first, not paperwork. Our platform was designed to be intuitive, flexible, and personal — whether you are seeking a quick telehealth consultation, long-term wellness care, or support managing chronic conditions, we are here when and how you need us.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
            <div className="relative inline-block mb-8">
              <HeartPulse className="text-primary w-16 h-16 mx-auto" />
              <span className="absolute -top-2 -right-2 animate-ping-slow">
                <Heart className="text-primary/20 w-4 h-4" />
              </span>
              <span className="absolute bottom-0 -left-3 animate-ping-slow" style={{ animationDelay: '1s' }}>
                <Heart className="text-primary/20 w-3 h-3" />
              </span>
            </div>
            <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 mb-8">
              "To empower individuals through accessible, personalized healthcare, enabled by innovation and delivered with compassion."
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              At OurTopClinic, we believe that everyone deserves access to high-quality healthcare. Through our innovative platforms and dedicated team, we're working to break down barriers and create a healthcare experience that truly puts patients first.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                These principles guide every decision we make and every interaction we have.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover-lift"
              variants={fadeInUp}
            >
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Compassion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We treat each patient with empathy, dignity and respect, recognizing the human aspect of healthcare.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover-lift"
              variants={fadeInUp}
            >
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Award className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We strive for the highest standards in clinical care, service, and every aspect of our operations.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover-lift"
              variants={fadeInUp}
            >
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Integrity</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We uphold honesty, transparency, and ethical behavior in all our interactions and decisions.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover-lift"
              variants={fadeInUp}
            >
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Stethoscope className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We embrace new ideas, technologies, and approaches to continuously improve healthcare delivery.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
 
      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-4xl font-bold gradient-text mb-2">15+</h3>
              <p className="text-gray-600 dark:text-gray-400">Locations</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-4xl font-bold gradient-text mb-2">500+</h3>
              <p className="text-gray-600 dark:text-gray-400">Healthcare Professionals</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-4xl font-bold gradient-text mb-2">100K+</h3>
              <p className="text-gray-600 dark:text-gray-400">Patients Served</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-4xl font-bold gradient-text mb-2">99%</h3>
              <p className="text-gray-600 dark:text-gray-400">Patient Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of patients who have transformed their healthcare experience with OurTopClinic.
            </p>
            <Button asChild size="lg" className="gradient-bg group button-3d">
              <Link href="/onboarding">
                Get Started Today
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
     
      
      <FooterSection />
      <ScrollToTop />
      <ScrollAnimator />
    </div>
  );
};

export default AboutUs;

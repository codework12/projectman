
import React, { useEffect } from 'react';
import EnhancedNavbar from '@/components/navbar/EnhancedNavbar';
import HeroSection from '@/components/sections/HeroSection1';
import HeroBackground from '@/components/hero/HeroBackground';
import FeaturesSection from '@/components/sections/FeaturesSection';
import StatsSection from '@/components/sections/StatsSection';
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

const BlogCard = ({ title, category, excerpt }: { title: string; category: string; excerpt: string }) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover-lift hover-glow"
    whileHover={{ 
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }}
  >
    <div className="h-48 bg-primary/10 flex items-center justify-center relative overflow-hidden">
      <BookOpen className="h-16 w-16 text-primary/30" />
      <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full">
        {category}
      </span>
    </div>
    <div className="p-5">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {excerpt}
      </p>
          <Link href="/blog" className="text-primary hover:underline text-sm font-medium flex items-center">
        Read more <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  </motion.div>
);

const EnhancedIndex = () => {
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

  const blogPosts = [
    {
      title: "10 Proven Ways to Boost Your Immune System",
      category: "Wellness",
      excerpt: "Discover evidence-based strategies to strengthen your body's natural defenses."
    },
    {
      title: "Understanding Telehealth: The Future of Medicine",
      category: "Medical",
      excerpt: "Learn how virtual healthcare is transforming patient experiences and access to care."
    },
    {
      title: "Heart-Healthy Eating Guide",
      category: "Nutrition",
      excerpt: "Detailed guidance on dietary choices that support cardiovascular health."
    }
  ];

  return (
    <motion.div 
      className="min-h-screen overflow-x-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <HeroBackground />
      <EnhancedNavbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      
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
            {blogPosts.map((post, index) => (
              <BlogCard 
                key={index}
                title={post.title}
                category={post.category}
                excerpt={post.excerpt}
              />
            ))}
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

export default EnhancedIndex;

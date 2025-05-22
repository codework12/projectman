
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  UserPlus, 
  Calendar, 
  Video, 
  CreditCard, 
  Pill, 
  TestTube, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className={cn(
        "bg-white/80 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover-card reveal",
        `scroll-animation-${delay}`
      )}
    >
      <div className="h-12 w-12 gradient-bg flex items-center justify-center rounded-xl mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90"></div>
        {icon}
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal');
            elements.forEach(el => {
              el.classList.add('active');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <UserPlus className="h-6 w-6 text-white relative z-10" />,
      title: "Account Creation",
      description: "Create your profile as a patient or healthcare provider in just a few minutes.",
      delay: 1
    },
    {
      icon: <Calendar className="h-6 w-6 text-white relative z-10" />,
      title: "Appointment Booking",
      description: "Book, manage, and receive confirmations for all your medical appointments.",
      delay: 2
    },
    {
      icon: <Video className="h-6 w-6 text-white relative z-10" />,
      title: "Video Consultations",
      description: "Connect with doctors through high-quality, secure video calls.",
      delay: 3
    },
    {
      icon: <CreditCard className="h-6 w-6 text-white relative z-10" />,
      title: "Secure Payments",
      description: "Pay for consultations and services through our encrypted payment system.",
      delay: 1
    },
    {
      icon: <Pill className="h-6 w-6 text-white relative z-10" />,
      title: "Medication Orders",
      description: "Order prescribed medications and get them delivered to your doorstep.",
      delay: 2
    },
    {
      icon: <TestTube className="h-6 w-6 text-white relative z-10" />,
      title: "Lab Test Booking",
      description: "Schedule lab tests and access results directly through the platform.",
      delay: 3
    }
  ];

  return (
    <section 
      id="features" 
      className="section-padding bg-gradient-to-b from-white dark:from-gray-900 to-blue-50 dark:to-gray-800 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/5 dark:bg-accent/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block relative mb-3">
            <Sparkles className="h-6 w-6 text-primary absolute -top-3 -left-3 animate-pulse-soft" />
            <span className="px-4 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground rounded-full text-sm font-medium">
              Core Features
            </span>
            <Sparkles className="h-6 w-6 text-accent absolute -bottom-3 -right-3 animate-pulse-soft" style={{ animationDelay: '1s' }} />
          </div>
          
          <h2 className="section-title text-center reveal scroll-animation-1 dark:text-white">
            All-in-One Healthcare <span className="gradient-text">Platform</span>
          </h2>
          <p className="section-description text-center reveal scroll-animation-2 dark:text-gray-300">
            OurTopClinic combines cutting-edge technology with medical expertise to provide you with a seamless healthcare experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>

        <div className="mt-16 text-center reveal scroll-animation-3">
          <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-md inline-block p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover-lift">
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-accent mr-0 sm:mr-3 mb-3 sm:mb-0" />
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold dark:text-white">100% Secure & HIPAA Compliant</h3>
                <p className="text-gray-600 dark:text-gray-300">Your data is encrypted and protected at all times.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button className="gradient-bg button-3d text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

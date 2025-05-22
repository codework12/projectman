
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video, Calendar, Sparkles, Heart, Shield, Stethoscope, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Add animation class when component is mounted
    const animatedElements = document.querySelectorAll('.reveal');
    animatedElements.forEach(el => {
      el.classList.add('active');
    });
    
    // Setup the canvas for the animated background
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas dimensions
        const resizeCanvas = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create the animated particles
        const particles: Particle[] = [];
        const particleCount = 30;
        
        class Particle {
          x: number;
          y: number;
          radius: number;
          color: string;
          speedX: number;
          speedY: number;
          opacity: number;
          
          constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 5 + 1;
            this.color = `hsl(142, ${Math.random() * 50 + 50}%, ${Math.random() * 40 + 40}%)`;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
          }
          
          update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off walls
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
              this.speedX = -this.speedX;
            }
            
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
              this.speedY = -this.speedY;
            }
          }
          
          draw() {
            if (ctx) {
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
              ctx.fillStyle = this.color.replace(')', `, ${this.opacity})`);
              ctx.fill();
              
              // Add glow effect
              ctx.shadowBlur = 15;
              ctx.shadowColor = this.color;
            }
          }
        }
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
        
        // Connect particles with lines if they are close enough
        function connectParticles() {
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(46, 125, 50, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
              }
            }
          }
        }
        
        // Animation loop
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw and update particles
          particles.forEach(particle => {
            particle.update();
            particle.draw();
          });
          
          connectParticles();
          
          animationRef.current = requestAnimationFrame(animate);
        };
        
        animate();
        
        // Cleanup
        return () => {
          window.removeEventListener('resize', resizeCanvas);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };
      }
    }
  }, []);
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0" 
        style={{ background: 'linear-gradient(to bottom, rgba(46, 125, 50, 0.1), rgba(0, 0, 0, 0))' }}
      />

      {/* Hero content */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
        <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 reveal scroll-animation-1 relative inline-block">
            <span className="absolute -left-8 -top-6 text-primary/30 dark:text-primary/20 animate-pulse-soft">
              <Sparkles className="h-6 w-6" />
            </span>
            Your Health. <span className="gradient-text relative">
              Our Priority.
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3C50 0.5 150 0.5 200 3" stroke="url(#paint0_linear)" strokeWidth="5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="3" x2="200" y2="3" gradientUnits="userSpaceOnUse">
                    <stop stopColor="hsl(var(--primary))" stopOpacity="0" />
                    <stop offset="0.5" stopColor="hsl(var(--primary))" />
                    <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="absolute -right-8 -bottom-4 text-accent/30 dark:text-accent/20 animate-bounce-gentle">
              <Sparkles className="h-6 w-6" />
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 reveal scroll-animation-2 relative">
            Connect with top doctors, book appointments, and get the care you deserve — all in one secure platform.
            <span className="absolute -right-4 bottom-0 animate-pulse-soft text-primary/30 dark:text-primary/20" style={{ animationDelay: '1.5s' }}>
              <Sparkles className="h-5 w-5" />
            </span>
          </p>
          <div className="flex justify-center lg:justify-start reveal scroll-animation-3">
            <Button asChild size="lg" className="gradient-bg group button-3d">
              <Link to="/onboarding">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4 reveal scroll-animation-3" style={{ transitionDelay: '0.7s' }}>
            <div className="bg-white/30 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 animate-fade-in">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="bg-white/30 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Top Rated Doctors</span>
            </div>
            <div className="bg-white/30 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center relative reveal scroll-animation-2">
          <div className="glass-card w-full max-w-md p-4 md:p-8 rounded-2xl relative hover-glow">
            {/* 3D Medical Interface Mockup */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-clinic-100 dark:border-gray-700 animate-rotate-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Patient Dashboard</h3>
                <div className="rounded-full bg-clinic-500 text-white h-8 w-8 flex items-center justify-center animate-bounce-gentle">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              
              {/* Appointment Card */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 border border-gray-100 dark:border-gray-700 hover-card">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Upcoming Appointment</div>
                    <div className="font-semibold">Dr. Sarah Wilson</div>
                    <div className="text-sm">Cardiologist</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium">Today</div>
                    <div className="text-sm">10:30 AM</div>
                  </div>
                </div>
              </div>
              
              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-clinic-50 dark:bg-gray-700 p-2 rounded-lg text-center hover-card">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Heart Rate</div>
                  <div className="font-bold text-clinic-900 dark:text-white group">
                    <span className="group-hover:text-primary transition-colors">72</span> bpm
                  </div>
                </div>
                <div className="bg-clinic-50 dark:bg-gray-700 p-2 rounded-lg text-center hover-card">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Blood Press.</div>
                  <div className="font-bold text-clinic-900 dark:text-white group">
                    <span className="group-hover:text-primary transition-colors">120</span>/80
                  </div>
                </div>
                <div className="bg-clinic-50 dark:bg-gray-700 p-2 rounded-lg text-center hover-card">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
                  <div className="font-bold text-clinic-900 dark:text-white group">
                    <span className="group-hover:text-primary transition-colors">98.6</span>°F
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <Link to="/onboarding" className="bg-clinic-500 text-white p-3 rounded-lg text-center text-sm font-medium flex items-center justify-center cursor-pointer button-3d hover:bg-clinic-700 transition-colors">
                <Stethoscope className="h-4 w-4 mr-1" />
                View Your Health Portal
              </Link>
              
              {/* Animated pulse indicator */}
              <div className="absolute top-3 right-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/50 dark:bg-accent/30 rounded-lg rotate-12 opacity-30 animate-float"></div>
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary/40 dark:bg-primary/20 rounded-full opacity-20 animate-pulse-soft"></div>
          </div>

          {/* Floating pill decorations */}
          <div className="absolute -bottom-5 -left-5 w-16 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg transform rotate-45 border border-gray-200 dark:border-gray-700 animate-float z-20"></div>
          <div className="absolute -top-8 right-10 w-12 h-6 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg transform -rotate-12 animate-float z-20" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-20 -right-6 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 animate-float z-20" style={{ animationDelay: "1.5s" }}></div>
        </div>
      </div>
      
      {/* Floating medical symbols with enhanced animations */}
      <div className="absolute bottom-10 left-10 w-32 h-32 opacity-20 animate-spin-slow rounded-full border border-primary dark:border-primary/40 z-10"></div>
      <div className="absolute top-20 right-20 w-24 h-24 opacity-10 animate-spin-slow rounded-full border-2 border-accent dark:border-accent/40 z-10" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
    </section>
  );
};

export default HeroSection;

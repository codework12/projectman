import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Emma Thompson",
      role: "Patient",
      avatar: "",
      content: "OurTopClinic has transformed how I manage my healthcare. The video consultations are so convenient, and I love being able to order my prescriptions directly through the app.",
      rating: 5
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      role: "Cardiologist",
      avatar: "",
      content: "As a healthcare provider, this platform has streamlined my practice. The appointment management system is intuitive, and the secure video calls provide excellent quality for proper diagnoses.",
      rating: 5
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Patient",
      content: "I was skeptical about virtual healthcare, but OurTopClinic changed my mind. The interface is user-friendly, and I've received exceptional care from specialists I couldn't access locally.",
      avatar: "",
      rating: 4
    },
    {
      id: 4,
      name: "Dr. Sarah Ahmed",
      role: "Pediatrician",
      avatar: "",
      content: "This platform allows me to connect with my young patients in a way that makes them comfortable. The integrated lab test ordering has made follow-ups much more efficient.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal');
            elements.forEach(el => {
              el.classList.add('active');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="testimonials" className="section-padding" ref={testimonialsRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center reveal scroll-animation-1">
          What Our Users <span className="gradient-text">Are Saying</span>
        </h2>
        <p className="section-description text-center reveal scroll-animation-2">
          Join thousands of satisfied patients and healthcare providers who've transformed their healthcare experience with OurTopClinic.
        </p>

        <div className="relative max-w-4xl mx-auto reveal scroll-animation-3">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4">
                          {testimonial.avatar ? (
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          ) : (
                            <Image
                              src={`https://randomuser.me/api/portraits/${testimonial.id % 2 === 0 ? 'men' : 'women'}/${testimonial.id + 10}.jpg`}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                          )}
                          <AvatarFallback className="bg-clinic-100 text-clinic-700">
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{testimonial.role}</div>
                        </div>
                        <div className="ml-auto flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-md rounded-full h-10 w-10 md:h-12 md:w-12"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-md rounded-full h-10 w-10 md:h-12 md:w-12"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === activeIndex ? 'bg-clinic-500' : 'bg-gray-300'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

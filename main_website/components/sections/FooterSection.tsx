import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight, Check, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const FooterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    
    // Simulate subscription API call
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to our newsletter!",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <footer id="contact" className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-fade-in">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center mr-2">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold gradient-text">OurTopClinic</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Empowering healthcare through technology - connecting patients and providers seamlessly.</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors bg-white dark:bg-gray-800 p-2 rounded-full hover:shadow-md">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors bg-white dark:bg-gray-800 p-2 rounded-full hover:shadow-md">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors bg-white dark:bg-gray-800 p-2 rounded-full hover:shadow-md">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-primary transition-colors bg-white dark:bg-gray-800 p-2 rounded-full hover:shadow-md">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-semibold mb-4 dark:text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center">Home</a></li>
              <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Features</a></li>
              <li><a href="#testimonials" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-semibold mb-4 dark:text-white relative inline-block">
              Support
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="font-semibold mb-4 dark:text-white relative inline-block">
              Subscribe to Our Newsletter
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary"></span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Get the latest health tips and updates</p>
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex items-center p-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-primary">
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" 
                  className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 dark:text-white"
                />
                <Button type="submit" disabled={isSubscribing} className="gradient-bg ml-1">
                  {isSubscribing ? (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <Check className="h-3 w-3 text-green-500 mr-1" /> 
                We respect your privacy and never share your data
              </p>
            </form>
          </div>
        </div>

        <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} OurTopClinic. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="hover:text-primary dark:hover:text-primary-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary dark:hover:text-primary-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-primary dark:hover:text-primary-foreground transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

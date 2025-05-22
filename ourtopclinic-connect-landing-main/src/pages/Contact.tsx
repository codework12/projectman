
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import ScrollToTop from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, Clock, Send, ChevronRight, CheckCircle } from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  
  useEffect(() => {
    document.title = 'Contact Us - OurTopClinic';
  }, []);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('submitted');
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
    }, 1500);
  };

  // Contact information
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: 'text-blue-500'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@ourtopClinic.com', 'support@ourtopClinic.com'],
      color: 'text-amber-500'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Healthcare Avenue', 'Medical District, NY 10001'],
      color: 'text-rose-500'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Monday-Friday: 8am-8pm', 'Saturday-Sunday: 10am-4pm'],
      color: 'text-emerald-500'
    }
  ];

  // FAQ questions
  const faqs = [
    {
      question: 'How quickly can I expect a response?',
      answer: 'We typically respond to all inquiries within 24-48 business hours. For urgent matters, please call our main line directly.'
    },
    {
      question: 'What partnership opportunities do you offer?',
      answer: 'We offer various partnership models including facility sharing, provider networks, corporate wellness programs, and community health initiatives.'
    },
    {
      question: 'Do you offer telehealth solutions?',
      answer: 'Yes, we provide comprehensive telehealth platforms that can be integrated with existing systems or deployed as standalone solutions.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our services or partnership opportunities? 
            We're here to help. Reach out to our team for assistance.
          </p>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-6">
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {formStatus === 'submitted' ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-center text-muted-foreground mb-6">
                      Thank you for reaching out. Our team will get back to you shortly.
                    </p>
                    <Button onClick={() => setFormStatus('idle')}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input 
                          id="name"
                          placeholder="John Doe"
                          required
                          className="bg-muted/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="johndoe@example.com"
                          required
                          className="bg-muted/40"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="bg-muted/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Inquiry Type</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/40">
                          <SelectValue placeholder="Select an inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                          <SelectItem value="services">Services Information</SelectItem>
                          <SelectItem value="careers">Career Opportunities</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea 
                        id="message"
                        placeholder="Please provide details about your inquiry..."
                        rows={5}
                        required
                        className="bg-muted/40 resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? (
                        <>Sending Message...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="bg-white dark:bg-gray-800 shadow-md border-none hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                      <CardContent className="p-6">
                        <div className={`h-10 w-10 rounded-full ${item.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                          <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        <div className="space-y-1">
                          {item.details.map((detail, i) => (
                            <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* FAQ Section */}
              <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-muted/30">
                        <h4 className="font-medium mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden h-64 md:h-96">
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive map would be embedded here</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10 mt-12">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter to receive the latest updates about our services and healthcare insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input placeholder="Enter your email" type="email" className="bg-white dark:bg-gray-800" />
            <Button className="whitespace-nowrap">
              Subscribe
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      <FooterSection />
      <ScrollToTop />
    </div>
  );
};

export default Contact;

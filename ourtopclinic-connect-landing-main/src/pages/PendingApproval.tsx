
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Clock, CheckCircle, Mail, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mr-3">
            <HeartPulse className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">OurTopClinic</h1>
        </div>
        
        <Card className="border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
                className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center"
              >
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you for registering with OurTopClinic. Your application is currently being reviewed by our administrators.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2 space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <h3 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                What happens next?
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium">1</span>
                  </div>
                  <span>Our team will verify your credentials and professional information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <span>You'll receive an email notification once your application is approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium">3</span>
                  </div>
                  <span>You can then log in and start using OurTopClinic's provider features</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Need assistance?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@ourtop.clinic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+1 (800) 123-4567</span>
                </div>
              </div>
            </div>
            
            {/* Estimated time indicator */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Estimated review time: <span className="font-medium">24-48 hours</span></p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Return to Homepage
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PendingApproval;

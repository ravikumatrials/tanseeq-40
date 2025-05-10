
import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/20">
      {/* Logo Animation */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-10"
      >
        <img 
          src="/lovable-uploads/801b965c-36e1-485f-8e8e-fa408775a70f.png" 
          alt="Tanseeq Investment" 
          className="h-16 md:h-20 drop-shadow-md"
        />
      </motion.div>

      {/* Form with Animation */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="glassmorphism mobile-card p-7 shadow-enterprise">
          <ForgotPasswordForm />
        </div>
        
        <div className="mt-6 flex flex-col items-center gap-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            Enterprise Attendance Solution
          </motion.div>
          
          {/* Theme toggle added below the form card */}
          <ThemeToggle className="mt-2" />
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

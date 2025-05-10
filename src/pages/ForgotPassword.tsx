
import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <img 
          src="/lovable-uploads/801b965c-36e1-485f-8e8e-fa408775a70f.png" 
          alt="Tanseeq Investment" 
          className="h-16"
        />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="mobile-card backdrop-blur-sm p-7 shadow-enterprise">
          <ForgotPasswordForm />
        </div>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Enterprise Attendance Solution
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

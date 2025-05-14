
import React from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import FaceRecognition from '@/components/check-in/FaceRecognition';
import { motion } from 'framer-motion';

const CheckIn = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <TopNavbar />
      
      <motion.div 
        className="flex-1 container max-w-4xl mx-auto p-4 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="glassmorphism mobile-card p-6">
          <FaceRecognition isCheckIn={true} />
        </div>
      </motion.div>
      
      <BottomNavbar />
    </div>
  );
};

export default CheckIn;

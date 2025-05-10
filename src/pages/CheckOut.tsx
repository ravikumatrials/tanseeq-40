
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import FaceRecognition from '@/components/check-in/FaceRecognition';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CheckOut = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <motion.div 
        className="mobile-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="ghost" 
          className="p-2 rounded-full"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5 animated-icon" />
        </Button>
        <h1 className="text-xl font-bold ml-2">Check Out</h1>
      </motion.div>
      
      <motion.div 
        className="flex-1 container max-w-4xl mx-auto p-4 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="glassmorphism mobile-card p-6">
          <FaceRecognition isCheckIn={false} />
        </div>
      </motion.div>
      
      <BottomNavbar />
    </div>
  );
};

export default CheckOut;

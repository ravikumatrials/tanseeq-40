
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import FaceRecognition from '@/components/check-in/FaceRecognition';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const CheckOut = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header - only visible when not scanning */}
      <motion.div 
        className="p-3 md:p-4 flex items-center justify-between bg-tanseeq text-white shadow-md"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="p-1.5 md:p-2 text-white mr-1 md:mr-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'}`} />
          </Button>
          
          <div className="text-white font-medium text-sm md:text-lg">
            Check Out
          </div>
        </div>
        
        <div className="w-8 md:w-10"></div> {/* Spacer for balancing */}
      </motion.div>
      
      {/* Full-height container for FaceRecognition */}
      <div className="flex-1 flex flex-col relative">
        <FaceRecognition isCheckIn={false} />
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default CheckOut;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Employees = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <motion.div 
        className="mobile-header justify-between"
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
        <h1 className="text-xl font-bold">Employees</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </motion.div>
      
      <div className="flex-1 container max-w-4xl mx-auto p-4 pb-24">
        {/* Employee content here */}
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Employees;

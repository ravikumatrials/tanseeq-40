
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import FaceRecognition from '@/components/check-in/FaceRecognition';
import { Button } from '@/components/ui/button';

const CheckOut = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          className="p-2"
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
        </Button>
      </div>
      
      <div className="flex-1 container max-w-4xl mx-auto p-4 pb-20">
        <FaceRecognition isCheckIn={false} />
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default CheckOut;

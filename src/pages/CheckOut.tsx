
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import FaceRecognition from '@/components/check-in/FaceRecognition';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CheckOut = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          className="p-2"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5 animated-icon" />
        </Button>
        <h1 className="text-xl font-bold ml-2">Check Out</h1>
      </div>
      
      <div className="flex-1 container max-w-4xl mx-auto p-4 pb-20">
        <FaceRecognition isCheckIn={false} />
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default CheckOut;

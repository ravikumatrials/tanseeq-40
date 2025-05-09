
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import HistoryPage from '@/components/history/HistoryPage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="p-2"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5 animated-icon" />
        </Button>
        <h1 className="text-xl font-bold">History</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
      
      <div className="flex-1 container max-w-4xl mx-auto p-4 pb-20">
        <HistoryPage />
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default History;

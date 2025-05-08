
import React from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import ExceptionList from '@/components/exceptions/ExceptionList';

const Exceptions = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar />
      
      <div className="flex-1 container max-w-4xl mx-auto p-4 pb-20">
        <ExceptionList />
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Exceptions;

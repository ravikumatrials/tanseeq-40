
import React from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import DashboardCards from '@/components/dashboard/DashboardCards';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNavbar />
      
      <motion.div 
        className="flex-1 container max-w-4xl mx-auto p-4 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-tanseeq flex items-center">
            <LayoutDashboard className="mr-2 h-6 w-6 text-teal-500" />
            Dashboard
          </h1>
          <div className="text-xs font-medium text-tanseeq bg-white border border-gray-200 px-4 py-2 rounded-md flex items-center shadow-sm">
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </motion.div>
        
        <DashboardCards />
      </motion.div>
      
      <BottomNavbar />
    </div>
  );
};

export default Dashboard;

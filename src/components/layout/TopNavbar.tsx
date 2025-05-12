
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const TopNavbar: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/801b965c-36e1-485f-8e8e-fa408775a70f.png" 
          alt="Tanseeq Investment"
          className="h-8"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="rounded-full bg-tanseeq/10 text-tanseeq">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default TopNavbar;

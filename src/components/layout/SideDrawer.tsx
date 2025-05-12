
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Users, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center px-4 py-3 rounded-lg transition-colors
        ${isActive ? 'bg-tanseeq/10 text-tanseeq' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      <div className="mr-3 text-tanseeq">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  // Animation variants
  const drawerVariants = {
    closed: {
      x: "-100%",
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      x: "0%",
      boxShadow: "10px 0px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };
  
  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={onClose}
          />
          
          <motion.div
            className="fixed top-0 left-0 h-full w-[270px] bg-white z-50 overflow-auto"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
          >
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/801b965c-36e1-485f-8e8e-fa408775a70f.png" 
                  alt="Tanseeq Investment" 
                  className="h-8 mr-2" 
                />
                <h1 className="font-bold text-lg text-tanseeq">Tanseeq</h1>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {user && (
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="bg-tanseeq/10 text-tanseeq font-medium h-10 w-10 rounded-full flex items-center justify-center mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-3 space-y-1">
              <MenuItem 
                to="/employees" 
                icon={<Users className="h-5 w-5" />} 
                label="Employees" 
                onClick={onClose}
              />
              <MenuItem 
                to="/history" 
                icon={<History className="h-5 w-5" />} 
                label="History" 
                onClick={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;

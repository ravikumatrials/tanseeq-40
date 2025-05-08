
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogIn, LogOut, AlertTriangle, History } from 'lucide-react';

interface NavItemProps {
  to: string;
  label: string;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink 
      to={to} 
      className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
    >
      <div className="text-xl mb-1">
        {children}
      </div>
      <motion.span 
        className="text-xs"
        initial={{ scale: 0.8 }}
        animate={{ scale: isActive ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      {isActive && (
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-tanseeq" 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
    </NavLink>
  );
};

const BottomNavbar = () => {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 border-t bg-card p-2 flex justify-around items-center shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <NavItem to="/dashboard" label="Dashboard">
        <LayoutDashboard className="h-6 w-6" />
      </NavItem>
      
      <NavItem to="/check-in" label="Check In">
        <LogIn className="h-6 w-6" />
      </NavItem>
      
      <NavItem to="/check-out" label="Check Out">
        <LogOut className="h-6 w-6" />
      </NavItem>
      
      <NavItem to="/exceptions" label="Exceptions">
        <AlertTriangle className="h-6 w-6" />
      </NavItem>
      
      <NavItem to="/history" label="History">
        <History className="h-6 w-6" />
      </NavItem>
    </motion.div>
  );
};

export default BottomNavbar;

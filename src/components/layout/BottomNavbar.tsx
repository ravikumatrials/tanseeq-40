
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, LogIn, History, AlertTriangle } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';

interface NavItemProps {
  to: string;
  label: string;
  children?: React.ReactNode;
  showNotification?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  label,
  children,
  showNotification = false
}) => {
  const location = useLocation();
  // Check if current path is the route or starts with it (for nested routes)
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <NavLink to={to} className="flex flex-col items-center justify-center min-w-[64px]">
      <motion.div 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.95 }}
        className={`text-lg mb-1 p-2 relative ${isActive ? 'text-tanseeq-gold' : 'text-white/80'}`}
      >
        {children}
        {showNotification && (
          <span className="absolute -top-0.5 -right-0.5">
            <span className="flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </span>
        )}
        {isActive && (
          <motion.div 
            layoutId="bottomNavIndicator"
            className="absolute inset-0 bg-white/10 rounded-md -z-10"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
      </motion.div>
      <span className={`text-[10px] font-medium ${isActive ? 'text-tanseeq-gold' : 'text-white/80'}`}>
        {label}
      </span>
    </NavLink>
  );
};

const BottomNavbar = () => {
  const { exceptions } = useAttendance();
  const [hasExceptions, setHasExceptions] = useState(false);
  const navigate = useNavigate();
  
  // Check for exceptions
  useEffect(() => {
    if (exceptions && exceptions.length > 0) {
      setHasExceptions(true);
    } else {
      setHasExceptions(false);
    }
  }, [exceptions]);

  // Handle FAB click
  const handleFabClick = () => {
    navigate('/check-in');
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 bg-tanseeq border-t border-tanseeq-gold/20 py-1 z-40 flex justify-around items-center h-[64px] px-2"
    >
      <NavItem to="/dashboard" label="Dashboard">
        <LayoutDashboard className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/employees" label="Employees">
        <Users className="h-5 w-5" />
      </NavItem>
      
      {/* Center FAB Button */}
      <div className="relative flex flex-col items-center">
        <motion.button
          onClick={handleFabClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -top-8 flex items-center justify-center w-14 h-14 rounded-full bg-tanseeq text-white shadow-lg"
        >
          <LogIn className="h-6 w-6" />
        </motion.button>
        <div className="h-5"></div>
        <span className="text-[10px] font-medium text-white/80 mt-6">Check In</span>
      </div>
      
      <NavItem to="/history" label="History">
        <History className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/exceptions" label="Exceptions" showNotification={hasExceptions}>
        <AlertTriangle className="h-5 w-5" />
      </NavItem>
    </motion.div>
  );
};

export default BottomNavbar;

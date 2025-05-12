
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogIn, LogOut, AlertTriangle, Clock, Users } from 'lucide-react';
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
    <NavLink to={to} className="flex flex-col items-center justify-center">
      <motion.div 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.95 }}
        className={`text-lg mb-0.5 p-1.5 relative ${isActive ? 'text-tanseeq-gold' : 'text-white/80'}`}
      >
        {children}
        {showNotification && (
          <span className="absolute -top-0.5 -right-0.5">
            <span className="flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
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
  const location = useLocation();
  
  // List of main routes where bottom nav should be visible
  const mainRoutes = ['/dashboard', '/check-in', '/check-out', '/exceptions', '/history', '/employees'];
  const isMainRoute = mainRoutes.includes(location.pathname);
  
  // Check for exceptions
  useEffect(() => {
    if (exceptions && exceptions.length > 0) {
      setHasExceptions(true);
    } else {
      setHasExceptions(false);
    }
  }, [exceptions]);

  return (
    <AnimatePresence>
      {isMainRoute && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 bg-tanseeq border-t border-tanseeq-gold/20 py-1.5 z-40 flex justify-between items-center h-[60px] px-2"
        >
          <NavItem to="/dashboard" label="Dashboard">
            <LayoutDashboard className="h-4.5 w-4.5" />
          </NavItem>
          
          <NavItem to="/check-in" label="Check In">
            <LogIn className="h-4.5 w-4.5" />
          </NavItem>
          
          <NavItem to="/check-out" label="Check Out">
            <LogOut className="h-4.5 w-4.5" />
          </NavItem>
          
          <NavItem to="/exceptions" label="Exceptions" showNotification={hasExceptions}>
            <AlertTriangle className="h-4.5 w-4.5" />
          </NavItem>
          
          <NavItem to="/history" label="History">
            <Clock className="h-4.5 w-4.5" />
          </NavItem>
          
          <NavItem to="/employees" label="Employees">
            <Users className="h-4.5 w-4.5" />
          </NavItem>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomNavbar;

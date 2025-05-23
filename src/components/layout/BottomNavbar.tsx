
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogIn, LogOut, AlertTriangle, History, Users } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { useProject } from '@/context/ProjectContext';

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
    <NavLink to={to} className="flex flex-col items-center justify-center min-w-[60px]">
      <motion.div 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.95 }}
        className="text-lg mb-1 p-2 relative"
      >
        {children}
        {showNotification && (
          <span className="absolute -top-1 -right-1">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </span>
        )}
      </motion.div>
      <span className={`text-[10px] font-medium ${isActive ? 'text-tanseeq' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </NavLink>
  );
};

const BottomNavbar = () => {
  const { exceptions } = useAttendance();
  const { currentProject } = useProject();
  const [hasExceptions, setHasExceptions] = useState(false);
  const [needsFaceEnrollment, setNeedsFaceEnrollment] = useState(false);
  
  // Check for exceptions
  useEffect(() => {
    if (exceptions && exceptions.length > 0) {
      setHasExceptions(true);
    } else {
      setHasExceptions(false);
    }
  }, [exceptions]);
  
  // Check if any employees need face enrollment
  useEffect(() => {
    if (currentProject && currentProject.employees) {
      const unenrolledEmployees = currentProject.employees.filter(emp => !emp.isFaceEnrolled);
      setNeedsFaceEnrollment(unenrolledEmployees.length > 0);
    }
  }, [currentProject]);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm flex justify-around items-center shadow-lg z-40 h-[55px]"
    >
      <NavItem to="/dashboard" label="Dashboard">
        <LayoutDashboard className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/check-in" label="Check In">
        <LogIn className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/check-out" label="Check Out">
        <LogOut className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/exceptions" label="Exceptions" showNotification={hasExceptions}>
        <AlertTriangle className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/employees" label="Employees" showNotification={needsFaceEnrollment}>
        <Users className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/history" label="History">
        <History className="h-5 w-5" />
      </NavItem>
    </motion.div>
  );
};

export default BottomNavbar;

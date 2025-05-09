import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogIn, LogOut, AlertTriangle, History } from 'lucide-react';
interface NavItemProps {
  to: string;
  label: string;
  children?: React.ReactNode;
}
const NavItem: React.FC<NavItemProps> = ({
  to,
  label,
  children
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return <NavLink to={to} className="flex flex-col items-center justify-center min-w-[60px]">
      <motion.div whileHover={{
      scale: 1.1
    }} whileTap={{
      scale: 0.95
    }} className="text-lg mb-1 p-2">
        {children}
      </motion.div>
      <span className={`text-[10px] font-medium ${isActive ? 'text-tanseeq' : 'text-muted-foreground'}`}>
        {label}
      </span>
      {isActive}
    </NavLink>;
};
const BottomNavbar = () => {
  return <motion.div initial={{
    y: 100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.5,
    ease: "easeOut"
  }} className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm flex justify-around items-center shadow-lg z-40 h-[55px]">
      <NavItem to="/dashboard" label="Dashboard">
        <LayoutDashboard className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/check-in" label="Check In">
        <LogIn className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/check-out" label="Check Out">
        <LogOut className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/exceptions" label="Exceptions">
        <AlertTriangle className="h-5 w-5" />
      </NavItem>
      
      <NavItem to="/history" label="History">
        <History className="h-5 w-5" />
      </NavItem>
    </motion.div>;
};
export default BottomNavbar;
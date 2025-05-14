import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Clock, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
const TopNavbar = () => {
  const {
    logout,
    user
  } = useAuth();
  const {
    theme
  } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const handleBackNavigation = () => {
    navigate('/dashboard');
  };
  return <motion.div className="p-4 flex items-center justify-between bg-tanseeq text-white shadow-md relative" initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.5,
    ease: "easeOut"
  }}>
      {/* Logo section */}
      <motion.div className="flex-1 flex items-center">
        {window.location.pathname !== '/dashboard' && <motion.button className="mr-2 p-1.5 hover:bg-white/20 rounded-full" onClick={handleBackNavigation} whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }}>
            <ArrowLeft className="h-6 w-6" /> {/* Increased size */}
          </motion.button>}
        
        <motion.div className="flex items-center ml-2 cursor-pointer" whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} onClick={() => navigate('/dashboard')}>
          
        </motion.div>
      </motion.div>
      
      {/* Center greeting with user's name */}
      <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.2,
      duration: 0.4
    }} className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium text-base">
        {user && `Hi ${user.name.split(' ')[0]}`}
      </motion.div>
      
      {/* Right side elements */}
      
    </motion.div>;
};
export default TopNavbar;
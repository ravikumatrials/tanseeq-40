
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { useTheme } from '@/context/ThemeContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, Settings, LogOut, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const TopNavbar = () => {
  const { logout, user } = useAuth();
  const { projects, currentProject, setCurrentProject } = useProject();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      setCurrentProject(selectedProject);
    }
  };

  return (
    <motion.div 
      className="mobile-header justify-between bg-gradient-to-r from-tanseeq to-tanseeq-gold/80"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="flex items-center cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/dashboard')}
      >
        <img 
          src="/lovable-uploads/801b965c-36e1-485f-8e8e-fa408775a70f.png" 
          alt="Tanseeq Investment" 
          className="h-9 mr-3 drop-shadow-md" 
        />
      </motion.div>
      
      {currentProject && (
        <div className="flex-1 max-w-xs mx-2 relative">
          <Select
            value={currentProject.id}
            onValueChange={handleProjectChange}
            onOpenChange={setShowProjects}
          >
            <SelectTrigger className="w-full rounded-full border-white/20 focus:border-white bg-white/20 backdrop-blur-sm shadow-soft text-sm text-white">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-tanseeq/30 rounded-lg shadow-enterprise">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <SelectItem 
                      value={project.id} 
                      className="hover:bg-tanseeq/10 cursor-pointer rounded-md my-0.5"
                    >
                      {project.name}
                    </SelectItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <motion.div 
          className="hidden sm:flex items-center text-sm text-white px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Clock className="h-4 w-4 mr-1.5 text-white" />
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </motion.div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              className="mobile-avatar bg-white/20 text-white p-2 flex items-center justify-center h-9 w-9 shadow-soft hover:bg-white/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {user?.name.charAt(0)}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-md border-tanseeq/30 shadow-enterprise rounded-xl w-56 mt-1">
            <div className="px-3.5 py-2.5 text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-tanseeq" />
              {user?.name}
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <div className="px-3.5 py-2">
              <div className="text-xs text-muted-foreground mb-1.5">Theme</div>
              <ThemeToggle className="w-full justify-between" />
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={() => navigate('/profile')}
              className="cursor-pointer hover:bg-tanseeq/10 gap-2 rounded-md mx-1 px-3 py-2"
            >
              <Settings className="h-4 w-4 text-tanseeq" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate('/employees')}
              className="cursor-pointer hover:bg-tanseeq/10 gap-2 rounded-md mx-1 px-3 py-2"
            >
              <Users className="h-4 w-4 text-tanseeq" />
              Employees
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={logout}
              className="cursor-pointer hover:bg-rose-500/10 text-rose-500 gap-2 rounded-md mx-1 px-3 py-2 mb-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default TopNavbar;

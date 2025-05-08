
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Clock } from 'lucide-react';

const TopNavbar = () => {
  const { logout, user } = useAuth();
  const { projects, currentProject, setCurrentProject } = useProject();
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
      className="flex items-center justify-between bg-card p-4 shadow-sm border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src="/lovable-uploads/801b965c-36e1-485f-8e8e-fa408775a70f.png" 
          alt="Tanseeq Investment" 
          className="h-10 mr-4" 
        />
      </motion.div>
      
      {currentProject && (
        <div className="flex-1 max-w-xs mx-4 relative">
          <Select
            value={currentProject.id}
            onValueChange={handleProjectChange}
            onOpenChange={setShowProjects}
          >
            <SelectTrigger className="w-full border-tanseeq/30 focus:border-tanseeq">
              <div className="flex items-center">
                <SelectValue placeholder="Select Project" />
                <motion.div
                  animate={{ rotate: showProjects ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-1"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border-tanseeq/30 shadow-lg">
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
                      className="hover:bg-tanseeq/10 cursor-pointer"
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
          className="hidden sm:flex items-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Clock className="h-4 w-4 mr-1 text-tanseeq" />
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </motion.div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              className="rounded-full bg-tanseeq/10 text-tanseeq p-2 flex items-center justify-center h-10 w-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {user?.name.charAt(0)}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-tanseeq/30 shadow-lg">
            <div className="px-2 py-1.5 text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-tanseeq" />
              {user?.name}
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={() => navigate('/profile')}
              className="cursor-pointer hover:bg-tanseeq/10"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={logout}
              className="cursor-pointer hover:bg-destructive/10 text-destructive"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default TopNavbar;

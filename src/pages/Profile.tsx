
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Settings, LogOut, Users } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projects, currentProject, setCurrentProject } = useProject();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      setCurrentProject(selectedProject);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="mobile-header justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full"
        >
          <ArrowLeft className="h-5 w-5 animated-icon" />
        </Button>
        <h1 className="text-xl font-bold">Profile</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
      
      <div className="flex-1 container max-w-4xl mx-auto p-4 pb-6">
        <motion.div 
          className="flex flex-col items-center justify-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 shadow-enterprise"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-4xl font-semibold">{user?.name.charAt(0)}</span>
          </motion.div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </motion.div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="glassmorphism mobile-card overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  Project Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-1">Select Project</div>
                  <Select
                    value={currentProject?.id}
                    onValueChange={handleProjectChange}
                  >
                    <SelectTrigger className="w-full rounded-lg border-input/80 focus:border-primary shadow-inner">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-primary/30 shadow-enterprise rounded-lg">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id} className="hover:bg-primary/10 rounded-md my-0.5">
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="glassmorphism mobile-card overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  App Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-primary/10 hover:border-primary/30 shadow-soft rounded-lg py-2.5"
                    onClick={() => navigate('/change-password')}
                  >
                    Change Password
                  </Button>
                </div>
                
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-primary/10 hover:border-primary/30 flex items-center gap-2 justify-center shadow-soft rounded-lg py-2.5"
                    onClick={() => navigate('/employees')}
                  >
                    <Users className="h-4 w-4 text-primary" />
                    Manage Employees
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full rounded-lg py-2.5" 
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

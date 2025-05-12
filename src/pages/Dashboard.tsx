
import React from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import DashboardCards from '@/components/dashboard/DashboardCards';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const Dashboard = () => {
  const { projects, currentProject, setCurrentProject } = useProject();

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      setCurrentProject(selectedProject);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNavbar />
      
      <motion.div 
        className="flex-1 container max-w-4xl mx-auto p-3 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-tanseeq flex items-center">
            <LayoutDashboard className="mr-2 h-6 w-6 text-teal-500" />
            Dashboard
          </h1>
          
          {currentProject && (
            <div className="mt-3 mb-2 relative w-full max-w-md">
              <Select
                value={currentProject.id}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger className="w-full h-12 bg-white text-base border-gray-200 shadow-sm">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="bg-white border-tanseeq/30 rounded-lg">
                  {projects.map((project) => (
                    <SelectItem 
                      key={project.id}
                      value={project.id} 
                      className="hover:bg-tanseeq/10 cursor-pointer rounded-md my-0.5"
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="text-xs font-medium text-tanseeq bg-white border border-gray-200 px-3 py-2 mt-2 rounded-md flex items-center self-start shadow-sm">
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </motion.div>
        
        <DashboardCards />
      </motion.div>
      
      <BottomNavbar />
    </div>
  );
};

export default Dashboard;

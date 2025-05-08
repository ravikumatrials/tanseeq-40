
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

const TopNavbar = () => {
  const { logout, user } = useAuth();
  const { projects, currentProject, setCurrentProject } = useProject();
  const navigate = useNavigate();
  
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      setCurrentProject(selectedProject);
    }
  };

  return (
    <div className="flex items-center justify-between bg-card p-4 shadow-sm border-b">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/801b965c-36e1-485f-8e8e-fa408775a70f.png" 
          alt="Tanseeq Investment" 
          className="h-10 mr-4" 
        />
      </div>
      
      {currentProject && (
        <div className="flex-1 max-w-xs mx-4">
          <Select
            value={currentProject.id}
            onValueChange={handleProjectChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full bg-muted p-2 flex items-center justify-center h-10 w-10">
              {user?.name.charAt(0)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavbar;

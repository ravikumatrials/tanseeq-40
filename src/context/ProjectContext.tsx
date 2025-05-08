
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, dummyProjects } from '../data/dummyData';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Filter projects based on user's projectIds
      const userProjects = dummyProjects.filter(project => 
        user.projectIds.includes(project.id)
      );
      
      setProjects(userProjects);
      
      // Set current project (if not already set or if current doesn't exist in new projects)
      const savedProjectId = localStorage.getItem('currentProjectId');
      
      if (savedProjectId) {
        const savedProject = userProjects.find(p => p.id === savedProjectId);
        if (savedProject) {
          setCurrentProject(savedProject);
        } else if (userProjects.length > 0) {
          setCurrentProject(userProjects[0]);
        }
      } else if (userProjects.length > 0) {
        setCurrentProject(userProjects[0]);
      }
      
      setIsLoading(false);
    }
  }, [user]);

  const handleSetCurrentProject = (project: Project) => {
    setCurrentProject(project);
    localStorage.setItem('currentProjectId', project.id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject: handleSetCurrentProject,
        isLoading
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

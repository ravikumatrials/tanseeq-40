
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center justify-between border-b">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
        </Button>
        <h1 className="text-xl font-bold">Profile</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
      
      <div className="flex-1 container max-w-4xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-semibold">{user?.name.charAt(0)}</span>
          </div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Project Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-1">Select Project</div>
                <Select
                  value={currentProject?.id}
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">App Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Theme</span>
                <ThemeToggle />
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/change-password')}
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            className="w-full" 
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

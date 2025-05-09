
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProject } from '@/context/ProjectContext';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Camera, Plus, Home, LayoutDashboard } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';

// Sample profile pictures for employees
const profilePictures = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd',
];

interface EmployeeCardProps {
  id: string;
  name: string;
  isFaceEnrolled: boolean;
  profilePic: string;
  onEnroll: () => void;
  onUpdate: () => void;
  onView: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  id, name, isFaceEnrolled, profilePic, onEnroll, onUpdate, onView 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <Card className="p-4 flex items-center gap-4 border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5">
        <div className="relative">
          <div className="h-14 w-14 rounded-full overflow-hidden bg-tanseeq/20 flex-shrink-0">
            <img 
              src={profilePic} 
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          {!isFaceEnrolled && (
            <span className="absolute -top-1 -right-1">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-muted-foreground truncate">ID: {id}</p>
          <div className="flex gap-2 mt-2">
            {isFaceEnrolled ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 text-xs bg-transparent border-tanseeq text-tanseeq hover:bg-tanseeq/10"
                onClick={onUpdate}
              >
                <Camera className="h-3.5 w-3.5 mr-1" />
                Retake
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="h-7 text-xs bg-tanseeq hover:bg-tanseeq/90 relative"
                onClick={onEnroll}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Enroll Face
              </Button>
            )}
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-7 text-xs"
              onClick={onView}
            >
              View
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Employees = () => {
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState(currentProject?.employees || []);
  const [showCamera, setShowCamera] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
  
  useEffect(() => {
    if (currentProject) {
      setIsLoading(true);
      // Simulate loading data
      setTimeout(() => {
        setEmployees(currentProject.employees);
        setIsLoading(false);
      }, 500);
    }
  }, [currentProject]);
  
  const handleEnrollFace = (employeeId: string, name: string) => {
    setCurrentEmployeeId(employeeId);
    setShowCamera(true);
    // Simulate camera access and face enrollment
    setTimeout(() => {
      // Update local state to show enrollment
      const updatedEmployees = employees.map(emp => 
        emp.id === employeeId ? {...emp, isFaceEnrolled: true} : emp
      );
      setEmployees(updatedEmployees);
      
      // Close camera
      setShowCamera(false);
      setCurrentEmployeeId(null);
      
      toast({
        title: "Face Enrolled Successfully",
        description: `${name}'s face has been enrolled.`,
      });
    }, 2000);
  };
  
  const handleRetakeFace = (employeeId: string, name: string) => {
    setCurrentEmployeeId(employeeId);
    setShowCamera(true);
    // Simulate camera access and face update
    setTimeout(() => {
      setShowCamera(false);
      setCurrentEmployeeId(null);
      
      toast({
        title: "Face Updated Successfully",
        description: `${name}'s face profile has been updated.`,
      });
    }, 2000);
  };
  
  const handleViewEmployee = (employeeId: string) => {
    // Navigate to employee detail page
    navigate(`/employee/${employeeId}`);
  };
  
  // Get random profile pic
  const getProfilePic = (index: number) => {
    return `${profilePictures[index % profilePictures.length]}?${index}`;
  };

  if (!currentProject) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <p>No project selected</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center justify-between border-b">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5 animated-icon" />
        </Button>
        <h1 className="text-xl font-bold">Employee Management</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
      
      {showCamera && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-4 text-center">
              {currentEmployeeId ? 
                (employees.find(e => e.id === currentEmployeeId)?.isFaceEnrolled ? 
                  "Retaking Face" : "Enrolling Face") : 
                "Camera Access"}
            </h3>
            <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400" />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowCamera(false);
                  setCurrentEmployeeId(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-tanseeq hover:bg-tanseeq/90"
                onClick={() => {
                  setShowCamera(false);
                  
                  if (currentEmployeeId) {
                    const employee = employees.find(e => e.id === currentEmployeeId);
                    if (employee) {
                      if (!employee.isFaceEnrolled) {
                        // Update local state to show enrollment
                        const updatedEmployees = employees.map(emp => 
                          emp.id === currentEmployeeId ? {...emp, isFaceEnrolled: true} : emp
                        );
                        setEmployees(updatedEmployees);
                        
                        toast({
                          title: "Face Enrolled Successfully",
                          description: `${employee.name}'s face has been enrolled.`,
                        });
                      } else {
                        toast({
                          title: "Face Updated Successfully",
                          description: `${employee.name}'s face profile has been updated.`,
                        });
                      }
                    }
                  }
                  
                  setCurrentEmployeeId(null);
                }}
              >
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 container max-w-md mx-auto p-4 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="green-loader"></div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {employees.map((employee, index) => (
                <EmployeeCard
                  key={employee.id}
                  id={employee.id}
                  name={employee.name}
                  isFaceEnrolled={employee.isFaceEnrolled}
                  profilePic={getProfilePic(index)}
                  onEnroll={() => handleEnrollFace(employee.id, employee.name)}
                  onUpdate={() => handleRetakeFace(employee.id, employee.name)}
                  onView={() => handleViewEmployee(employee.id)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
        
        {/* Dashboard Button */}
        <div className="mt-8 mb-16 flex justify-center">
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="rounded-full px-6 py-2 bg-tanseeq hover:bg-tanseeq/90 text-white flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Employees;

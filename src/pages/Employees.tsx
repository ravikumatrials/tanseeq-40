import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProject } from '@/context/ProjectContext';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Camera, Plus, Home, LayoutDashboard, Filter, Check, X, Building, MapPin, Calendar } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample profile pictures for employees
const profilePictures = ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd'];
interface EmployeeCardProps {
  id: string;
  name: string;
  isFaceEnrolled: boolean;
  profilePic: string;
  onEnroll: () => void;
  onRetake: () => void;
  onView: () => void;
}
const EmployeeCard: React.FC<EmployeeCardProps> = ({
  id,
  name,
  isFaceEnrolled,
  profilePic,
  onEnroll,
  onRetake,
  onView
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    scale: 0.95
  }} className="w-full">
      <Card className="p-4 flex items-center gap-4 border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5">
        <div className="relative">
          <div className="h-14 w-14 rounded-full overflow-hidden bg-tanseeq/20 flex-shrink-0">
            <img src={profilePic} alt={name} className="h-full w-full object-cover" />
          </div>
          {!isFaceEnrolled && <span className="absolute -top-1 -right-1">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </span>}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-muted-foreground truncate">ID: {id}</p>
          <div className="flex gap-2 mt-2">
            {isFaceEnrolled ? <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent border-tanseeq text-tanseeq hover:bg-tanseeq/10" onClick={onRetake}>
                <Camera className="h-3.5 w-3.5 mr-1" />
                Retake
              </Button> : <Button size="sm" className="h-7 text-xs bg-tanseeq hover:bg-tanseeq/90 relative" onClick={onEnroll}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Enroll Face
              </Button>}
            <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={onView}>
              View
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>;
};
const EmployeeInfo: React.FC<{
  employee: any;
  onClose: () => void;
}> = ({
  employee,
  onClose
}) => {
  const {
    currentProject
  } = useProject();

  // Sample data for employee details
  const employeeDetails = {
    daysPresent: 18,
    location: "Al-Waleed Tower, Building C, Riyadh"
  };

  // Generate a random profile image URL
  const profileImageIndex = parseInt(employee.id.replace(/\D/g, '')) % 8;
  const profilePicture = `${profilePictures[profileImageIndex]}?${employee.id}`;
  return <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium">Employee Details</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-tanseeq/20 flex-shrink-0">
            <img src={profilePicture} alt={employee.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <p className="text-sm text-muted-foreground">ID: {employee.id}</p>
            <div className="flex items-center mt-1 gap-1">
              <span className="text-xs">Face Enrollment:</span>
              {employee.isFaceEnrolled ? <div className="flex items-center text-tanseeq text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  <span>Enrolled</span>
                </div> : <div className="flex items-center text-destructive text-xs">
                  <X className="h-3 w-3 mr-1" />
                  <span>Not Enrolled</span>
                </div>}
            </div>
          </div>
        </div>
        
        <Card className="p-4 mb-6 border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5">
          <h3 className="text-md font-semibold mb-3 text-tanseeq">Project Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-tanseeq" />
              <div>
                <p className="text-xs text-muted-foreground">Current Project</p>
                <p className="text-sm font-medium">{currentProject?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-tanseeq" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{employeeDetails.location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-tanseeq" />
              <div>
                <p className="text-xs text-muted-foreground">Days Present</p>
                <p className="text-sm font-medium">{employeeDetails.daysPresent} days this month</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Button className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>;
};
const Employees = () => {
  const navigate = useNavigate();
  const {
    currentProject,
    setCurrentProject
  } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState(currentProject?.employees || []);
  const [showCamera, setShowCamera] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'not-enrolled'>('all');
  const [viewingEmployee, setViewingEmployee] = useState<any>(null);
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

  // Filter employees based on current filter
  const filteredEmployees = employees.filter(employee => {
    if (filter === 'all') return true;
    if (filter === 'enrolled') return employee.isFaceEnrolled;
    if (filter === 'not-enrolled') return !employee.isFaceEnrolled;
    return true;
  });
  const handleEnrollFace = (employeeId: string, name: string) => {
    setCurrentEmployeeId(employeeId);
    setShowCamera(true);
    // Simulate camera access and face enrollment
    setTimeout(() => {
      // Update local state to show enrollment
      const updatedEmployees = employees.map(emp => emp.id === employeeId ? {
        ...emp,
        isFaceEnrolled: true
      } : emp);
      setEmployees(updatedEmployees);

      // Close camera
      setShowCamera(false);
      setCurrentEmployeeId(null);
      toast({
        title: "Face Enrolled Successfully",
        description: `${name}'s face has been enrolled.`
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
        description: `${name}'s face profile has been updated.`
      });
    }, 2000);
  };
  const handleViewEmployee = (employeeId: string) => {
    // Open employee info modal instead of navigating
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setViewingEmployee(employee);
    }
  };
  const closeEmployeeView = () => {
    setViewingEmployee(null);
  };

  // Get random profile pic
  const getProfilePic = (index: number) => {
    return `${profilePictures[index % profilePictures.length]}?${index}`;
  };
  if (!currentProject) {
    return <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <p>No project selected</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>;
  }
  return <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center justify-between border-b">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
          <ArrowLeft className="h-5 w-5 animated-icon" />
        </Button>
        <h1 className="text-xl font-bold">Employee Details</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-1 items-center">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter('all')} className={filter === 'all' ? 'bg-tanseeq/10' : ''}>
              All Employees
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('enrolled')} className={filter === 'enrolled' ? 'bg-tanseeq/10' : ''}>
              Face Enrolled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('not-enrolled')} className={filter === 'not-enrolled' ? 'bg-tanseeq/10' : ''}>
              Not Enrolled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {showCamera && <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-4 text-center">
              {currentEmployeeId ? employees.find(e => e.id === currentEmployeeId)?.isFaceEnrolled ? "Retaking Face" : "Enrolling Face" : "Camera Access"}
            </h3>
            <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => {
            setShowCamera(false);
            setCurrentEmployeeId(null);
          }}>
                Cancel
              </Button>
              <Button className="flex-1 bg-tanseeq hover:bg-tanseeq/90" onClick={() => {
            setShowCamera(false);
            if (currentEmployeeId) {
              const employee = employees.find(e => e.id === currentEmployeeId);
              if (employee) {
                if (!employee.isFaceEnrolled) {
                  // Update local state to show enrollment
                  const updatedEmployees = employees.map(emp => emp.id === currentEmployeeId ? {
                    ...emp,
                    isFaceEnrolled: true
                  } : emp);
                  setEmployees(updatedEmployees);
                  toast({
                    title: "Face Enrolled Successfully",
                    description: `${employee.name}'s face has been enrolled.`
                  });
                } else {
                  toast({
                    title: "Face Updated Successfully",
                    description: `${employee.name}'s face profile has been updated.`
                  });
                }
              }
            }
            setCurrentEmployeeId(null);
          }}>
                Capture
              </Button>
            </div>
          </div>
        </div>}
      
      {viewingEmployee && <EmployeeInfo employee={viewingEmployee} onClose={closeEmployeeView} />}
      
      <div className="flex-1 container max-w-md mx-auto p-4 pb-24">
        {isLoading ? <div className="flex items-center justify-center h-40">
            <div className="green-loader"></div>
          </div> : <AnimatePresence>
            <div className="space-y-3">
              {filteredEmployees.map((employee, index) => <EmployeeCard key={employee.id} id={employee.id} name={employee.name} isFaceEnrolled={employee.isFaceEnrolled} profilePic={getProfilePic(index)} onEnroll={() => handleEnrollFace(employee.id, employee.name)} onRetake={() => handleRetakeFace(employee.id, employee.name)} onView={() => handleViewEmployee(employee.id)} />)}
            </div>
          </AnimatePresence>}
        
        {/* Dashboard Button */}
        <div className="mt-8 mb-16 flex justify-center">
          
        </div>
      </div>
      
      <BottomNavbar />
    </div>;
};
export default Employees;
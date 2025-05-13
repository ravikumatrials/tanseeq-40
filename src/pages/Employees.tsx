
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProject } from '@/context/ProjectContext';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Camera, Plus, Check, X, Search, Filter } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample profile pictures for employees
const profilePictures = ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd'];

interface EmployeeCardProps {
  id: string;
  name: string;
  isFaceEnrolled: boolean;
  profilePic: string;
  entity?: string;
  classification?: string;
  category?: string;
  onEnroll: () => void;
  onRetake: () => void;
  onView: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  id,
  name,
  isFaceEnrolled,
  profilePic,
  entity = "Default Company",
  classification = "Staff",
  category = "General",
  onEnroll,
  onRetake,
  onView
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <Card className="p-4 flex flex-col border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5">
        <div className="flex items-center gap-4 mb-2">
          <div className="relative">
            <div className="h-14 w-14 rounded-full overflow-hidden bg-tanseeq/20 flex-shrink-0">
              <img src={profilePic} alt={name} className="h-full w-full object-cover" />
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
            <div className="flex flex-wrap gap-1 mt-1">
              {isFaceEnrolled ? (
                <span className="inline-flex items-center bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded-full">
                  <Check className="h-2.5 w-2.5 mr-0.5" />
                  Enrolled
                </span>
              ) : (
                <span className="inline-flex items-center bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded-full">
                  <X className="h-2.5 w-2.5 mr-0.5" />
                  Not Enrolled
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-1 mb-3 px-1">
          <div>
            <span className="text-muted-foreground">Entity:</span>
            <p className="font-medium truncate">{entity}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Classification:</span>
            <p className="font-medium truncate">{classification}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Category:</span>
            <p className="font-medium truncate">{category}</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-auto">
          {isFaceEnrolled ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 text-xs bg-transparent border-tanseeq text-tanseeq hover:bg-tanseeq/10"
              onClick={onRetake}
            >
              <Camera className="h-3.5 w-3.5 mr-1" />
              UPDATE
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
      </Card>
    </motion.div>
  );
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
    entity: employee.entity || "Default Company",
    classification: employee.classification || "Staff",
    category: employee.category || "General",
  };

  // Generate a random profile image URL
  const profileImageIndex = parseInt(employee.id.replace(/\D/g, '')) % 8;
  const profilePicture = `${profilePictures[profileImageIndex]}?${employee.id}`;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
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
              {employee.isFaceEnrolled ? (
                <div className="flex items-center text-tanseeq text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  <span>Enrolled</span>
                </div>
              ) : (
                <div className="flex items-center text-destructive text-xs">
                  <X className="h-3 w-3 mr-1" />
                  <span>Not Enrolled</span>
                </div>
              )}
            </div>
            <div className="flex items-center mt-1 gap-1">
              <span className="text-xs">Days Present:</span>
              <span className="text-xs font-medium">{employeeDetails.daysPresent} days this month</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Entity</p>
              <p className="text-sm font-medium">{employeeDetails.entity}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Classification</p>
              <p className="text-sm font-medium">{employeeDetails.classification}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-medium">{employeeDetails.category}</p>
            </div>
          </div>
        </div>
        
        <Button className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

const Employees = () => {
  const navigate = useNavigate();
  const {
    currentProject,
    setCurrentProject
  } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Array<any>>(currentProject?.employees || []);
  const [showCamera, setShowCamera] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<any>(null);
  
  // Name/ID filter state
  const [nameFilter, setNameFilter] = useState('');
  
  // Enrollment status filter state
  const [enrollmentFilter, setEnrollmentFilter] = useState<'all' | 'enrolled' | 'not-enrolled'>('all');
  
  // New filter states
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sample entity, classification, and category options
  const entityOptions = ['all', 'Tanseeq Inc', 'National Industries', 'Global Co'];
  const classificationOptions = ['all', 'Staff', 'Management', 'Executive', 'Contractor'];
  const categoryOptions = ['all', 'General', 'Supervisor', 'Admin', 'IT'];

  useEffect(() => {
    if (currentProject) {
      setIsLoading(true);
      // Simulate loading data
      setTimeout(() => {
        // Add entity, classification, and category to each employee
        const enhancedEmployees = currentProject.employees.map((employee, index) => ({
          ...employee,
          entity: entityOptions[Math.min((index % (entityOptions.length - 1)) + 1, entityOptions.length - 1)],
          classification: classificationOptions[Math.min((index % (classificationOptions.length - 1)) + 1, classificationOptions.length - 1)],
          category: categoryOptions[Math.min((index % (categoryOptions.length - 1)) + 1, categoryOptions.length - 1)]
        }));
        setEmployees(enhancedEmployees);
        setIsLoading(false);
      }, 500);
    }
  }, [currentProject]);

  // Filter employees based on all filters
  const filteredEmployees = employees.filter(employee => {
    // Name/ID filter
    const nameMatch = 
      nameFilter === '' || 
      employee.name.toLowerCase().includes(nameFilter.toLowerCase()) || 
      employee.id.toLowerCase().includes(nameFilter.toLowerCase());
    
    // Enrollment status filter
    let enrollmentMatch = true;
    if (enrollmentFilter === 'enrolled') {
      enrollmentMatch = employee.isFaceEnrolled;
    } else if (enrollmentFilter === 'not-enrolled') {
      enrollmentMatch = !employee.isFaceEnrolled;
    }
    
    // Entity filter
    const entityMatch = entityFilter === 'all' || employee.entity === entityFilter;
    
    // Classification filter
    const classificationMatch = classificationFilter === 'all' || employee.classification === classificationFilter;
    
    // Category filter
    const categoryMatch = categoryFilter === 'all' || employee.category === categoryFilter;
    
    return nameMatch && enrollmentMatch && entityMatch && classificationMatch && categoryMatch;
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
  
  const clearFilters = () => {
    setNameFilter('');
    setEnrollmentFilter('all');
    setEntityFilter('all');
    setClassificationFilter('all');
    setCategoryFilter('all');
    setIsFilterOpen(false);
  };

  const activeFiltersCount = [
    nameFilter !== '',
    enrollmentFilter !== 'all',
    entityFilter !== 'all',
    classificationFilter !== 'all',
    categoryFilter !== 'all'
  ].filter(Boolean).length;

  if (!currentProject) {
    return <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <p>No project selected</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center justify-between border-b">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
          <ArrowLeft className="h-5 w-5 animated-icon" />
        </Button>
        <h1 className="text-xl font-bold">Employee Details</h1>
        <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" className="p-2 relative">
              <Filter className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm p-4">
              <DrawerHeader>
                <DrawerTitle>Filter Employees</DrawerTitle>
              </DrawerHeader>
              <div className="space-y-4 py-4">
                {/* Employee ID/Name Filter */}
                <div className="space-y-2">
                  <Label htmlFor="nameFilter">Employee ID/Name</Label>
                  <div className="relative">
                    <Input 
                      id="nameFilter" 
                      placeholder="Search by ID or name..." 
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                      className="pl-9 pr-4 w-full"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {nameFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0" 
                        onClick={() => setNameFilter('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup 
                    value={enrollmentFilter} 
                    onValueChange={(value) => setEnrollmentFilter(value as 'all' | 'enrolled' | 'not-enrolled')}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="text-sm cursor-pointer">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enrolled" id="enrolled" />
                      <Label htmlFor="enrolled" className="text-sm cursor-pointer">Enrolled</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-enrolled" id="not-enrolled" />
                      <Label htmlFor="not-enrolled" className="text-sm cursor-pointer">Not Enrolled</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Entity Filter */}
                <div className="space-y-2">
                  <Label htmlFor="entity">Entity</Label>
                  <Select value={entityFilter} onValueChange={setEntityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityOptions.map((entity) => (
                        <SelectItem key={entity} value={entity}>
                          {entity === 'all' ? 'All Entities' : entity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Classification Filter */}
                <div className="space-y-2">
                  <Label htmlFor="classification">Classification</Label>
                  <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {classificationOptions.map((classification) => (
                        <SelectItem key={classification} value={classification}>
                          {classification === 'all' ? 'All Classifications' : classification}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DrawerFooter className="flex-row gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1"
                >
                  Apply
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      
      {/* Camera modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
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
        </div>
      )}
      
      {/* Employee details modal */}
      {viewingEmployee && (
        <EmployeeInfo employee={viewingEmployee} onClose={closeEmployeeView} />
      )}
      
      <div className="flex-1 container max-w-md mx-auto p-4 pb-24">
        {/* Active filters summary */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg p-2 mb-4">
            <div className="text-xs text-teal-800">
              {activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs text-teal-800 hover:bg-teal-100 hover:text-teal-900"
              onClick={clearFilters}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="green-loader"></div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <EmployeeCard 
                    key={employee.id} 
                    id={employee.id} 
                    name={employee.name} 
                    isFaceEnrolled={employee.isFaceEnrolled} 
                    profilePic={getProfilePic(index)} 
                    entity={employee.entity}
                    classification={employee.classification}
                    category={employee.category}
                    onEnroll={() => handleEnrollFace(employee.id, employee.name)} 
                    onRetake={() => handleRetakeFace(employee.id, employee.name)} 
                    onView={() => handleViewEmployee(employee.id)} 
                  />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <User className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No employees match your filters</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Employees;

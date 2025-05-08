
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useProject } from '@/context/ProjectContext';
import { useLocation } from '@/hooks/useLocation';
import { useAttendance } from '@/hooks/useAttendance';
import { useToast } from '@/hooks/use-toast';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface FaceRecognitionProps {
  isCheckIn: boolean;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ isCheckIn }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedEmployees, setScannedEmployees] = useState<{
    id: string;
    name: string;
    time: string;
    project: string;
    location: string;
  }[]>([]);
  const { currentProject } = useProject();
  const { address } = useLocation();
  const { toast } = useToast();
  const { addCheckIn, addCheckOut } = useAttendance();
  const { addPendingChange } = useOfflineSync();
  
  const startScanning = () => {
    setIsScanning(true);
    setScannedEmployees([]);
  };
  
  const stopScanning = () => {
    setIsScanning(false);
  };
  
  // Simulate face scanning process
  useEffect(() => {
    if (!isScanning || !currentProject) return;
    
    let lastScanned = new Set<string>();
    
    const scanInterval = setInterval(() => {
      // Randomly select an employee to "recognize"
      const availableEmployees = currentProject.employees.filter(
        e => e.isFaceEnrolled && !lastScanned.has(e.id)
      );
      
      if (availableEmployees.length === 0) {
        // Everyone has been scanned
        if (lastScanned.size === currentProject.employees.filter(e => e.isFaceEnrolled).length) {
          clearInterval(scanInterval);
          return;
        }
        
        // Reset for another round (in a real app we wouldn't do this)
        lastScanned = new Set<string>();
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * availableEmployees.length);
      const employee = availableEmployees[randomIndex];
      
      // Add to scanned list
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      
      if (isCheckIn) {
        addCheckIn(employee.id, employee.name, address);
      } else {
        addCheckOut(employee.id);
      }
      
      addPendingChange();
      
      const newScannedEmployee = {
        id: employee.id,
        name: employee.name,
        time: timeString,
        project: currentProject.name,
        location: address,
      };
      
      setScannedEmployees(prev => [...prev, newScannedEmployee]);
      lastScanned.add(employee.id);
      
      // Show toast for each recognized face
      toast({
        title: "Face Captured Successfully",
        description: `${employee.name} has been ${isCheckIn ? 'checked in' : 'checked out'}`,
      });
    }, 3000); // Scan every 3 seconds
    
    return () => {
      clearInterval(scanInterval);
    };
  }, [isScanning, currentProject, isCheckIn, addCheckIn, addCheckOut, address, toast, addPendingChange]);
  
  if (!currentProject) {
    return (
      <div className="text-center py-8">
        Please select a project first.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{isCheckIn ? 'Check In' : 'Check Out'}</h2>
        <p className="text-muted-foreground">
          {isScanning 
            ? 'Scanning faces... Position employees in front of the camera.'
            : 'Press Start to begin face recognition.'}
        </p>
      </div>
      
      {isScanning ? (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-tanseeq/10 via-transparent to-tanseeq/10 animate-pulse"></div>
          <div className="text-center space-y-2 z-10">
            <div className="mx-auto w-20 h-20 rounded-full border-4 border-t-tanseeq animate-spin"></div>
            <div>Scanning...</div>
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4" />
              <circle cx="12" cy="11" r="2" />
            </svg>
            <p>Camera is off</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        {isScanning ? (
          <Button onClick={stopScanning} variant="destructive">
            Stop Scanning
          </Button>
        ) : (
          <Button onClick={startScanning} className="bg-tanseeq hover:bg-tanseeq/90">
            Start Scanning
          </Button>
        )}
      </div>
      
      {scannedEmployees.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Scanned Employees</h3>
          <div className="space-y-2">
            {scannedEmployees.map((employee, index) => (
              <div 
                key={`${employee.id}-${index}`} 
                className="bg-card rounded-lg p-4 border flex items-start space-x-3"
              >
                <div className="bg-muted rounded-full h-10 w-10 flex items-center justify-center">
                  {employee.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.id}</div>
                  <div className="text-sm">
                    {isCheckIn ? 'Checked in' : 'Checked out'} at {employee.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;

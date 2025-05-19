
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useProject } from '@/context/ProjectContext';
import { useLocation } from '@/hooks/useLocation';
import { useAttendance } from '@/hooks/useAttendance';
import { useToast } from '@/hooks/use-toast';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useIsMobile } from '@/hooks/use-mobile';
import { RotateCw, CheckCheck, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaceRecognitionProps {
  isCheckIn?: boolean;
  onSuccess?: (employeeId: string) => void;
  employeeToVerify?: string;
  mode?: 'scan' | 'verify';
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ 
  isCheckIn = true,
  onSuccess,
  employeeToVerify,
  mode = 'scan'
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedEmployees, setScannedEmployees] = useState<{
    id: string;
    name: string;
    time: string;
    project: string;
    location: string;
    synced: boolean;
  }[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const { currentProject } = useProject();
  const { address, latitude, longitude } = useLocation();
  const { toast } = useToast();
  const { addCheckIn, addCheckOut, syncRecords } = useAttendance();
  const { addPendingChange } = useOfflineSync();
  const isMobile = useIsMobile();
  
  const startScanning = () => {
    setIsScanning(true);
    setHasSynced(false);
  };
  
  const stopScanning = () => {
    setIsScanning(false);
  };
  
  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      await syncRecords();
      toast({
        title: "Sync Successful",
        description: "All records have been synced to the server.",
        variant: "default",
      });
      
      // Update synced status for all scanned employees
      setScannedEmployees(prev => 
        prev.map(emp => ({ ...emp, synced: true }))
      );
      
      setHasSynced(true);
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync records. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Auto-start scanning for verification mode
  useEffect(() => {
    if (mode === 'verify') {
      startScanning();
    }
  }, [mode]);
  
  // Simulate face scanning process
  useEffect(() => {
    if (!isScanning || !currentProject) return;
    
    let scanInterval: NodeJS.Timeout;
    const scannedIds = new Set<string>();
    
    if (mode === 'verify' && employeeToVerify) {
      // In verification mode, only scan for the specific employee
      scanInterval = setTimeout(() => {
        const employee = currentProject.employees.find(e => e.id === employeeToVerify && e.isFaceEnrolled);
        
        if (employee) {
          // Found the employee, complete verification
          if (onSuccess) {
            onSuccess(employee.id);
          }
          
          toast({
            title: "Face Verification Successful",
            description: `Identity verified successfully.`,
          });
          
          setIsScanning(false);
        } else {
          toast({
            title: "Verification Failed",
            description: "Could not verify face. Please try again.",
            variant: "destructive",
          });
          setIsScanning(false);
        }
      }, 2000); // Simulate a 2-second verification process
    } else {
      // Normal scanning mode (multiple employees)
      scanInterval = setInterval(() => {
        if (!currentProject) return;
        
        // Filter out already scanned employees
        const availableEmployees = currentProject.employees.filter(
          e => e.isFaceEnrolled && !scannedIds.has(e.id)
        );
        
        if (availableEmployees.length === 0) {
          // If we've scanned everyone, just keep scanning random employees
          // for demo purposes
          const randomEmployee = currentProject.employees[
            Math.floor(Math.random() * currentProject.employees.length)
          ];
          
          processEmployeeScan(randomEmployee);
          return;
        }
        
        // Pick a random employee to scan
        const randomIndex = Math.floor(Math.random() * availableEmployees.length);
        const employee = availableEmployees[randomIndex];
        
        processEmployeeScan(employee);
        scannedIds.add(employee.id);
      }, 3000); // Scan every 3 seconds
    }
    
    function processEmployeeScan(employee: any) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const locationStr = `${address}`;
      
      // Log the check in/out in the attendance system
      if (isCheckIn) {
        addCheckIn(employee.id, employee.name, locationStr);
      } else {
        addCheckOut(employee.id);
      }
      
      // Add to pending offline changes
      addPendingChange();
      
      // Add to local scanned list without showing employee details
      setScannedEmployees(prev => [
        ...prev,
        {
          id: employee.id,
          name: employee.name, // We'll store but not display this
          time: timeString,
          project: currentProject?.name || '',
          location: locationStr,
          synced: false
        }
      ]);
      
      // Show success toast with check mark
      toast({
        title: `${isCheckIn ? 'Check-In' : 'Check-Out'} Successful`,
        description: `Face scan completed successfully.`,
      });
    }
    
    return () => {
      if (scanInterval) {
        if (mode === 'verify') {
          clearTimeout(scanInterval);
        } else {
          clearInterval(scanInterval);
        }
      }
    };
  }, [isScanning, currentProject, isCheckIn, addCheckIn, addCheckOut, address, toast, addPendingChange, mode, employeeToVerify, onSuccess]);
  
  if (!currentProject) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Please select a project first.</p>
      </div>
    );
  }
  
  // Special UI for verification mode
  if (mode === 'verify') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner"
      >
        {isScanning ? (
          <>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-teal-500/5"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']  
              }} 
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="text-center space-y-3 z-10">
              <motion.div 
                className="mx-auto w-16 md:w-20 h-16 md:h-20 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              />
              <div className="text-base md:text-lg font-medium">Verifying face...</div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <Button onClick={startScanning} variant="scan" className="shadow-md">
              Retry Verification
            </Button>
          </div>
        )}
      </motion.div>
    );
  }
  
  // Full-screen camera view for scanning mode
  return (
    <div className="flex flex-col h-full">
      {/* Full-screen camera view */}
      <AnimatePresence mode="wait">
        {isScanning ? (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col"
          >
            {/* Camera view with green tint */}
            <div className="relative flex-1 bg-black">
              {/* Green overlay on camera */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-teal-500/5 pointer-events-none"
              />
              
              {/* Scanning animation */}
              <motion.div 
                className="absolute inset-x-0 h-1 bg-teal-500/50"
                animate={{ 
                  top: ["0%", "100%", "0%"],
                }} 
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Face detection indicator corners */}
              <div className={`absolute top-1/2 left-1/2 ${isMobile ? 'w-48 h-64' : 'w-64 h-80'} -translate-x-1/2 -translate-y-1/2 pointer-events-none`}>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-teal-400"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-teal-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-teal-400"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-teal-400"></div>
              </div>
              
              {/* Stop button at bottom */}
              <div className="absolute bottom-8 inset-x-0 flex justify-center">
                <Button 
                  onClick={stopScanning} 
                  variant="stop"
                  size={isMobile ? "default" : "lg"}
                  className="shadow-xl px-6 md:px-8 text-sm md:text-base font-medium"
                >
                  Stop Capture
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="not-scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Start scanning UI */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
              <div className="bg-muted/30 aspect-video w-full max-w-md rounded-xl flex items-center justify-center shadow-inner">
                <div className="text-center space-y-3 md:space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "48" : "64"} height={isMobile ? "48" : "64"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4" />
                    <circle cx="12" cy="11" r="2" />
                  </svg>
                  <p className="text-muted-foreground">Camera is off</p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8">
                <Button 
                  onClick={startScanning} 
                  variant="scan"
                  size={isMobile ? "default" : "xl"}
                  className="shadow-md px-6 md:px-8 text-sm md:text-base font-medium"
                >
                  Start Scanning
                </Button>
              </div>
            </div>
            
            {/* Scanned records summary (shown after stopping) */}
            <AnimatePresence>
              {scannedEmployees.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-t-xl border-t border-x shadow-xl p-3 md:p-4 space-y-3 md:space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-base md:text-lg">Scan Summary</h3>
                    <div className="flex items-center gap-1.5 md:gap-2 bg-teal-50 px-2 md:px-3 py-1 rounded-full">
                      <CheckCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-teal-600" />
                      <span className="text-xs md:text-sm font-medium text-teal-700">
                        {scannedEmployees.length} {scannedEmployees.length === 1 ? 'Record' : 'Records'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Summary list */}
                  <div className="max-h-40 md:max-h-56 overflow-y-auto space-y-1.5 md:space-y-2 pr-1">
                    {scannedEmployees.map((record, index) => (
                      <motion.div
                        key={`${record.id}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-2.5 md:p-3 border flex justify-between items-center"
                      >
                        <div>
                          <div className="text-xs text-gray-500">ID: {record.id.substring(0, 8)}...</div>
                          <div className="text-xs md:text-sm">{isCheckIn ? 'Checked in' : 'Checked out'}: {record.time}</div>
                        </div>
                        <div className={`flex items-center rounded-full px-1.5 md:px-2 py-0.5 md:py-1 text-xs ${record.synced ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                          {record.synced ? (
                            <>
                              <Check className="h-2.5 md:h-3 w-2.5 md:w-3 mr-0.5 md:mr-1" />
                              <span>Synced</span>
                            </>
                          ) : (
                            <>
                              <span className="block h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-amber-500 mr-0.5 md:mr-1"></span>
                              <span>Pending</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Sync button */}
                  <div className="pt-2 border-t">
                    <Button 
                      onClick={handleSync} 
                      variant="teal"
                      className="w-full flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-2.5"
                      disabled={isSyncing || hasSynced || scannedEmployees.length === 0}
                    >
                      {isSyncing ? (
                        <>
                          <div className="h-3.5 w-3.5 md:h-4 md:w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                          <span className="text-xs md:text-sm">Syncing Records...</span>
                        </>
                      ) : hasSynced ? (
                        <>
                          <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          <span className="text-xs md:text-sm">All Records Synced</span>
                        </>
                      ) : (
                        <>
                          <RotateCw className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          <span className="text-xs md:text-sm">Sync Records Now</span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FaceRecognition;

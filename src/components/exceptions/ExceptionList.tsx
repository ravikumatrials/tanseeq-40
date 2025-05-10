
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAttendance } from '@/hooks/useAttendance';
import { useToast } from '@/hooks/use-toast';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Exception } from '@/data/dummyData';
import FaceCheckOutModal from './FaceCheckOutModal';

const ExceptionList = () => {
  const {
    exceptions,
    resolveException
  } = useAttendance();
  
  const { addPendingChange } = useOfflineSync();
  const [filter, setFilter] = useState('');
  const { toast } = useToast();
  
  // State for face checkout modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);
  
  const filteredExceptions = exceptions.filter(ex => 
    ex.employeeName.toLowerCase().includes(filter.toLowerCase()) || 
    ex.employeeId.toLowerCase().includes(filter.toLowerCase())
  );
  
  // Handle manual check-out via face verification
  const handleManualCheckOut = (exception: Exception) => {
    setSelectedException(exception);
    setModalOpen(true);
  };
  
  // Called after successful face verification
  const handleSuccessfulCheckout = (exceptionId: string, employeeId: string) => {
    // Get current date and time
    const now = new Date();
    const checkOutDateTime = now.toISOString();
    
    // Resolve the exception
    resolveException(exceptionId, checkOutDateTime);
    addPendingChange();
    
    toast({
      title: "Exception resolved",
      description: "Employee has been successfully checked out."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exceptions</h2>
        <div className="text-sm text-muted-foreground">
          {exceptions.length} Total
        </div>
      </div>
      
      <div className="space-y-4">
        <Input 
          placeholder="Filter by name or ID..." 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          className="w-full" 
        />
      </div>
      
      {filteredExceptions.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No exceptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExceptions.map(exception => (
            <div 
              key={exception.id} 
              className="p-4 rounded-lg border bg-card flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="font-medium">{exception.employeeName}</div>
                <div className="text-sm text-muted-foreground">{exception.employeeId}</div>
                <div className="text-sm mt-1">
                  <span className="font-medium">Check-in:</span> {new Date(exception.checkInTime).toLocaleTimeString()}
                </div>
                <div className="text-sm text-destructive">
                  <span className="font-medium">Check-out:</span> Missing
                </div>
              </div>
              
              <Button 
                onClick={() => handleManualCheckOut(exception)}
                className="bg-tanseeq hover:bg-tanseeq/90"
              >
                Check Out
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <FaceCheckOutModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        exception={selectedException}
        onSuccessfulCheckout={handleSuccessfulCheckout}
      />
    </div>
  );
};

export default ExceptionList;

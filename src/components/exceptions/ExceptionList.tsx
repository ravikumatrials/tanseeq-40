
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAttendance } from '@/hooks/useAttendance';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOfflineSync } from '@/hooks/useOfflineSync';

const ExceptionList = () => {
  const { exceptions, resolveException } = useAttendance();
  const { addPendingChange } = useOfflineSync();
  const [selectedExceptions, setSelectedExceptions] = useState<Record<string, boolean>>({});
  const [checkOutTime, setCheckOutTime] = useState('17:00');
  const [filter, setFilter] = useState('');
  const { toast } = useToast();
  
  const filteredExceptions = exceptions.filter(ex => 
    ex.employeeName.toLowerCase().includes(filter.toLowerCase()) ||
    ex.employeeId.toLowerCase().includes(filter.toLowerCase())
  );
  
  const handleSelectException = (id: string) => {
    setSelectedExceptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleSelectAll = () => {
    const allSelected = filteredExceptions.every(ex => selectedExceptions[ex.id]);
    
    if (allSelected) {
      // Deselect all
      setSelectedExceptions({});
    } else {
      // Select all
      const newSelected: Record<string, boolean> = {};
      filteredExceptions.forEach(ex => {
        newSelected[ex.id] = true;
      });
      setSelectedExceptions(newSelected);
    }
  };
  
  const handleResolveExceptions = () => {
    const selectedIds = Object.entries(selectedExceptions)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedIds.length === 0) {
      toast({
        title: "No exceptions selected",
        description: "Please select at least one exception to resolve.",
        variant: "destructive",
      });
      return;
    }
    
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    const checkOutDateTime = `${today}T${checkOutTime}:00`;
    
    // Resolve each selected exception
    selectedIds.forEach(id => {
      resolveException(id, checkOutDateTime);
      addPendingChange();
    });
    
    toast({
      title: "Exceptions resolved",
      description: `${selectedIds.length} exception(s) have been updated with checkout time.`,
    });
    
    // Clear selections
    setSelectedExceptions({});
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
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSelectAll}
          >
            {filteredExceptions.every(ex => selectedExceptions[ex.id])
              ? 'Deselect All'
              : 'Select All'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="checkout-time">Check-out time:</Label>
            <Input
              id="checkout-time"
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-24"
            />
            
            <Button 
              size="sm"
              className="bg-tanseeq hover:bg-tanseeq/90"
              onClick={handleResolveExceptions}
              disabled={Object.values(selectedExceptions).filter(Boolean).length === 0}
            >
              Update Selected
            </Button>
          </div>
        </div>
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
              className={`p-4 rounded-lg border flex items-start space-x-3 cursor-pointer transition-colors ${
                selectedExceptions[exception.id] ? 'bg-tanseeq/5 border-tanseeq' : 'bg-card'
              }`}
              onClick={() => handleSelectException(exception.id)}
            >
              <input
                type="checkbox"
                checked={selectedExceptions[exception.id] || false}
                onChange={() => handleSelectException(exception.id)}
                className="mt-1"
              />
              
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExceptionList;

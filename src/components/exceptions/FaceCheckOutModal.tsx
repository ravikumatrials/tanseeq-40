
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import FaceRecognition from '@/components/check-in/FaceRecognition';
import { useToast } from '@/hooks/use-toast';
import { Exception } from '@/data/dummyData';

interface FaceCheckOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exception: Exception | null;
  onSuccessfulCheckout: (exceptionId: string, employeeId: string) => void;
}

const FaceCheckOutModal: React.FC<FaceCheckOutModalProps> = ({
  open,
  onOpenChange,
  exception,
  onSuccessfulCheckout
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  if (!exception) return null;

  const handleFaceRecognitionSuccess = (employeeId: string) => {
    if (exception && employeeId === exception.employeeId) {
      setProcessing(true);
      
      // Simulate processing time 
      setTimeout(() => {
        // Call the checkout function
        onSuccessfulCheckout(exception.id, exception.employeeId);
        
        // Show success toast
        toast({
          title: "Check-out successful",
          description: `${exception.employeeName} has been successfully checked out.`,
        });
        
        // Close modal
        setProcessing(false);
        onOpenChange(false);
      }, 1000);
    } else {
      // Face doesn't match the expected employee
      toast({
        title: "Face verification failed",
        description: "The scanned face doesn't match the expected employee.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manual Check Out</DialogTitle>
          <DialogDescription>
            Verify {exception.employeeName}'s face to complete check-out
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="font-medium">{exception.employeeName}</div>
            <div className="text-sm text-muted-foreground">{exception.employeeId}</div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <FaceRecognition 
              onSuccess={handleFaceRecognitionSuccess}
              employeeToVerify={exception.employeeId}
              mode="verify"
            />
          </div>
          
          {processing && (
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
              <p className="mt-2 text-sm text-muted-foreground">Processing check-out...</p>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          className="absolute right-4 top-4"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FaceCheckOutModal;

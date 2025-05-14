import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import BottomNavbar from '@/components/layout/BottomNavbar';

// Sample document data
const employeeDocuments = [{
  id: 1,
  name: 'Resume',
  type: 'pdf',
  updated: '2025-04-10'
}, {
  id: 2,
  name: 'ID Proof',
  type: 'jpg',
  updated: '2025-04-12'
}, {
  id: 3,
  name: 'Project Assignment Letter',
  type: 'pdf',
  updated: '2025-04-15'
}, {
  id: 4,
  name: 'Certifications',
  type: 'pdf',
  updated: '2025-04-20'
}, {
  id: 5,
  name: 'Contract',
  type: 'pdf',
  updated: '2025-05-01'
}];

interface DocumentItemProps {
  document: {
    id: number;
    name: string;
    type: string;
    updated: string;
  };
  onView: () => void;
  onDownload: () => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  onView,
  onDownload
}) => {
  return (
    <Card className="p-4 flex items-center justify-between border-tanseeq/10 mb-3 bg-gradient-to-br from-card to-tanseeq/5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-tanseeq/10 text-tanseeq">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-sm">{document.name}</h3>
          <p className="text-xs text-muted-foreground">Updated: {document.updated}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button size="sm" className="h-8 w-8 p-0 bg-tanseeq hover:bg-tanseeq/90" onClick={onView}>
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { employeeId } = useParams();
  const { currentProject } = useProject();
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [activeDocument, setActiveDocument] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Find the employee from the current project
  const employee = currentProject?.employees.find(emp => emp.id === employeeId);

  // Sample data for employee details
  const employeeDetails = {
    daysPresent: 18
  };

  if (!employee) {
    return;
  }

  const handleViewDocument = (docId: number, docName: string) => {
    setActiveDocument({
      id: docId,
      name: docName
    });
    setShowDocumentModal(true);
  };

  const handleDownloadDocument = (docId: number, docName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${docName}`
    });
  };

  // Generate a random profile image URL
  const profileImageIndex = parseInt(employee.id) % 8; // Use employee ID to get consistent image
  const profilePicture = `https://images.unsplash.com/photo-${["1535713875002-d1d0cf377fde", "1494790108377-be9c29b29330", "1599566150163-29194dcaad36", "1570295999919-56ceb5ecca61", "1534528741775-53994a69daeb", "1507003211169-0a1dd7228f2d", "1438761681033-6461ffad8d80", "1629467057571-42d22d8f0cbd"][profileImageIndex]}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/employees')} className="p-2 mr-2">
            <ArrowLeft className="h-7 w-7" />
          </Button>
          
          <h1 className="text-xl font-bold">Employee Details</h1>
        </div>
        
        <div className="w-10"></div> {/* Spacer for balancing */}
      </div>
      
      <div className="flex-1 container max-w-md mx-auto p-4 pb-24">
        {/* Employee Profile Section */}
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
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Enrolled</span>
                </div>
              ) : (
                <div className="flex items-center text-destructive text-xs">
                  <XCircle className="h-3 w-3 mr-1" />
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
        
        {/* Documents Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Documents</h3>
          <div className="space-y-2">
            {employeeDocuments.map(doc => (
              <DocumentItem 
                key={doc.id} 
                document={doc} 
                onView={() => handleViewDocument(doc.id, doc.name)} 
                onDownload={() => handleDownloadDocument(doc.id, doc.name)} 
              />
            ))}
          </div>
        </div>
        
        {/* Document Preview Modal */}
        {showDocumentModal && activeDocument && (
          <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-4 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{activeDocument.name}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setShowDocumentModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
              
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowDocumentModal(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-tanseeq hover:bg-tanseeq/90" 
                  onClick={() => {
                    handleDownloadDocument(activeDocument.id, activeDocument.name);
                    setShowDocumentModal(false);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default EmployeeDetails;

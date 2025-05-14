
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, UserRound } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Mock employee data - in a real app, this would come from an API or context
  const employeeData = {
    id: 'EMP-001',
    name: user?.name || 'John Doe',
    contactNumber: '+1 (555) 123-4567',
    email: user?.email || 'john.doe@example.com',
    entity: 'Acme Corporation',
    classification: 'Staff',
    category: 'Supervisor',
    role: 'Team Lead'
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 mb-1.5">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-gray-50">
      {/* Improved TopNavbar with centered title */}
      <motion.div 
        className="p-4 flex items-center justify-between bg-tanseeq text-white shadow-md" 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="p-2.5 rounded-full hover:bg-white/20 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute inset-x-0 text-center text-white font-medium"
        >
          Profile
        </motion.div>
        
        <Avatar className="h-9 w-9 bg-white/20 text-white">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employeeData.name}`} alt={employeeData.name} />
          <AvatarFallback className="bg-white/20 text-white">
            <UserRound className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
      
      <div className="flex-1 container max-w-md mx-auto p-5 pb-8">
        <motion.div 
          className="flex flex-col items-center justify-center py-8" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Avatar className="h-28 w-28 border-4 border-white shadow-lg mb-5">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${employeeData.name}`} 
              alt={employeeData.name} 
              className="bg-tanseeq/10"
            />
            <AvatarFallback className="bg-tanseeq/20 text-tanseeq text-3xl">
              {employeeData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-gray-800 mt-2 mb-1">{employeeData.name}</h2>
          <p className="text-sm text-gray-500">{employeeData.role}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-white shadow-md rounded-xl border-gray-100">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50 px-5">
                <InfoRow label="Employee ID" value={employeeData.id} />
                <InfoRow label="Contact Number" value={employeeData.contactNumber} />
                <InfoRow label="Email ID" value={employeeData.email} />
                <InfoRow label="Entity" value={employeeData.entity} />
                <InfoRow label="Classification" value={employeeData.classification} />
                <InfoRow label="Category" value={employeeData.category} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mt-8" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button 
            variant="default" 
            className="w-full py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2.5 text-base" 
            onClick={() => navigate('/change-password')}
          >
            <KeyRound className="h-5 w-5" />
            Change Password
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

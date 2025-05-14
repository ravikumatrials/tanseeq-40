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
  const {
    user,
    logout
  } = useAuth();

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
  const InfoRow = ({
    label,
    value
  }: {
    label: string;
    value: string;
  }) => <div className="flex flex-col py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 mb-1">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>;
  return <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-gray-50">
      {/* Updated TopNavbar to match Dashboard styling */}
      <motion.div className="p-4 flex items-center justify-between bg-tanseeq text-white shadow-md" initial={{
      y: -100
    }} animate={{
      y: 0
    }} transition={{
      duration: 0.5,
      ease: "easeOut"
    }}>
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2.5 rounded-full hover:bg-white/20 text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2,
        duration: 0.4
      }} className="w-full text-white font-medium text-base text-center">
          Profile
        </motion.div>
        
        
      </motion.div>
      
      <div className="flex-1 container max-w-md mx-auto p-4 pb-6">
        <motion.div className="flex flex-col items-center justify-center py-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4
      }}>
          <Avatar className="h-24 w-24 border-4 border-white shadow-md mb-4">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employeeData.name}`} alt={employeeData.name} />
            <AvatarFallback className="bg-tanseeq-gold/20 text-tanseeq">
              {employeeData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4,
        delay: 0.2
      }}>
          <Card className="overflow-hidden bg-white shadow-soft rounded-xl border-gray-100">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                <InfoRow label="Employee ID" value={employeeData.id} />
                <InfoRow label="Name" value={employeeData.name} />
                <InfoRow label="Contact Number" value={employeeData.contactNumber} />
                <InfoRow label="Email ID" value={employeeData.email} />
                <InfoRow label="Entity" value={employeeData.entity} />
                <InfoRow label="Classification" value={employeeData.classification} />
                <InfoRow label="Category" value={employeeData.category} />
                <InfoRow label="Role" value={employeeData.role} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div className="mt-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4,
        delay: 0.4
      }}>
          <Button variant="default" className="w-full py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2" onClick={() => navigate('/change-password')}>
            <KeyRound className="h-4 w-4" />
            Change Password
          </Button>
        </motion.div>
      </div>
    </div>;
};
export default Profile;
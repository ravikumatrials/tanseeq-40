
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Check, Eye, EyeOff, KeyRound, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Password change form schema
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters")
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });
  
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  const onSubmitPasswordChange = (values: z.infer<typeof passwordFormSchema>) => {
    // In a real app, this would call an API
    console.log("Password change form values:", values);

    // Show success notification
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
      variant: "default"
    });

    // Reset form and hide the form
    passwordForm.reset();
    setShowChangePassword(false);
  };
  
  const InfoRow = ({ label, value }: { label: string; value: string; }) => (
    <div className="flex flex-col py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 mb-1.5">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-gray-50">
      <TopNavbar />
      
      <div className="flex-1 container max-w-md mx-auto p-5 pb-8">
        <motion.div 
          className="flex flex-col items-center justify-center py-6" 
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
          <h2 className="text-xl font-bold text-gray-800 mb-1">{employeeData.name}</h2>
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
          className="mt-6" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {!showChangePassword ? (
            <Button 
              variant="default" 
              className="w-full py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2.5 text-base" 
              onClick={() => setShowChangePassword(true)}
            >
              <KeyRound className="h-5 w-5" />
              Change Password
            </Button>
          ) : (
            <Card className="overflow-hidden bg-white shadow-md rounded-xl border-gray-100 mt-4">
              <CardHeader className="px-5 py-4 bg-gray-50">
                <CardTitle className="text-base font-medium text-gray-800">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Current Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showCurrentPassword ? "text" : "password"} 
                                placeholder="Enter current password" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">New Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showNewPassword ? "text" : "password"} 
                                placeholder="Enter new password" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm new password" 
                                {...field} 
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => {
                          setShowChangePassword(false);
                          passwordForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 gap-2">
                        <Check className="h-4 w-4" />
                        Update
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Profile;


import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/hooks/useAttendance';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useProject } from '@/context/ProjectContext';
import { useLocation } from '@/hooks/useLocation';
import { useNavigate } from 'react-router-dom';
import { BarChart4, Users, UserCheck, Clock, CheckCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const MotionCard = motion(Card);

const DashboardCards = () => {
  const { currentProject } = useProject();
  const { stats, syncRecords } = useAttendance();
  const { pendingChanges, lastSync, isOnline, isSyncing, syncChanges } = useOfflineSync();
  const { address, isLoading: locationLoading } = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSync = async () => {
    await Promise.all([syncRecords(), syncChanges()]);
  };

  if (!currentProject) {
    return <div className="text-center py-8 text-tanseeq">Please select a project</div>;
  }

  // Check if any employee is missing face enrollment
  const hasMissingFaceEnrollments = currentProject.employees.some(e => !e.isFaceEnrolled);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-6">
      {/* Date/Time & Sync Card */}
      <MotionCard 
        initial="hidden"
        animate="visible"
        custom={0}
        variants={cardVariants}
        className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <CardTitle className="text-lg font-medium text-tanseeq">
            {new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardTitle>
          <div>
            {pendingChanges > 0 && (
              <Badge variant="warning" className="flex h-6 items-center gap-1 px-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span>Pending sync</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold flex items-center text-tanseeq">
              <Clock className="h-5 w-5 mr-2 text-teal-500" />
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <Button 
              onClick={handleSync}
              disabled={isSyncing || (pendingChanges === 0 && lastSync !== null)}
              variant={pendingChanges > 0 ? "teal" : "outline"}
              size="sm"
              className="rounded-md px-4 shadow-sm"
            >
              {isSyncing ? (
                <>
                  <div className="h-4 w-4 rounded-full animate-spin border-2 border-white border-t-transparent"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sync">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                  <span>{pendingChanges ? `Sync (${pendingChanges})` : 'Sync'}</span>
                </>
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
            <div>
              {lastSync ? `Last synced: ${new Date(lastSync).toLocaleString()}` : 'Never synced'}
            </div>
            <Badge variant={isOnline ? "success" : "danger"} className="text-xs px-2 py-0.5">
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </MotionCard>
      
      {/* Location Card */}
      <MotionCard 
        initial="hidden"
        animate="visible"
        custom={1}
        variants={cardVariants}
        className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm"
      >
        <CardHeader className="pb-2 border-b">
          <CardTitle className="flex items-center text-sm font-medium text-tanseeq">
            <MapPin className="mr-2 h-4 w-4 text-teal-500" />
            Current Location
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-tanseeq">
              {locationLoading ? (
                <span className="flex items-center">
                  <div className="h-3 w-3 rounded-full animate-spin border-2 border-teal-500 border-t-transparent mr-2"></div>
                  Fetching location...
                </span>
              ) : address}
            </span>
          </div>
          <div className="text-xs text-teal-500 mt-2 italic">
            {currentProject.location}
          </div>
        </CardContent>
      </MotionCard>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MotionCard 
          className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm" 
          initial="hidden"
          animate="visible"
          custom={2}
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <CardHeader className="pb-2 pt-3 px-3 border-b">
            <CardTitle className="text-xs font-medium flex items-center px-0 py-0 text-tanseeq">
              <Users className="h-3.5 w-3.5 mr-1 text-teal-500" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="text-2xl font-bold mx-0 text-tanseeq">{currentProject.employeeCount}</div>
          </CardContent>
        </MotionCard>
        
        <MotionCard 
          className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm" 
          initial="hidden"
          animate="visible"
          custom={3}
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <CardHeader className="pb-2 pt-3 px-3 border-b">
            <CardTitle className="text-xs font-medium flex items-center text-tanseeq">
              <UserCheck className="h-3.5 w-3.5 mr-1 text-teal-500" />
              Check-Ins Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="text-2xl font-bold text-tanseeq">{stats.totalCheckIns}</div>
          </CardContent>
        </MotionCard>
        
        <MotionCard 
          className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm" 
          initial="hidden"
          animate="visible"
          custom={4}
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <CardHeader className="pb-2 pt-3 px-3 border-b">
            <CardTitle className="text-xs font-medium flex items-center text-tanseeq">
              <CheckCheck className="h-3.5 w-3.5 mr-1 text-teal-500" />
              Check-Outs Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="text-2xl font-bold text-tanseeq">{stats.totalCheckOuts}</div>
          </CardContent>
        </MotionCard>
        
        <MotionCard 
          className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm" 
          initial="hidden"
          animate="visible"
          custom={5}
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <CardHeader className="pb-2 pt-3 px-3 border-b">
            <CardTitle className="text-xs font-medium flex items-center text-tanseeq">
              <BarChart4 className="h-3.5 w-3.5 mr-1 text-teal-500" />
              Face Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-3 pb-3">
            <div className="text-2xl font-bold text-tanseeq">
              {currentProject.employees.filter(e => e.isFaceEnrolled).length}
              <span className="text-xs text-muted-foreground ml-1">
                / {currentProject.employeeCount}
              </span>
            </div>
          </CardContent>
        </MotionCard>
      </div>
      
      {/* Quick Actions */}
      <MotionCard
        initial="hidden"
        animate="visible"
        custom={6}
        variants={cardVariants}
        className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm"
      >
        <CardHeader className="pb-2 border-b">
          <CardTitle className="flex items-center text-sm font-medium text-tanseeq">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-2 gap-2">
          <Button 
            variant="teal" 
            className="rounded-md text-xs flex items-center justify-center h-10"
            onClick={() => navigate('/check-in')}
          >
            <LogIn className="mr-1 h-4 w-4" /> Check-In
          </Button>
          <Button 
            variant="outline" 
            className="rounded-md text-xs border-teal-500 text-teal-500 flex items-center justify-center h-10"
            onClick={() => navigate('/check-out')}
          >
            <LogOut className="mr-1 h-4 w-4" /> Check-Out
          </Button>
        </CardContent>
      </MotionCard>
    </div>
  );
};

export default DashboardCards;

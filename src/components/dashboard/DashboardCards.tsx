import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/hooks/useAttendance';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useProject } from '@/context/ProjectContext';
import { useLocation } from '@/hooks/useLocation';
import { useNavigate } from 'react-router-dom';
import { BarChart4, Info, Users, UserCheck, Clock, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
const MotionCard = motion(Card);
const DashboardCards = () => {
  const {
    currentProject
  } = useProject();
  const {
    stats,
    syncRecords
  } = useAttendance();
  const {
    pendingChanges,
    lastSync,
    isOnline,
    isSyncing,
    syncChanges
  } = useOfflineSync();
  const {
    address,
    isLoading: locationLoading
  } = useLocation();
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
    return <div className="text-center py-8">Please select a project</div>;
  }

  // Check if any employee is missing face enrollment
  const hasMissingFaceEnrollments = currentProject.employees.some(e => !e.isFaceEnrolled);
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
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
  return <div className="space-y-6">
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
      </motion.div>
      
      {/* Date/Time & Sync Card */}
      <MotionCard initial="hidden" animate="visible" custom={0} variants={cardVariants} whileHover={{
      scale: 1.01
    }} transition={{
      duration: 0.2
    }} className="border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">
            {new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          </CardTitle>
          <div>
            {pendingChanges > 0 && <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tanseeq opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tanseeq"></span>
              </span>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold flex items-center">
              <Clock className="h-4 w-4 mr-2 text-tanseeq" />
              {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
            </div>
            <Button onClick={handleSync} disabled={isSyncing || pendingChanges === 0 && lastSync !== null} variant="outline" size="sm" className={`flex items-center gap-2 ${pendingChanges > 0 ? 'animate-pulse-slow bg-tanseeq/10 border-tanseeq/20' : 'bg-background'}`}>
              {isSyncing ? <>
                  <div className="green-loader h-4 w-4 rounded-full"></div>
                  <span>Syncing...</span>
                </> : <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sync text-tanseeq">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                  <span>{pendingChanges ? `Sync (${pendingChanges})` : 'Sync'}</span>
                </>}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {lastSync ? `Last synced: ${new Date(lastSync).toLocaleString()}` : 'Never synced'} · 
            {isOnline ? <span className="text-tanseeq"> Online</span> : <span className="text-amber-500"> Offline</span>}
          </div>
        </CardContent>
      </MotionCard>
      
      {/* Location Card */}
      <MotionCard initial="hidden" animate="visible" custom={1} variants={cardVariants} whileHover={{
      scale: 1.01
    }} transition={{
      duration: 0.2
    }} className="border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tanseeq">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm">
              {locationLoading ? <span className="flex items-center">
                  <div className="green-loader h-3 w-3 rounded-full mr-2"></div>
                  Fetching location...
                </span> : address}
            </span>
          </div>
        </CardContent>
      </MotionCard>
      
      {/* Employees Card */}
      
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MotionCard className="card-stats border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5" initial="hidden" animate="visible" custom={2} variants={cardVariants} whileHover={{
        scale: 1.03
      }} transition={{
        duration: 0.2
      }}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center px-0 py-0">
              <Users className="h-3.5 w-3.5 mr-1 text-tanseeq" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold mx-0">{currentProject.employeeCount}</div>
          </CardContent>
        </MotionCard>
        
        <MotionCard className="card-stats border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5" initial="hidden" animate="visible" custom={3} variants={cardVariants} whileHover={{
        scale: 1.03
      }} transition={{
        duration: 0.2
      }}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <UserCheck className="h-3.5 w-3.5 mr-1 text-tanseeq" />
              Check-Ins Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold">{stats.totalCheckIns}</div>
          </CardContent>
        </MotionCard>
        
        <MotionCard className="card-stats border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5" initial="hidden" animate="visible" custom={4} variants={cardVariants} whileHover={{
        scale: 1.03
      }} transition={{
        duration: 0.2
      }}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <CheckCheck className="h-3.5 w-3.5 mr-1 text-tanseeq" />
              Check-Outs Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold">{stats.totalCheckOuts}</div>
          </CardContent>
        </MotionCard>
        
        <MotionCard className="card-stats border-tanseeq/20 bg-gradient-to-br from-card to-tanseeq/5" initial="hidden" animate="visible" custom={5} variants={cardVariants} whileHover={{
        scale: 1.03
      }} transition={{
        duration: 0.2
      }}>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center">
              <BarChart4 className="h-3.5 w-3.5 mr-1 text-tanseeq" />
              Face Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold">
              {currentProject.employees.filter(e => e.isFaceEnrolled).length}
            </div>
          </CardContent>
        </MotionCard>
      </div>
    </div>;
};
export default DashboardCards;
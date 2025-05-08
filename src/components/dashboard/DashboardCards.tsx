
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/hooks/useAttendance';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useProject } from '@/context/ProjectContext';
import { useLocation } from '@/hooks/useLocation';

const DashboardCards = () => {
  const { currentProject } = useProject();
  const { stats, syncRecords } = useAttendance();
  const { pendingChanges, lastSync, isOnline, isSyncing, syncChanges } = useOfflineSync();
  const { address, isLoading: locationLoading } = useLocation();
  
  const handleSync = async () => {
    await Promise.all([syncRecords(), syncChanges()]);
  };

  if (!currentProject) {
    return <div className="text-center py-8">Please select a project</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{currentProject.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{currentProject.location}</p>
      </div>
      
      {/* Date/Time & Sync Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">
            {new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardTitle>
          <div>
            {pendingChanges > 0 && (
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tanseeq opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tanseeq"></span>
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <Button 
              onClick={handleSync}
              disabled={isSyncing || (pendingChanges === 0 && lastSync !== null)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-background"
            >
              {isSyncing ? (
                <>
                  <div className="green-loader h-4 w-4 rounded-full"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sync">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M8 16H3v5"/>
                  </svg>
                  <span>{pendingChanges ? `Sync (${pendingChanges})` : 'Sync'}</span>
                </>
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {lastSync ? `Last synced: ${new Date(lastSync).toLocaleString()}` : 'Never synced'} · 
            {isOnline ? ' Online' : ' Offline'}
          </div>
        </CardContent>
      </Card>
      
      {/* Location Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm">
              {locationLoading ? 'Fetching location...' : address}
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="card-stats">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold">{currentProject.employeeCount}</div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Check-Ins Today</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold">{stats.totalCheckIns}</div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Check-Outs Today</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold">{stats.totalCheckOuts}</div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Face Enrolled</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="text-2xl font-bold">
              {currentProject.employees.filter(e => e.isFaceEnrolled).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCards;

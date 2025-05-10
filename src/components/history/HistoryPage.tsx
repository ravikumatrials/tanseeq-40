
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceRecord } from '@/data/dummyData';
import { RotateCw, Calendar, User, Briefcase, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays } from 'date-fns';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useProject } from '@/context/ProjectContext';

const HistoryPage = () => {
  const {
    allRecords,
    syncRecords,
    stats
  } = useAttendance();

  const { projects } = useProject();
  
  // Filters
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleSync = async () => {
    setIsSyncing(true);
    await syncRecords();
    setIsSyncing(false);
  };
  
  const handleDatePreset = (days: number) => {
    const date = subDays(new Date(), days);
    setDateFilter(format(date, 'yyyy-MM-dd'));
    setIsFilterOpen(false);
  };

  // Helper function to get project name from project ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Apply filters to records
  const filteredRecords = allRecords.filter(record => {
    const matchesDate = record.date === dateFilter;
    const matchesEmployee = !employeeFilter || 
      record.employeeName.toLowerCase().includes(employeeFilter.toLowerCase()) || 
      record.employeeId.toLowerCase().includes(employeeFilter.toLowerCase());
    const matchesProject = !projectFilter || 
      getProjectName(record.projectId).toLowerCase().includes(projectFilter.toLowerCase());
    const matchesLocation = !locationFilter || 
      record.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesDate && matchesEmployee && matchesProject && matchesLocation;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">History</h2>
        <div className="flex gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Options</h3>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Date</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDatePreset(0)}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDatePreset(1)}>
                      Yesterday
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDatePreset(7)}>
                      Last 7 Days
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDatePreset(30)}>
                      Last 30 Days
                    </Button>
                  </div>
                  <Input 
                    type="date" 
                    value={dateFilter} 
                    onChange={e => setDateFilter(e.target.value)} 
                    className="w-full" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Employee ID/Name</div>
                  <Input 
                    placeholder="Search by ID or name..." 
                    value={employeeFilter}
                    onChange={e => setEmployeeFilter(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Project</div>
                  <Input 
                    placeholder="Filter by project..." 
                    value={projectFilter}
                    onChange={e => setProjectFilter(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Location</div>
                  <Input 
                    placeholder="Filter by location..." 
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-tanseeq hover:bg-tanseeq/90" 
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 whitespace-nowrap" 
            onClick={handleSync} 
            disabled={isSyncing || stats.totalNotSynced === 0}
          >
            {isSyncing ? (
              <>
                <div className="green-loader h-4 w-4 rounded-full"></div>
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4" />
                <span>Sync</span>
                {stats.totalNotSynced > 0 && <span className="ml-1">({stats.totalNotSynced})</span>}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="text-xs text-muted-foreground mb-1">Check-Ins</div>
          <div className="font-bold text-lg">{stats.totalCheckIns}</div>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="text-xs text-muted-foreground mb-1">Check-Outs</div>
          <div className="font-bold text-lg">{stats.totalCheckOuts}</div>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="text-xs text-muted-foreground mb-1">Synced</div>
          <div className="font-bold text-lg">{stats.totalSynced}</div>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="text-xs text-muted-foreground mb-1">Not Synced</div>
          <div className="font-bold text-lg">{stats.totalNotSynced}</div>
        </Card>
      </div>
      
      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="text-sm font-medium">Active Filters:</div>
        <div className="flex flex-wrap gap-2">
          <div className="text-sm bg-tanseeq/10 text-tanseeq px-3 py-1 rounded-full flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(dateFilter), 'MMM d, yyyy')}</span>
          </div>
          {employeeFilter && (
            <div className="text-sm bg-tanseeq/10 text-tanseeq px-3 py-1 rounded-full flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Employee: {employeeFilter}</span>
            </div>
          )}
          {projectFilter && (
            <div className="text-sm bg-tanseeq/10 text-tanseeq px-3 py-1 rounded-full flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              <span>Project: {projectFilter}</span>
            </div>
          )}
          {locationFilter && (
            <div className="text-sm bg-tanseeq/10 text-tanseeq px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Location: {locationFilter}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No records found for selected filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map(record => <AttendanceRecordItem key={record.id} record={record} />)}
        </div>
      )}
    </div>
  );
};

const AttendanceRecordItem: React.FC<{
  record: AttendanceRecord;
}> = ({ record }) => {
  const { projects } = useProject();
  
  const formatTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleTimeString();
  };
  
  // Get project name from projectId
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="p-4 rounded-lg border flex items-start space-x-3 bg-card">
      <div className="flex-1">
        <div className="font-medium">{record.employeeName}</div>
        <div className="text-sm text-muted-foreground">{record.employeeId}</div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <div className="text-xs text-muted-foreground">Check-in</div>
            <div className="text-sm">{formatTime(record.checkInTime)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Check-out</div>
            <div className="text-sm">{formatTime(record.checkOutTime)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="text-sm truncate max-w-[140px]">{record.location}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Sync Status</div>
            <div className={`text-sm ${record.isSynced ? 'text-tanseeq' : 'text-amber-500'}`}>
              {record.isSynced ? 'Synced' : 'Not Synced'}
            </div>
          </div>
        </div>
        
        {/* Added Project details section */}
        <div className="mt-2 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Project:</div>
            <div className="text-sm font-medium">{getProjectName(record.projectId)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

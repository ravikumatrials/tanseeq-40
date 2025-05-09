
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceRecord } from '@/data/dummyData';

const HistoryPage = () => {
  const { allRecords, syncRecords, stats } = useAttendance();
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'checkin', 'checkout'
  const [syncFilter, setSyncFilter] = useState('all'); // 'all', 'synced', 'notsynced'
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    setIsSyncing(true);
    await syncRecords();
    setIsSyncing(false);
  };
  
  // Apply filters to records
  const filteredRecords = allRecords.filter(record => {
    const matchesDate = record.date === dateFilter;
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'checkin' && record.checkInTime) ||
      (statusFilter === 'checkout' && record.checkOutTime);
    
    const matchesSync =
      syncFilter === 'all' ||
      (syncFilter === 'synced' && record.isSynced) ||
      (syncFilter === 'notsynced' && !record.isSynced);
    
    return matchesDate && matchesStatus && matchesSync;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance History</h2>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sync">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
              <span>Sync</span>
              {stats.totalNotSynced > 0 && <span className="ml-1">({stats.totalNotSynced})</span>}
            </>
          )}
        </Button>
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
      
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex-1">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="checkin">Check-in</SelectItem>
            <SelectItem value="checkout">Check-out</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={syncFilter} onValueChange={setSyncFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sync Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="synced">Synced</SelectItem>
            <SelectItem value="notsynced">Not Synced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No records found for selected filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map(record => (
            <AttendanceRecordItem key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
};

const AttendanceRecordItem: React.FC<{ record: AttendanceRecord }> = ({ record }) => {
  const formatTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleTimeString();
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
      </div>
    </div>
  );
};

export default HistoryPage;

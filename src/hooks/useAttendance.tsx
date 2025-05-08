
import { useState, useEffect } from 'react';
import { AttendanceRecord, Exception, dummyAttendance, dummyExceptions } from '../data/dummyData';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

interface AttendanceData {
  todayRecords: AttendanceRecord[];
  allRecords: AttendanceRecord[];
  exceptions: Exception[];
  stats: {
    totalCheckIns: number;
    totalCheckOuts: number;
    totalSynced: number;
    totalNotSynced: number;
  };
  isLoading: boolean;
}

export const useAttendance = () => {
  const { currentProject } = useProject();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<AttendanceData>({
    todayRecords: [],
    allRecords: [],
    exceptions: [],
    stats: {
      totalCheckIns: 0,
      totalCheckOuts: 0,
      totalSynced: 0,
      totalNotSynced: 0
    },
    isLoading: true
  });

  // Load data when project changes
  useEffect(() => {
    if (!isAuthenticated || !currentProject) {
      return;
    }

    // Filter data for current project
    const projectRecords = dummyAttendance.filter(
      record => record.projectId === currentProject.id
    );

    // Get today's date for filtering
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = projectRecords.filter(
      record => record.date === today
    );

    // Calculate stats
    const totalCheckIns = todayRecords.length;
    const totalCheckOuts = todayRecords.filter(record => record.checkOutTime).length;
    const totalSynced = todayRecords.filter(record => record.isSynced).length;
    const totalNotSynced = todayRecords.length - totalSynced;

    // Filter exceptions for current project
    const projectExceptions = dummyExceptions.filter(
      exception => exception.projectId === currentProject.id
    );

    setData({
      todayRecords,
      allRecords: projectRecords,
      exceptions: projectExceptions,
      stats: {
        totalCheckIns,
        totalCheckOuts,
        totalSynced,
        totalNotSynced
      },
      isLoading: false
    });
  }, [currentProject, isAuthenticated]);

  // Add a check-in record
  const addCheckIn = (employeeId: string, employeeName: string, location: string) => {
    if (!currentProject) return;

    const now = new Date();
    const checkInTime = now.toISOString();
    const date = now.toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `A${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      employeeName,
      checkInTime,
      checkOutTime: null,
      projectId: currentProject.id,
      location,
      date,
      isSynced: false
    };

    setData(prev => ({
      ...prev,
      todayRecords: [...prev.todayRecords, newRecord],
      allRecords: [...prev.allRecords, newRecord],
      stats: {
        ...prev.stats,
        totalCheckIns: prev.stats.totalCheckIns + 1,
        totalNotSynced: prev.stats.totalNotSynced + 1
      }
    }));

    return newRecord;
  };

  // Add a check-out record (update existing record)
  const addCheckOut = (employeeId: string) => {
    if (!currentProject) return;

    const now = new Date();
    const checkOutTime = now.toISOString();
    
    setData(prev => {
      // Find the record to update
      const todayRecords = [...prev.todayRecords];
      const allRecords = [...prev.allRecords];
      
      const recordIndex = todayRecords.findIndex(
        r => r.employeeId === employeeId && !r.checkOutTime
      );
      
      if (recordIndex >= 0) {
        todayRecords[recordIndex] = {
          ...todayRecords[recordIndex],
          checkOutTime,
          isSynced: false
        };
        
        // Also update in allRecords
        const allIndex = allRecords.findIndex(r => r.id === todayRecords[recordIndex].id);
        if (allIndex >= 0) {
          allRecords[allIndex] = todayRecords[recordIndex];
        }

        return {
          ...prev,
          todayRecords,
          allRecords,
          stats: {
            ...prev.stats,
            totalCheckOuts: prev.stats.totalCheckOuts + 1,
            totalNotSynced: prev.stats.totalNotSynced + 1
          },
          // Remove from exceptions if exists
          exceptions: prev.exceptions.filter(e => e.employeeId !== employeeId)
        };
      }
      
      return prev;
    });
  };

  // Update exception (manually set check-out time)
  const resolveException = (exceptionId: string, checkOutTime: string) => {
    setData(prev => {
      // Find exception
      const exceptionIndex = prev.exceptions.findIndex(e => e.id === exceptionId);
      if (exceptionIndex < 0) return prev;
      
      const exception = prev.exceptions[exceptionIndex];
      
      // Update corresponding attendance record
      const allRecords = [...prev.allRecords];
      const recordIndex = allRecords.findIndex(
        r => r.employeeId === exception.employeeId && 
             r.date === exception.date && 
             !r.checkOutTime
      );
      
      if (recordIndex >= 0) {
        allRecords[recordIndex] = {
          ...allRecords[recordIndex],
          checkOutTime,
          isSynced: false
        };
      }
      
      // Update today records if applicable
      const today = new Date().toISOString().split('T')[0];
      let todayRecords = [...prev.todayRecords];
      if (exception.date === today) {
        const todayIndex = todayRecords.findIndex(
          r => r.employeeId === exception.employeeId && !r.checkOutTime
        );
        
        if (todayIndex >= 0) {
          todayRecords[todayIndex] = {
            ...todayRecords[todayIndex],
            checkOutTime,
            isSynced: false
          };
        }
      }
      
      // Remove from exceptions
      const exceptions = prev.exceptions.filter(e => e.id !== exceptionId);
      
      return {
        ...prev,
        todayRecords,
        allRecords,
        exceptions,
        stats: {
          ...prev.stats,
          totalCheckOuts: recordIndex >= 0 ? prev.stats.totalCheckOuts + 1 : prev.stats.totalCheckOuts,
          totalNotSynced: prev.stats.totalNotSynced + 1
        }
      };
    });
  };

  // Sync records that haven't been synced
  const syncRecords = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setData(prev => {
      const todayRecords = prev.todayRecords.map(r => ({ ...r, isSynced: true }));
      const allRecords = prev.allRecords.map(r => ({ ...r, isSynced: true }));
      
      return {
        ...prev,
        todayRecords,
        allRecords,
        stats: {
          ...prev.stats,
          totalSynced: prev.stats.totalCheckIns,
          totalNotSynced: 0
        }
      };
    });
    
    return true;
  };

  return {
    ...data,
    addCheckIn,
    addCheckOut,
    resolveException,
    syncRecords
  };
};

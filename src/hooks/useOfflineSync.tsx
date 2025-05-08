
import { useState, useEffect } from 'react';

interface SyncStats {
  lastSync: Date | null;
  pendingChanges: number;
  isOnline: boolean;
  isSyncing: boolean;
}

export const useOfflineSync = () => {
  const [stats, setStats] = useState<SyncStats>({
    lastSync: null,
    pendingChanges: 0,
    isOnline: navigator.onLine,
    isSyncing: false
  });

  // Track online status
  useEffect(() => {
    const handleOnline = () => setStats(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStats(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update pending changes (simulated)
  useEffect(() => {
    // In a real app, we'd track changes that need to be synced
    const pendingKey = 'offlinePendingChanges';
    const lastSyncKey = 'lastSyncTime';
    
    const savedPending = localStorage.getItem(pendingKey);
    const savedLastSync = localStorage.getItem(lastSyncKey);
    
    if (savedPending) {
      setStats(prev => ({ ...prev, pendingChanges: parseInt(savedPending, 10) }));
    }
    
    if (savedLastSync) {
      setStats(prev => ({ ...prev, lastSync: new Date(savedLastSync) }));
    }
  }, []);

  const addPendingChange = () => {
    setStats(prev => {
      const newPending = prev.pendingChanges + 1;
      localStorage.setItem('offlinePendingChanges', newPending.toString());
      return { ...prev, pendingChanges: newPending };
    });
  };

  const syncChanges = async (): Promise<boolean> => {
    if (!stats.isOnline || stats.pendingChanges === 0) {
      return false;
    }
    
    setStats(prev => ({ ...prev, isSyncing: true }));
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats(prev => {
        const now = new Date();
        localStorage.setItem('lastSyncTime', now.toISOString());
        localStorage.setItem('offlinePendingChanges', '0');
        
        return {
          ...prev,
          lastSync: now,
          pendingChanges: 0,
          isSyncing: false
        };
      });
      
      return true;
    } catch (error) {
      setStats(prev => ({ ...prev, isSyncing: false }));
      return false;
    }
  };

  return {
    ...stats,
    addPendingChange,
    syncChanges
  };
};

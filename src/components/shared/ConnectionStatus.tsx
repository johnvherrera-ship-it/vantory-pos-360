import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle } from 'lucide-react';
import { networkService } from '../../services/networkService';
import { queueService } from '../../services/queueService';

export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(networkService.isConnected());
  const [pendingOps, setPendingOps] = useState(0);

  useEffect(() => {
    const unsubscribe = networkService.subscribe((online) => {
      setIsOnline(online);
    });

    const interval = setInterval(() => {
      setPendingOps(queueService.getPendingCount());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (isOnline && pendingOps === 0) {
    return (
      <div className="fixed bottom-20 md:bottom-0 right-4 flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-xs text-green-700 z-30 hidden md:flex">
        <Wifi className="w-4 h-4" />
        Conectado
      </div>
    );
  }

  return (
    <div className={`fixed ${isOnline ? 'bottom-20 md:bottom-0' : 'top-0'} left-0 right-0 md:bottom-0 md:right-4 md:w-auto z-50 ${!isOnline ? 'md:rounded-lg' : ''}`}>
      {!isOnline ? (
        <div className="bg-red-50 border-b md:border border-red-200 px-4 py-3 md:rounded-lg text-red-700 flex items-center gap-3">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Sin conexión a internet</p>
            <p className="text-xs opacity-90">Tus cambios se guardarán cuando se restablezca la conexión</p>
          </div>
        </div>
      ) : pendingOps > 0 ? (
        <div className="bg-blue-50 border border-blue-200 px-4 py-2 md:rounded-lg text-blue-700 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 animate-pulse" />
          <span>Sincronizando {pendingOps} operación{pendingOps > 1 ? 'es' : ''}...</span>
        </div>
      ) : null}
    </div>
  );
};

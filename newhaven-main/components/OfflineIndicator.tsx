'use client';

import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showToast) return null;

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-slide-down ${
      isOnline 
        ? 'bg-gray-900 text-white' 
        : 'bg-red-600 text-white'
    }`}>
      <i className={`text-xl ${isOnline ? 'ri-wifi-line' : 'ri-wifi-off-line'}`}></i>
      <span className="font-medium whitespace-nowrap">
        {isOnline ? 'Back Online!' : 'You are Offline'}
      </span>
    </div>
  );
}
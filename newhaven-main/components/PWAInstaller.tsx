'use client';

import { useEffect, useState } from 'react';

export default function PWAInstaller() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkInstallation();

    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  return null;
}
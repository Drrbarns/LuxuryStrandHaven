'use client';

import { useState, useEffect } from 'react';

export default function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowPrompt(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-white rounded-xl shadow-2xl p-6 border border-gray-200 animate-slide-up max-w-md w-full mx-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <i className="ri-download-cloud-line text-2xl text-gray-800"></i>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2">Update Available! 🎉</h3>
          <p className="text-sm text-gray-600 mb-4">
            A new version of the app is available with improvements and bug fixes. Update now for the best experience!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-gray-800 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <i className="ri-close-line"></i>
        </button>
      </div>
    </div>
  );
}
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const VIDEO_EXTENSIONS = ['.mov', '.mp4', '.webm', '.avi', '.m4v'];

function isVideoUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return VIDEO_EXTENSIONS.some(ext => pathname.endsWith(ext));
  } catch {
    return VIDEO_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext));
  }
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  sizes?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setAutoplayFailed(true);
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
      return () => video.removeEventListener('loadeddata', tryPlay);
    }
  }, [src]);

  const handleTapPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => {
      setAutoplayFailed(false);
    }).catch(() => {});
  }, []);

  const isVideo = src ? isVideoUrl(src) : false;

  if (!src || (hasError && !isVideo)) {
    return (
      <div className={`relative overflow-hidden bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  if (hasError && isVideo) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex flex-col items-center justify-center ${className}`} style={{ width, height }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400 mb-1">
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-gray-400 text-[10px]">Video</span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-10"></div>
        )}
        <video
          ref={videoRef}
          src={src}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={handleLoad}
          onError={handleError}
        />
        {isLoaded && autoplayFailed && (
          <button
            onClick={handleTapPlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/20"
            aria-label="Play video"
          >
            <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-0.5">
                <path d="M5 3.5L16 10L5 16.5V3.5Z" fill="#111" />
              </svg>
            </span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10"></div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        quality={75}
      />
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipForward, SkipBack, Loader2 } from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  title?: string;
  isLive?: boolean;
}

export function VideoPlayer({ src, poster, autoPlay = false, title, isLive = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (autoPlay && video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay]);

  const handleProgress = () => {
    if (videoRef.current && videoRef.current.duration > 0) {
      const video = videoRef.current;
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        setBuffered((bufferedEnd / duration) * 100);
      }
    }
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };


  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      // Ignore AbortError which happens if video is paused while playing
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Playback error:", error);
      }
      setIsPlaying(!video.paused);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverPosition(pos * 100);
      setHoverTime(pos * duration);
    }
  };

  const handleProgressBarLeave = () => {
    setHoverTime(null);
    setHoverPosition(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Hide controls after 3 seconds of inactivity if playing
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Short delay before hiding when mouse leaves
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative group w-full aspect-video bg-black overflow-hidden rounded-xl shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onProgress={handleProgress}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onPlaying={() => setIsLoading(false)}
        onClick={togglePlay}
        onPlay={() => {
           // Ensure controls fade out when playback starts (if mouse isn't moving)
           if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
           controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }}
      />

      {/* Overlay Gradient */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Loading Spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Button */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 shadow-xl">
              <Play className="w-12 h-12 text-white fill-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4"
          >
            {/* Progress Bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative group/progress"
              onMouseMove={handleProgressBarHover}
              onMouseLeave={handleProgressBarLeave}
            >
              {/* Buffered Bar */}
              <div 
                className="absolute top-0 left-0 h-full bg-white/40 rounded-full transition-all duration-300"
                style={{ width: `${buffered}%` }}
              />
              
              <div 
                className="absolute top-0 left-0 h-full bg-red-600 rounded-full relative z-10"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
              
              {/* Hover Tooltip */}
              {hoverTime !== null && hoverPosition !== null && (
                <div 
                  className="absolute bottom-4 -translate-x-1/2 bg-black/90 text-white text-xs font-mono px-2 py-1 rounded border border-white/10 shadow-lg pointer-events-none z-20 whitespace-nowrap"
                  style={{ left: `${hoverPosition}%` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={skipBackward} className="text-white hover:text-red-500 transition-colors" title="Rewind 10s">
                  <SkipBack className="w-6 h-6 fill-current" />
                </button>
                
                <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </button>

                <button onClick={skipForward} className="text-white hover:text-red-500 transition-colors" title="Forward 10s">
                  <SkipForward className="w-6 h-6 fill-current" />
                </button>
                
                <div className="flex items-center gap-2 group/volume ml-2">
                  <button onClick={toggleMute} className="text-white hover:text-gray-300">
                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={isMuted ? 0 : volume} 
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                </div>

                <div className="text-white/80 font-mono text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                
                {isLive && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/50 rounded-full">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-red-500 text-xs font-bold tracking-wider uppercase">Live</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {title && <h3 className="text-white font-medium hidden md:block">{title}</h3>}
                <button className="text-white hover:text-gray-300">
                  <Settings className="w-6 h-6" />
                </button>
                <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

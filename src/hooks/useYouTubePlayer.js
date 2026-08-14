import { useState, useRef, useEffect, useCallback } from 'react';
import playlistData from '@/data/playlist.json';

export default function useYouTubePlayer() {
  const [playlist] = useState(playlistData);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Track history for previous button
  const historyRef = useRef([]);
  const playerRef = useRef(null);

  const setPlayerInstance = useCallback((instance) => {
    playerRef.current = instance;
  }, []);

  const pickTrack = useCallback((index) => {
    if (index >= 0 && index < playlist.length) {
      // Push current track to history before switching
      if (currentIndex >= 0) {
        historyRef.current.push(currentIndex);
        // Keep history manageable (last 50 tracks)
        if (historyRef.current.length > 50) {
          historyRef.current.shift();
        }
      }
      setCurrentIndex(index);
      setCurrentTrack(playlist[index]);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [playlist, currentIndex]);

  const playRandom = useCallback(() => {
    if (playlist.length === 0) return;
    let nextIndex;
    if (playlist.length === 1) {
      nextIndex = 0;
    } else {
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentIndex);
    }
    pickTrack(nextIndex);
  }, [playlist, currentIndex, pickTrack]);

  const togglePlay = useCallback(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const skip = useCallback(() => {
    playRandom();
  }, [playRandom]);

  // NEW: Go to previous track
  const previous = useCallback(() => {
    if (historyRef.current.length > 0) {
      const prevIndex = historyRef.current.pop();
      // Don't push to history when going back
      setCurrentIndex(prevIndex);
      setCurrentTrack(playlist[prevIndex]);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [playlist]);

  // Progress tracking interval
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        try {
          const time = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          
          if (dur > 0) {
            setCurrentTime(time);
            setDuration(dur);
            setProgress((time / dur) * 100);
          }
        } catch (error) {
          // Player might not be ready yet
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return {
    currentTrack,
    currentIndex,
    isPlaying,
    progress,
    duration,
    currentTime,
    playlist,
    pickTrack,
    playRandom,
    togglePlay,
    skip,
    previous,
    hasHistory: historyRef.current.length > 0,
    playerRef,
    setPlayerInstance
  };
}

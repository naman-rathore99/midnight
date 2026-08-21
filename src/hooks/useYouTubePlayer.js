import { useState, useRef, useEffect, useCallback } from 'react';

export default function useYouTubePlayer() {
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackTitle, setTrackTitle] = useState('');
  
  const playerRef = useRef(null);

  const setPlayerInstance = useCallback((instance) => {
    playerRef.current = instance;
    if (currentPlaylist) {
      instance.loadPlaylist({ list: currentPlaylist.playlist_id });
    }
  }, [currentPlaylist]);

  const pickPlaylist = useCallback((playlist) => {
    setCurrentPlaylist(playlist);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (playerRef.current) {
      playerRef.current.loadPlaylist({ list: playlist.playlist_id });
    }
  }, []);

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
    if (playerRef.current) {
      playerRef.current.nextVideo();
    }
  }, []);

  const previous = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.previousVideo();
    }
  }, []);

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
        } catch (error) {}
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return {
    currentPlaylist,
    isPlaying,
    progress,
    duration,
    currentTime,
    trackTitle,
    pickPlaylist,
    togglePlay,
    skip,
    previous,
    playerRef,
    setPlayerInstance
  };
}


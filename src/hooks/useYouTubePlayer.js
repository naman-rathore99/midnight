import { useState, useRef, useEffect, useCallback } from 'react';
import playlistData from '@/data/playlist.json';

export default function useYouTubePlayer() {
  const [mainPlaylist] = useState(playlistData);
  const [customPlaylist, setCustomPlaylist] = useState([]);
  const [activePlaylistType, setActivePlaylistType] = useState('main'); // 'main' or 'custom'
  
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Track history for previous button
  const historyRef = useRef([]);
  const playerRef = useRef(null);

  // Load custom playlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('midnight-custom-playlist');
      if (saved) {
        setCustomPlaylist(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCustomPlaylist = (newPlaylist) => {
    setCustomPlaylist(newPlaylist);
    try {
      localStorage.setItem('midnight-custom-playlist', JSON.stringify(newPlaylist));
    } catch (e) {
      console.error(e);
    }
  };

  const addToCustomPlaylist = (track) => {
    // avoid duplicates by ID
    if (!customPlaylist.find(t => t.id === track.id)) {
      saveCustomPlaylist([...customPlaylist, track]);
    }
  };

  const removeFromCustomPlaylist = (id) => {
    saveCustomPlaylist(customPlaylist.filter(t => t.id !== id));
  };

  const setPlayerInstance = useCallback((instance) => {
    playerRef.current = instance;
  }, []);

  const getActivePlaylist = useCallback(() => {
    return activePlaylistType === 'main' ? mainPlaylist : customPlaylist;
  }, [activePlaylistType, mainPlaylist, customPlaylist]);

  const pickTrack = useCallback((index, type = 'main') => {
    const list = type === 'main' ? mainPlaylist : customPlaylist;
    if (index >= 0 && index < list.length) {
      if (currentIndex >= 0) {
        historyRef.current.push({ index: currentIndex, type: activePlaylistType });
        if (historyRef.current.length > 50) historyRef.current.shift();
      }
      setActivePlaylistType(type);
      setCurrentIndex(index);
      setCurrentTrack(list[index]);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [mainPlaylist, customPlaylist, currentIndex, activePlaylistType]);

  const playRandom = useCallback(() => {
    const list = getActivePlaylist();
    if (list.length === 0) {
      // Fallback to main if custom is empty
      if (activePlaylistType === 'custom' && mainPlaylist.length > 0) {
        pickTrack(0, 'main');
      }
      return;
    }
    
    let nextIndex;
    if (list.length === 1) {
      nextIndex = 0;
    } else {
      do {
        nextIndex = Math.floor(Math.random() * list.length);
      } while (nextIndex === currentIndex);
    }
    pickTrack(nextIndex, activePlaylistType);
  }, [getActivePlaylist, activePlaylistType, mainPlaylist, currentIndex, pickTrack]);

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

  const previous = useCallback(() => {
    if (historyRef.current.length > 0) {
      const prev = historyRef.current.pop();
      const list = prev.type === 'main' ? mainPlaylist : customPlaylist;
      
      setActivePlaylistType(prev.type);
      setCurrentIndex(prev.index);
      setCurrentTrack(list[prev.index]);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [mainPlaylist, customPlaylist]);

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
    currentTrack,
    currentIndex,
    isPlaying,
    progress,
    duration,
    currentTime,
    
    mainPlaylist,
    customPlaylist,
    activePlaylistType,
    
    addToCustomPlaylist,
    removeFromCustomPlaylist,
    
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

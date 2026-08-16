'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import useYouTubePlayer from '@/hooks/useYouTubePlayer';
import { useShayari } from '@/hooks/useShayari';
import usePresence from '@/hooks/usePresence';

import YouTubeEngine from '@/components/YouTubeEngine/YouTubeEngine';
import CinematicBackground from '@/components/CinematicBackground/CinematicBackground';
import StarField from '@/components/StarField/StarField';
import SongPicker from '@/components/SongPicker/SongPicker';
import MusicPlayer from '@/components/MusicPlayer/MusicPlayer';
import ShayariDisplay from '@/components/ShayariDisplay/ShayariDisplay';
import ShayariInput from '@/components/ShayariInput/ShayariInput';
import LyricsDisplay from '@/components/LyricsDisplay/LyricsDisplay';
import SuggestSongInput from '@/components/SuggestSongInput/SuggestSongInput';

import styles from './page.module.css';

const THEMES = [
  'hrtc-bus-window',
  'indian-highway-truck',
  'cutting-chai-rain',
  'rooftop-mehfil',
  'dj-rakesh-dance',
  'sadabahar-charpai'
];

export default function Home() {
  // -- Player state --
  const {
    currentTrack,
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
    togglePlay,
    skip,
    previous,
    setPlayerInstance,
  } = useYouTubePlayer();

  // -- Shayari state --
  const { currentShayari, isVisible, loading, likeShayari, triggerRotation } = useShayari();

  // -- Presence state --
  usePresence();

  // -- UI state --
  const [showPicker, setShowPicker] = useState(true);
  const [showShayariInput, setShowShayariInput] = useState(false);
  const [showSuggestInput, setShowSuggestInput] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());
  const [themeIndex, setThemeIndex] = useState(0);

  // Load liked IDs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('midnight-radio-liked');
      if (saved) {
        setLikedIds(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handlePickSong = useCallback(
    (index, type) => {
      pickTrack(index, type);
      setShowPicker(false);
      // Show shayari when first song plays
      setTimeout(() => triggerRotation(), 1500);
    },
    [pickTrack, triggerRotation]
  );

  // Handle track end → play random + show shayari
  const handleTrackEnd = useCallback(() => {
    skip();
    triggerRotation();
  }, [skip, triggerRotation]);

  // Handle skip → also show shayari
  const handleSkip = useCallback(() => {
    skip();
    triggerRotation();
  }, [skip, triggerRotation]);

  // Handle previous
  const handlePrevious = useCallback(() => {
    previous();
    triggerRotation();
  }, [previous, triggerRotation]);

  // Handle YouTube player ready
  const handlePlayerReady = useCallback(
    (playerInstance) => {
      setPlayerInstance(playerInstance);
    },
    [setPlayerInstance]
  );

  // Handle like
  const handleLike = useCallback(
    (id) => {
      likeShayari(id);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        try {
          localStorage.setItem('midnight-radio-liked', JSON.stringify([...next]));
        } catch (e) {
          // ignore
        }
        return next;
      });
    },
    [likeShayari]
  );

  // Handle shayari submit
  const handleShayariSubmit = useCallback(async ({ text, author }) => {
    try {
      await fetch('/api/shayari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author: author || 'Unknown' }),
      });
      setShowShayariInput(false);
    } catch (e) {
      console.error('Failed to submit shayari:', e);
    }
  }, []);

  // Handle song suggestion submit
  const handleSuggestSubmit = useCallback(async ({ link, author }) => {
    try {
      await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link, author }),
      });
      setShowSuggestInput(false);
      // Optional: show a toast notification here
    } catch (e) {
      console.error('Failed to submit song suggestion:', e);
    }
  }, []);

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  return (
    <>
      {/* V2 Mind-Blowing Infinite Parallax Backgrounds */}
      <CinematicBackground theme={THEMES[themeIndex]} />

      {/* Star Field — ambient particles */}
      <StarField />

      {/* Hidden YouTube Player */}
      {currentTrack && (
        <YouTubeEngine
          videoId={currentTrack.id}
          onReady={handlePlayerReady}
          onEnd={handleTrackEnd}
          onStateChange={() => {}}
        />
      )}

      {/* Song Picker Modal — shown on first visit */}
      <SongPicker
        mainPlaylist={mainPlaylist}
        customPlaylist={customPlaylist}
        onPickSong={handlePickSong}
        onAddCustom={addToCustomPlaylist}
        onRemoveCustom={removeFromCustomPlaylist}
        isOpen={showPicker}
      />

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Shayari Display (Left-aligned typography) */}
        <ShayariDisplay
          shayari={currentShayari}
          onLike={handleLike}
          liked={currentShayari ? likedIds.has(currentShayari.id) : false}
          isVisible={isVisible && !showPicker}
        />
        
        {/* Lyrics or Track Info (Right-aligned) */}
        <AnimatePresence>
          {!showPicker && (
            <motion.div
              className={styles.rightContentArea}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <LyricsDisplay 
                lyrics={currentTrack?.lyrics} 
                currentTime={currentTime} 
                track={currentTrack}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand watermark & Scene Switcher */}
        <AnimatePresence>
          {!showPicker && (
            <motion.div
              className={styles.topBar}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className={styles.watermark}>
                <span className={styles.watermarkIcon}>🌙</span>
                <span className={styles.watermarkText}>Midnight Radio</span>
              </div>
              
              <div className={styles.topBarRight}>
                <a href="https://ko-fi.com/cc4cc5bb-33f1-4ac6-a7e2-e180ae640a95" target="_blank" rel="noopener noreferrer" className={styles.topKofiBtn} title="Support on Ko-fi">
                  ☕
                </a>
                <a href="https://github.com/naman-rathore99/midnight" target="_blank" rel="noopener noreferrer" className={styles.topGithubBtn} title="Contribute on GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <button onClick={cycleTheme} className={styles.sceneBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17 2 12 7 7 2" />
                  </svg>
                  Change Scene
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shayari Input FAB */}
        <AnimatePresence>
          {!showPicker && (
            <div className={styles.fabContainer}>
              <motion.button
                className={styles.fab}
                onClick={() => setShowSuggestInput(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Suggest a song"
                title="Suggest a song"
              >
                🎵
              </motion.button>
              <motion.button
                className={styles.fab}
                onClick={() => setShowShayariInput(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 2.1, type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Share a thought"
                title="Drop a thought"
              >
                ✍️
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Shayari Input Modal */}
      <ShayariInput
        isOpen={showShayariInput}
        onClose={() => setShowShayariInput(false)}
        onSubmit={handleShayariSubmit}
      />

      {/* Suggest Song Input Modal */}
      <SuggestSongInput
        isOpen={showSuggestInput}
        onClose={() => setShowSuggestInput(false)}
        onSubmit={handleSuggestSubmit}
      />

      {/* Music Player Bar */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={togglePlay}
        onSkip={handleSkip}
        onPrevious={handlePrevious}
      />
    </>
  );
}

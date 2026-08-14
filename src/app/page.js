'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import useYouTubePlayer from '@/hooks/useYouTubePlayer';
import { useShayari } from '@/hooks/useShayari';

import YouTubeEngine from '@/components/YouTubeEngine/YouTubeEngine';
import CinematicBackground from '@/components/CinematicBackground/CinematicBackground';
import StarField from '@/components/StarField/StarField';
import SongPicker from '@/components/SongPicker/SongPicker';
import MusicPlayer from '@/components/MusicPlayer/MusicPlayer';
import ShayariDisplay from '@/components/ShayariDisplay/ShayariDisplay';
import ShayariInput from '@/components/ShayariInput/ShayariInput';
import LyricsDisplay from '@/components/LyricsDisplay/LyricsDisplay';

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
    playlist,
    pickTrack,
    togglePlay,
    skip,
    previous,
    setPlayerInstance,
  } = useYouTubePlayer();

  // -- Shayari state --
  const { currentShayari, isVisible, loading, likeShayari, triggerRotation } = useShayari();

  // -- UI state --
  const [showPicker, setShowPicker] = useState(true);
  const [showShayariInput, setShowShayariInput] = useState(false);
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

  // Handle first song pick
  const handlePickSong = useCallback(
    (index) => {
      pickTrack(index);
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
        playlist={playlist}
        onPickSong={handlePickSong}
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
              
              <button onClick={cycleTheme} className={styles.sceneBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
                Change Scene
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shayari Input FAB */}
        <AnimatePresence>
          {!showPicker && (
            <motion.button
              className={styles.fab}
              onClick={() => setShowShayariInput(true)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Share a thought"
              title="Drop a thought"
            >
              ✍️
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      {/* Shayari Input Modal */}
      <ShayariInput
        isOpen={showShayariInput}
        onClose={() => setShowShayariInput(false)}
        onSubmit={handleShayariSubmit}
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

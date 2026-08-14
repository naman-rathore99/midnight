'use client';

import { motion, AnimatePresence } from 'motion/react';
import styles from './MusicPlayer.module.css';
import ProgressBar from './ProgressBar';

export default function MusicPlayer({
  currentTrack,
  isPlaying,
  progress,
  currentTime,
  duration,
  onTogglePlay,
  onSkip,
  onPrevious
}) {
  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.playerBar}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={styles.content}>
          <div className={styles.trackInfoWrapper}>
            <div className={`${styles.vinyl} ${isPlaying ? styles.spinning : ''}`}>
              <img
                src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                alt="cover"
                className={styles.cover}
              />
              <div className={styles.hole} />
            </div>
            <div className={styles.trackInfo}>
              <div className={styles.title}>{currentTrack.title || 'Unknown Title'}</div>
              <div className={styles.artist}>{currentTrack.artist || 'Unknown Artist'}</div>
            </div>
          </div>

          <div className={styles.controlsWrapper}>
            <div className={styles.controls}>
              <button className={styles.glassBtn} onClick={onPrevious} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5"></line>
                </svg>
              </button>
              <button className={styles.playBtn} onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
              <button className={styles.glassBtn} onClick={onSkip} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.progressWrapper}>
            <ProgressBar
              progress={progress}
              currentTime={currentTime}
              duration={duration}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

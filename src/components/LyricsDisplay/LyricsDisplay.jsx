'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './LyricsDisplay.module.css';

export default function LyricsDisplay({ lyrics, currentTime }) {
  if (!lyrics || lyrics.length === 0) return null;

  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      if (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time) {
        activeIndex = i;
        break;
      }
    }
  }

  // Display a sliding window of lyrics: previous line, active line, next 2 lines
  const windowStart = Math.max(0, activeIndex - 1);
  const windowEnd = Math.min(lyrics.length - 1, activeIndex + 2);
  
  const visibleLyrics = [];
  for (let i = windowStart; i <= windowEnd; i++) {
    visibleLyrics.push({ ...lyrics[i], originalIndex: i });
  }

  return (
    <div className={styles.container}>
      <AnimatePresence mode="popLayout">
        {visibleLyrics.map((lyric) => {
          const isActive = lyric.originalIndex === activeIndex;
          
          return (
            <motion.div
              key={lyric.originalIndex}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isActive ? 1 : 0.3, 
                y: 0,
                scale: isActive ? 1.05 : 1,
                color: isActive ? '#e2b714' : '#e8e8e8'
              }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className={`${styles.lyricLine} ${isActive ? styles.active : ''}`}
            >
              {lyric.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

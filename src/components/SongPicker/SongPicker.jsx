'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './SongPicker.module.css';

export default function SongPicker({ playlist = [], onPickSong, isOpen = true }) {
  const handleShuffle = () => {
    if (playlist.length === 0) return;
    const randomIndex = Math.floor(Math.random() * playlist.length);
    onPickSong(randomIndex);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.04 }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={styles.scrollContainer}>
            <div className={styles.content}>
              <motion.div className={styles.header} variants={itemVariants}>
                <motion.div 
                  className={styles.moon}
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(226,183,20,0.3)", 
                      "0 0 60px rgba(226,183,20,0.6)", 
                      "0 0 20px rgba(226,183,20,0.3)"
                    ] 
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌙
                </motion.div>
                <h1 className={styles.title}>Midnight Radio</h1>
                <p className={styles.subtitle}>Pick your first vibe...</p>
                <motion.button 
                  className={styles.shuffleBtn}
                  onClick={handleShuffle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ Shuffle & Play
                </motion.button>
              </motion.div>

              <motion.div className={styles.grid}>
                {playlist.map((song, index) => (
                  <motion.div
                    key={song.id || index}
                    className={styles.card}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onPickSong(index)}
                  >
                    <div className={styles.thumbnailWrapper}>
                      <img 
                        src={`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`} 
                        alt={song.title}
                        className={styles.thumbnail}
                        loading="lazy"
                      />
                      <div className={styles.playOverlay}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.songTitle}>{song.title}</h3>
                      <p className={styles.artistName}>{song.artist}</p>
                      <div className={styles.cardFooter}>
                        {song.era && <span className={styles.eraPill}>{song.era}</span>}
                        {song.vibe && (
                          <div className={styles.vibeWrapper}>
                            <span className={styles.vibeDot} />
                            <span className={styles.vibeText}>{song.vibe}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './SongPicker.module.css';

export default function SongPicker({ 
  mainPlaylist = [], 
  customPlaylist = [], 
  onPickSong, 
  onAddCustom,
  onRemoveCustom,
  isOpen = true 
}) {
  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'custom'

  const currentList = activeTab === 'main' ? mainPlaylist : customPlaylist;

  const handleShuffle = () => {
    if (currentList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * currentList.length);
    onPickSong(randomIndex, activeTab);
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
          {/* Blurred Indian Background */}
          <div className={styles.bgImage}></div>
          <div className={styles.bgOverlay}></div>

          <div className={styles.scrollContainer}>
            <div className={styles.content}>
              
              <motion.div className={styles.header} variants={itemVariants}>
                <h1 className={styles.title}>Midnight Radio</h1>
                <p className={styles.subtitle}>Pick your vibe...</p>
                
                <div className={styles.tabs}>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'main' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('main')}
                  >
                    Main Radio
                  </button>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'custom' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('custom')}
                  >
                    My Playlist
                  </button>
                </div>

                <motion.button 
                  className={styles.shuffleBtn}
                  onClick={handleShuffle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={currentList.length === 0}
                >
                  ✨ Shuffle & Play
                </motion.button>
              </motion.div>

              {currentList.length === 0 && activeTab === 'custom' && (
                <motion.div className={styles.emptyState} variants={itemVariants}>
                  <p>Your playlist is empty.</p>
                  <p>Add songs from the Main Radio to build your vibe!</p>
                </motion.div>
              )}

              <motion.div className={styles.grid}>
                {currentList.map((song, index) => (
                  <motion.div
                    key={song.id || index}
                    className={styles.card}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={styles.thumbnailWrapper} onClick={() => onPickSong(index, activeTab)}>
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
                      <h3 className={styles.songTitle} onClick={() => onPickSong(index, activeTab)}>{song.title}</h3>
                      <p className={styles.artistName}>{song.artist}</p>
                      
                      <div className={styles.cardFooter}>
                        {activeTab === 'main' ? (
                          <button 
                            className={styles.addBtn} 
                            onClick={(e) => { e.stopPropagation(); onAddCustom(song); }}
                            title="Add to My Playlist"
                          >
                            + Add
                          </button>
                        ) : (
                          <button 
                            className={styles.removeBtn} 
                            onClick={(e) => { e.stopPropagation(); onRemoveCustom(song.id); }}
                            title="Remove from My Playlist"
                          >
                            - Remove
                          </button>
                        )}
                        
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

              <motion.div className={styles.footer} variants={itemVariants}>
                <p>Love Midnight Radio? Support the project!</p>
                <div className={styles.footerLinks}>
                  <a href="https://ko-fi.com/cc4cc5bb-33f1-4ac6-a7e2-e180ae640a95" target="_blank" rel="noopener noreferrer" className={styles.kofiBtn}>
                    ☕ Support on Ko-fi
                  </a>
                  <a href="https://github.com/naman-rathore99/midnight" target="_blank" rel="noopener noreferrer" className={styles.githubBtn}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Contribute
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

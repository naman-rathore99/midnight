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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

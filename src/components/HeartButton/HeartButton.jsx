'use client';

import React from 'react';
import styles from './HeartButton.module.css';
import { motion, AnimatePresence } from 'motion/react';

const HeartButton = ({ active, count, onClick }) => {
  return (
    <motion.button
      className={styles.container}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Like"
    >
      <div className={styles.iconWrapper}>
        <svg
          className={`${styles.heart} ${active ? styles.liked : ''}`}
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
          />
        </svg>
        <AnimatePresence>
          {active && (
            <motion.div
              className={styles.particles}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {count !== undefined && (
        <div className={styles.countWrapper}>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={count}
              className={styles.count}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </motion.button>
  );
};

export default HeartButton;

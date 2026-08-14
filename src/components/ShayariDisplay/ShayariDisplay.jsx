'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './ShayariDisplay.module.css';
import HeartButton from '../HeartButton/HeartButton';

const ShayariDisplay = ({ shayari, onLike, liked, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && shayari && (
        <motion.div
          key={shayari.id || 'shayari'}
          className={styles.container}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.quoteWrapper}>
            <span className={styles.quoteMark}>"</span>
            <p className={styles.text}>{shayari.text}</p>
            <span className={styles.quoteMarkRight}>"</span>
          </div>
          
          <div className={styles.footer}>
            <p className={styles.author}>{shayari.author ? `— ${shayari.author}` : '— Unknown'}</p>
            <HeartButton 
              active={liked}
              count={shayari.like_count || 0}
              onClick={() => onLike(shayari.id)} 
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShayariDisplay;

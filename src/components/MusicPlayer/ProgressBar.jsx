'use client';
import { motion } from 'motion/react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ progress = 0, currentTime = '0:00', duration = '0:00' }) {
  return (
    <div className={styles.container}>
      <span className={styles.time}>{currentTime}</span>
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          style={{ width: `${progress}%` }}
          layout
        />
      </div>
      <span className={styles.time}>{duration}</span>
    </div>
  );
}

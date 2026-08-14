'use client';

import React from 'react';
import styles from './DynamicBackground.module.css';

const DynamicBackground = ({ era = 'default', vibe = 'chill' }) => {
  const getEraClass = (eraId) => {
    switch (eraId?.toLowerCase()) {
      case '90s': return styles.era_90s;
      case '2000s': return styles.era_2000s;
      case '2010s': return styles.era_2010s;
      case 'sufi': return styles.era_sufi;
      case 'chill': return styles.era_chill;
      default: return styles.era_default;
    }
  };

  const getVibeColor = (vibeId) => {
    switch (vibeId?.toLowerCase()) {
      case 'romantic': return 'rgba(255, 100, 150, 0.12)';
      case 'sufi': return 'rgba(50, 205, 120, 0.12)';
      case 'emotional': return 'rgba(140, 80, 200, 0.12)';
      case 'energetic': return 'rgba(240, 140, 40, 0.12)';
      case 'intense': return 'rgba(220, 40, 60, 0.12)';
      case 'chill':
      default: return 'rgba(60, 140, 220, 0.12)';
    }
  };

  const orbColor = getVibeColor(vibe);

  return (
    <div className={`${styles.container} ${getEraClass(era)}`}>
      <div className={styles.grain} />
      <div className={`${styles.orb} ${styles.orb1}`} style={{ backgroundColor: orbColor }} />
      <div className={`${styles.orb} ${styles.orb2}`} style={{ backgroundColor: orbColor }} />
      <div className={`${styles.orb} ${styles.orb3}`} style={{ backgroundColor: orbColor }} />
    </div>
  );
};

export default DynamicBackground;

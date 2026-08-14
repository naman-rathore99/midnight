'use client';

import React from 'react';
import styles from './CinematicBackground.module.css';

export default function CinematicBackground({ theme }) {
  // Map themes to CSS classes (container doesn't need to change much, just use standard container)
  
  return (
    <div className={styles.container}>
      {/* Dynamic contents based on theme */}
      
      {theme === 'hrtc-bus-window' && (
        <div className={styles.sceneHrtc}>
          <img src="/hrtc_window.jpg" alt="HRTC Bus Window" className={`${styles.baseImg} ${styles.shakeSubtle}`} />
          <div className={styles.snowOverlay} />
        </div>
      )}

      {theme === 'indian-highway-truck' && (
        <div className={styles.sceneTruck}>
          <img src="/indian_truck.jpg" alt="Indian Highway Truck" className={`${styles.baseImg} ${styles.shakeSubtle}`} />
          <div className={styles.roadOverlay} />
        </div>
      )}

      {theme === 'cutting-chai-rain' && (
        <div className={styles.sceneChai}>
          <img src="/cutting_chai.jpg" alt="Cutting Chai Stall" className={`${styles.baseImg} ${styles.panSlow}`} />
          <div className={styles.rainOverlay} />
        </div>
      )}

      {theme === 'rooftop-mehfil' && (
        <div className={styles.sceneRooftop}>
          <img src="/rooftop_mehfil.jpg" alt="Rooftop Mehfil" className={`${styles.baseImg} ${styles.panSlowReverse}`} />
          <div className={styles.starsOverlay} />
        </div>
      )}

      {theme === 'dj-rakesh-dance' && (
        <div className={styles.sceneDj}>
          <img src="/dj_rakesh.jpg" alt="DJ Rakesh Dance" className={`${styles.baseImg} ${styles.shakeSubtle}`} />
          <div className={styles.lightsOverlay} />
        </div>
      )}

      {theme === 'sadabahar-charpai' && (
        <div className={styles.sceneCharpai}>
          <img src="/sadabahar_charpai.jpg" alt="Sadabahar Charpai" className={`${styles.baseImg} ${styles.panSlow}`} />
          <div className={styles.firefliesOverlay} />
        </div>
      )}
    </div>
  );
}

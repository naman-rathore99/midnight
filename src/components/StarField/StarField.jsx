'use client';

import React, { useEffect, useRef } from 'react';
import styles from './StarField.module.css';

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor(Math.random() * 50) + 100; // 100-150 stars
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          velocity: (Math.random() * 0.02) + 0.005,
          twinkleSpeed: (Math.random() * 0.03) + 0.01,
          isGolden: Math.random() > 0.8, // 20% of stars have golden tint
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        const alpha = Math.max(0.1, Math.min(1, star.alpha));
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        if (star.isGolden) {
          ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.8})`; // Warm golden tint
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        
        ctx.fill();

        // Gentle drift upward and to the right
        star.y -= star.velocity;
        star.x += star.velocity * 0.5;

        // Wrap around logic
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.x > canvas.width + 10) star.x = -10;
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resize);
    resize();
    drawStars();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className={styles.canvasContainer}
    />
  );
};

export default StarField;

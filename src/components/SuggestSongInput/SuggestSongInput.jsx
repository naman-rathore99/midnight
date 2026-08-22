'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './SuggestSongInput.module.css';

export default function SuggestSongInput({ isOpen, onClose, onSubmit }) {
  const [link, setLink] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!link.trim()) return;

    // Improved validation for playlists
    const listMatch = link.match(/[?&]list=([^#&?]+)/);
    if (!listMatch) {
      setError('Please provide a valid YouTube Playlist link (containing list=).');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link, author }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || data.details || 'Failed to submit suggestion.');
        setIsSubmitting(false);
        return;
      }
      await onSubmit({ link, author });
      setLink('');
      setAuthor('');
    } catch (err) {
      setError('Network error.');
    }
    setIsSubmitting(false);
    setAuthor('');
  };

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div 
          className={styles.modal}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <span className={styles.icon}>🎵</span>
            <h2>Suggest a Playlist</h2>
            <button className={styles.closeBtn} onClick={onClose}>×</button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>YouTube Link *</label>
              <input 
                type="text" 
                placeholder="https://youtu.be/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                autoFocus
                className={error ? styles.inputError : ''}
              />
              {error && <span className={styles.errorText}>{error}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Your Name (Optional)</label>
              <input 
                type="text" 
                placeholder="Anonymous"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={30}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={!link.trim() || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Drop Link'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

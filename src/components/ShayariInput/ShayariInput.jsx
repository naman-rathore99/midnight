'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './ShayariInput.module.css';

export default function ShayariInput({ isOpen, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), author: author.trim() || 'Unknown' });
    setText('');
    setAuthor('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <h2 className={styles.title}>Drop a Thought...</h2>
            <p className={styles.subtitle}>Share a vibe, a memory, or a lyric that hits hard at 2 AM.</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <textarea
                className={styles.textarea}
                placeholder="Type something beautiful..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={200}
                required
              />
              
              <div className={styles.footer}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Your Name (Optional)"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={30}
                />
                <button type="submit" className={styles.submitBtn} disabled={!text.trim()}>
                  Drop It
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

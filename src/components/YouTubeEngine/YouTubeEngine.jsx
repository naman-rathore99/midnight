'use client';

import React from 'react';
import YouTube from 'react-youtube';
import styles from './YouTubeEngine.module.css';

export default function YouTubeEngine({ playlistId, onReady, onEnd, onStateChange }) {
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      ...(playlistId && { listType: 'playlist', list: playlistId })
    },
  };

  return (
    <div className={styles.hiddenContainer}>
      <YouTube
        opts={opts}
        onReady={(event) => onReady && onReady(event.target)}
        onEnd={onEnd}
        onStateChange={onStateChange}
      />
    </div>
  );
}


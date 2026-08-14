import { useState, useEffect, useCallback } from 'react';

const FALLBACK_SHAYARIS = [
  { id: 'f1', text: 'Some songs don\'t just play — they take you back to places you\'ve never been.', author: 'Midnight Radio', like_count: 0 },
  { id: 'f2', text: 'The night is young, and so are the memories we refuse to let go.', author: 'Unknown', like_count: 0 },
  { id: 'f3', text: 'Between the notes, I found the words I could never say.', author: 'Midnight Radio', like_count: 0 },
  { id: 'f4', text: 'We don\'t listen to old songs. We listen to old feelings.', author: 'Unknown', like_count: 0 },
  { id: 'f5', text: 'At 2 AM, every song becomes a confession.', author: 'Midnight Radio', like_count: 0 },
  { id: 'f6', text: 'Some nights, the sky hums the same tune as your heart.', author: 'Unknown', like_count: 0 },
  { id: 'f7', text: 'The best conversations happen when the world is asleep.', author: 'Midnight Radio', like_count: 0 },
  { id: 'f8', text: 'Nostalgia is just love trying to find its way back home.', author: 'Unknown', like_count: 0 },
  { id: 'f9', text: 'Every ending is just a melody waiting to be replayed.', author: 'Midnight Radio', like_count: 0 },
  { id: 'f10', text: 'Close your eyes, let the music speak, and let the night listen.', author: 'Unknown', like_count: 0 },
];

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getFingerprint() {
  if (typeof window === 'undefined') return 'server';
  let fp = localStorage.getItem('midnight-radio-fp');
  if (!fp) {
    fp = generateUUID();
    localStorage.setItem('midnight-radio-fp', fp);
  }
  return fp;
}

export function useShayari() {
  const [shayariList, setShayariList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const fetchShayaris = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/shayari');
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (data && data.length > 0) {
          setShayariList(data);
          setCurrentIndex(0);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to fetch shayaris, using fallback', error);
    } finally {
      setShayariList((prev) => prev.length === 0 ? FALLBACK_SHAYARIS : prev);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShayaris();
  }, []);

  const triggerRotation = useCallback(() => {
    setShayariList(prev => {
      if (prev.length === 0) return prev;
      setCurrentIndex(curr => (curr + 1) % prev.length);
      return prev;
    });

    setIsVisible(true);
    
    // Hide after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const likeShayari = useCallback(async (id) => {
    const fp = getFingerprint();
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shayariId: id, fingerprint: fp }),
      });
      if (res.ok) {
        setShayariList(prev => prev.map(s => s.id === id ? { ...s, like_count: (s.like_count || 0) + 1 } : s));
      } else {
        setShayariList(prev => prev.map(s => s.id === id ? { ...s, like_count: (s.like_count || 0) + 1 } : s));
      }
    } catch (e) {
      console.error('Failed to like shayari', e);
      setShayariList(prev => prev.map(s => s.id === id ? { ...s, like_count: (s.like_count || 0) + 1 } : s));
    }
  }, []);

  const currentShayari = shayariList.length > 0 ? shayariList[currentIndex] : null;

  return { currentShayari, isVisible, loading, likeShayari, triggerRotation };
}

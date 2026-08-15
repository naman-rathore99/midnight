import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function usePresence() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    if (!supabase) return;

    // Create a unique ID for this user session
    const sessionId = Math.random().toString(36).substring(7);

    // Create a realtime channel
    const channel = supabase.channel('online-users');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Calculate total unique users
        const total = Object.keys(state).length;
        setActiveUsers(total);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            session_id: sessionId,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { activeUsers };
}

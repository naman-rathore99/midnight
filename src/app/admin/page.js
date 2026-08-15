'use client';

import React, { useState, useEffect } from 'react';
import usePresence from '@/hooks/usePresence';
import styles from './page.module.css';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { activeUsers } = usePresence();

  const fetchSuggestions = async (authPassword) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        headers: {
          'Authorization': `Bearer ${authPassword}`
        }
      });
      if (!res.ok) {
        throw new Error('Invalid password');
      }
      const json = await res.json();
      setSuggestions(json.data || []);
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError('Authentication failed or invalid password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.trim()) {
      fetchSuggestions(password);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return;

    try {
      const res = await fetch(`/api/admin?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      if (res.ok) {
        setSuggestions(suggestions.filter(s => s.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2>📻 Midnight Radio Admin</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>📻 Midnight Radio Admin</h1>
        <div className={styles.statsCard}>
          <span className={styles.pulse}></span>
          <h2>{activeUsers}</h2>
          <p>Live Listeners</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.tableHeader}>
          <h3>Song Suggestions</h3>
          <button onClick={() => fetchSuggestions(password)} className={styles.refreshBtn}>
            Refresh
          </button>
        </div>

        {suggestions.length === 0 ? (
          <p className={styles.empty}>No song suggestions yet.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>YouTube ID</th>
                  <th>Original Link</th>
                  <th>Suggested By</th>
                  <th>Requests</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map(s => (
                  <tr key={s.id}>
                    <td>
                      <img src={`https://img.youtube.com/vi/${s.youtube_id}/default.jpg`} alt="thumb" className={styles.thumb} />
                    </td>
                    <td>
                      <a href={s.original_link} target="_blank" rel="noreferrer" className={styles.link}>
                        {s.original_link}
                      </a>
                    </td>
                    <td>{s.suggested_by}</td>
                    <td>
                      <span className={styles.badge}>{s.request_count}</span>
                    </td>
                    <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(s.id)} className={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

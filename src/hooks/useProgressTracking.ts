import { useState, useEffect } from 'react';
import { ScoringResult } from '@/utils/scoring';

export interface ProgressEntry {
  date: string;
  score: number;
  severity: ScoringResult['severity'];
  role: 'individual' | 'parent' | 'clinician';
  timestamp: number;
}

export function useProgressTracking() {
  const [history, setHistory] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('auticare_progress_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress history', e);
      }
    }
  }, []);

  const addEntry = (result: ScoringResult, role: 'individual' | 'parent' | 'clinician') => {
    const entry: ProgressEntry = {
      date: new Date().toLocaleDateString(),
      score: result.normalizedScore,
      severity: result.severity,
      role,
      timestamp: Date.now(),
    };

    const updated = [...history, entry].slice(-20); // Keep last 20 entries
    setHistory(updated);
    localStorage.setItem('auticare_progress_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('auticare_progress_history');
  };

  const getRecentEntries = (count: number = 5) => {
    return history.slice(-count).reverse();
  };

  const getTrend = () => {
    if (history.length < 2) return 'stable';
    const recent = history.slice(-3);
    const scores = recent.map(e => e.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const lastScore = scores[scores.length - 1];
    
    if (lastScore > avg + 5) return 'improving';
    if (lastScore < avg - 5) return 'declining';
    return 'stable';
  };

  return {
    history,
    addEntry,
    clearHistory,
    getRecentEntries,
    getTrend,
  };
}

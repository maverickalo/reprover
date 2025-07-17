import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiClient } from '../api/api';
import { ExerciseHistory as ExerciseHistoryType } from '../types/workout';

interface ExerciseHistoryProps {
  exerciseName: string;
  show: boolean;
}

export const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({ exerciseName, show }) => {
  const [history, setHistory] = useState<ExerciseHistoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (show && !loaded && exerciseName) {
      loadHistory();
    }
  }, [show, exerciseName, loaded]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getExerciseHistory(exerciseName);
      setHistory(data.slice(0, 5)); // Show last 5 entries
      setLoaded(true);
    } catch (error) {
      console.error('Failed to load exercise history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 mt-2 bg-dark-bg border border-gray-700 rounded-lg shadow-xl p-3 z-10 min-w-[200px]"
    >
      <h5 className="text-sm font-semibold text-primary-400 mb-2">Recent History</h5>
      
      {loading && (
        <p className="text-gray-400 text-sm">Loading...</p>
      )}
      
      {!loading && history.length === 0 && (
        <p className="text-gray-400 text-sm">No history yet</p>
      )}
      
      {!loading && history.length > 0 && (
        <div className="space-y-1">
          {history.map((entry, index) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{formatDate(entry.date)}</span>
                <span className="text-gray-200 font-medium">
                  {entry.weight ? `${entry.weight}${entry.weight || 'lbs'}` : `${entry.reps} reps`}
                </span>
              </div>
              {entry.reps && entry.weight && (
                <div className="text-xs text-gray-500">
                  {entry.reps} reps @ {entry.weight}lbs
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
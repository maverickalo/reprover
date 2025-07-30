import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { ApiClient } from '../api/api';

interface LastWorkoutSummaryProps {}

export const LastWorkoutSummary: React.FC<LastWorkoutSummaryProps> = () => {
  const [lastWorkout, setLastWorkout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLastWorkout();
  }, []);

  const loadLastWorkout = async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.getWorkoutLogs(1, 0);
      if (response.logs.length > 0) {
        setLastWorkout(response.logs[0]);
      }
    } catch (error) {
      console.error('Failed to load last workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const formatDuration = (milliseconds?: number): string => {
    if (!milliseconds) return '';
    const minutes = Math.floor(milliseconds / 1000 / 60);
    return `${minutes} min`;
  };

  const getCompletedExercises = () => {
    if (!lastWorkout?.actuals) return [];
    const exerciseMap: { [key: string]: { count: number, maxWeight?: number } } = {};
    
    lastWorkout.actuals.forEach((actual: any) => {
      if (!exerciseMap[actual.name]) {
        exerciseMap[actual.name] = { count: 0 };
      }
      exerciseMap[actual.name].count++;
      if (actual.weight) {
        exerciseMap[actual.name].maxWeight = Math.max(
          exerciseMap[actual.name].maxWeight || 0,
          actual.weight
        );
      }
    });
    
    return Object.entries(exerciseMap).slice(0, 3);
  };

  if (isLoading || !lastWorkout) {
    return null;
  }

  const completedExercises = getCompletedExercises();
  const completionRate = Math.round(
    (lastWorkout.actuals.length / 
    (lastWorkout.plan.reduce((sum: number, round: any) => 
      sum + (round.exercises.length * round.rounds), 0)
    )) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 bg-gray-800/50 border-gray-700">
        <div className="py-3 px-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Last workout</span>
              <span className="text-xs text-gray-500">{formatDate(lastWorkout.timestamp)}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400">
                {formatDuration(lastWorkout.duration)}
              </span>
              <span className={`${completionRate >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                {completionRate}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            {completedExercises.map(([exercise, data], idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="text-gray-300">{exercise}</span>
                {data.maxWeight && (
                  <span className="text-gray-500 text-xs">@ {data.maxWeight}lbs</span>
                )}
              </div>
            ))}
            {completedExercises.length === 0 && (
              <span className="text-gray-500 italic">No exercises logged</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
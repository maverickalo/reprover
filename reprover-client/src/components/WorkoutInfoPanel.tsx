import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { WorkoutPlan, WorkoutInfo } from '../types/workout';
import { ApiClient } from '../api/api';

interface WorkoutInfoPanelProps {
  workoutPlan: WorkoutPlan;
}

export const WorkoutInfoPanel: React.FC<WorkoutInfoPanelProps> = ({ workoutPlan }) => {
  const [info, setInfo] = useState<WorkoutInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchWorkoutInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiClient.getWorkoutInfo(workoutPlan);
      setInfo(data);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze workout');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded && !info) {
    return (
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">Workout Analysis</h3>
            <p className="text-sm text-gray-400">Get AI-powered insights about this workout</p>
          </div>
          <Button
            variant="primary"
            onClick={fetchWorkoutInfo}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Workout'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Workout Analysis</h3>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {info && isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Workout Type</h4>
                <p className="text-white">{info.workoutType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Difficulty</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  info.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                  info.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {info.difficulty}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Est. Calories</h4>
                <p className="text-white">{info.estimatedCalories} cal</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Recovery Time</h4>
                <p className="text-white">{info.recoveryTime}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Muscle Groups</h4>
              <div className="flex flex-wrap gap-2">
                {info.muscleGroups.map((muscle, i) => (
                  <span key={i} className="bg-primary-900/30 text-primary-300 px-3 py-1 rounded-md text-sm">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Tips</h4>
              <ul className="space-y-1">
                {info.tips.map((tip, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Easier Modifications</h4>
                <ul className="space-y-1">
                  {info.modifications.easier.map((mod, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start">
                      <span className="text-green-400 mr-2">↓</span>
                      {mod}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Harder Modifications</h4>
                <ul className="space-y-1">
                  {info.modifications.harder.map((mod, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start">
                      <span className="text-red-400 mr-2">↑</span>
                      {mod}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};
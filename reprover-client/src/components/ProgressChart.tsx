import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ApiClient } from '../api/api';
import { ExerciseHistory, WorkoutPlan } from '../types/workout';
import { Card } from './Card';
import { Button } from './Button';

interface ProgressChartProps {
  workoutPlan: WorkoutPlan;
}

interface ChartData {
  date: string;
  reps: number | null;
  weight: number | null;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ workoutPlan }) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUniqueExercises = (): string[] => {
    const exercises = new Set<string>();
    workoutPlan.forEach(round => {
      round.exercises.forEach(exercise => {
        exercises.add(exercise.name);
      });
    });
    return Array.from(exercises);
  };

  const uniqueExercises = getUniqueExercises();

  useEffect(() => {
    if (uniqueExercises.length > 0 && !selectedExercise) {
      setSelectedExercise(uniqueExercises[0]);
    }
  }, [uniqueExercises, selectedExercise]);

  useEffect(() => {
    if (selectedExercise) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExercise]);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiClient.getExerciseHistory(selectedExercise);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = (): ChartData[] => {
    const groupedByDate = new Map<string, { totalReps: number; maxWeight: number; count: number }>();
    
    history.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      const existing = groupedByDate.get(date) || { totalReps: 0, maxWeight: 0, count: 0 };
      
      existing.totalReps += entry.reps || 0;
      existing.maxWeight = Math.max(existing.maxWeight, entry.weight || 0);
      existing.count += 1;
      
      groupedByDate.set(date, existing);
    });
    
    return Array.from(groupedByDate.entries()).map(([date, data]) => ({
      date,
      reps: Math.round(data.totalReps / data.count),
      weight: data.maxWeight || null
    }));
  };

  const chartData = getChartData();
  const hasWeightData = chartData.some(d => d.weight !== null);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Progress Tracking</h2>
          
          <div className="flex flex-wrap gap-2">
            {uniqueExercises.map(exercise => (
              <Button
                key={exercise}
                variant={selectedExercise === exercise ? 'primary' : 'ghost'}
                onClick={() => setSelectedExercise(exercise)}
                className="text-sm"
              >
                {exercise}
              </Button>
            ))}
          </div>
        </div>

        {isLoading && (
          <motion.div 
            className="flex justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg">
            Error: {error}
          </div>
        )}

        {!isLoading && !error && chartData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No history found for {selectedExercise}. Complete some workouts to see your progress!
          </div>
        )}

        {!isLoading && !error && chartData.length > 0 && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Reps Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1b1e24', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reps" 
                    stroke="#00aff0" 
                    strokeWidth={2}
                    dot={{ fill: '#00aff0', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {hasWeightData && (
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Weight Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1b1e24', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Card>
  );
};
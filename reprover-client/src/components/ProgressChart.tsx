import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ApiClient } from '../api/api';
import { ExerciseHistory, WorkoutPlan } from '../types/workout';

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

  // Extract unique exercise names from workout plan
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

  // Format data for recharts
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

  const styles = {
    container: {
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center' as const,
    },
    selector: {
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
    },
    select: {
      padding: '8px 16px',
      fontSize: '16px',
      border: '2px solid #ddd',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    chartContainer: {
      width: '100%',
      height: '400px',
      marginBottom: '24px',
    },
    noData: {
      textAlign: 'center' as const,
      padding: '40px',
      color: '#666',
      fontSize: '16px',
    },
    loading: {
      textAlign: 'center' as const,
      padding: '40px',
      color: '#007bff',
      fontSize: '16px',
    },
    error: {
      textAlign: 'center' as const,
      padding: '20px',
      color: '#dc3545',
      fontSize: '16px',
      backgroundColor: '#f8d7da',
      borderRadius: '8px',
      border: '1px solid #f5c6cb',
    },
    legend: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.6',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Progress Charts</h2>
      
      <div style={styles.selector}>
        <label htmlFor="exercise-select" style={{ fontSize: '16px', fontWeight: '600' }}>
          Select Exercise:
        </label>
        <select
          id="exercise-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          style={styles.select}
        >
          {uniqueExercises.map(exercise => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div style={styles.loading}>Loading history...</div>
      )}

      {error && (
        <div style={styles.error}>
          Error: {error}
        </div>
      )}

      {!isLoading && !error && chartData.length === 0 && (
        <div style={styles.noData}>
          No history data available for {selectedExercise}. 
          Complete some workouts to see your progress!
        </div>
      )}

      {!isLoading && !error && chartData.length > 0 && (
        <>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reps"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Average Reps"
                  dot={{ fill: '#8884d8' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="weight"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Max Weight (lbs)"
                  dot={{ fill: '#82ca9d' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div style={styles.legend}>
            <strong>Chart Guide:</strong><br />
            • <span style={{ color: '#8884d8' }}>Purple line</span>: Average reps per workout (left axis)<br />
            • <span style={{ color: '#82ca9d' }}>Green line</span>: Maximum weight used (right axis)<br />
            • Each point represents a workout day where you performed {selectedExercise}
          </div>
        </>
      )}
    </div>
  );
};
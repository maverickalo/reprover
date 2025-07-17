import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WorkoutPlan, ExerciseActual, ExerciseHistory, SavedWorkout } from '../types/workout';
import { Button } from './Button';
import { Card } from './Card';
import { TextInput } from './TextInput';
import { staggerListVariants } from '../animations/staggerListVariants';
import { ApiClient } from '../api/api';

interface WorkoutLoggerProps {
  workoutPlan: WorkoutPlan;
  onSave: (actuals: ExerciseActual[]) => void;
  isSaving: boolean;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ workoutPlan, onSave, isSaving }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [actuals, setActuals] = useState<ExerciseActual[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<{ [key: string]: ExerciseHistory[] }>({});
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(workoutPlan);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const getTotalRounds = () => {
    const activeWorkout = selectedWorkout || workoutPlan;
    return Math.max(...activeWorkout.map(round => round.rounds));
  };

  // Load saved workouts on mount
  useEffect(() => {
    const loadSavedWorkouts = async () => {
      try {
        const workouts = await ApiClient.getSavedWorkouts();
        setSavedWorkouts(workouts);
      } catch (error) {
        console.error('Failed to load saved workouts:', error);
      }
    };
    
    loadSavedWorkouts();
    
    // Start timing when component mounts
    setStartTime(new Date());
  }, []);

  // Update elapsed time every second
  useEffect(() => {
    if (!startTime || endTime) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  // Load exercise history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const exerciseNames = workoutPlan.flatMap(r => r.exercises.map(e => e.name));
      const uniqueExercises = Array.from(new Set(exerciseNames));
      const historyMap: { [key: string]: ExerciseHistory[] } = {};
      
      for (const exerciseName of uniqueExercises) {
        try {
          const history = await ApiClient.getExerciseHistory(exerciseName);
          historyMap[exerciseName] = history;
        } catch (error) {
          console.error(`Failed to load history for ${exerciseName}:`, error);
        }
      }
      
      setExerciseHistory(historyMap);
    };
    
    loadHistory();
  }, [workoutPlan]);

  // Pre-fill target weights when round changes
  useEffect(() => {
    workoutPlan.forEach(round => {
      if (currentRound <= round.rounds) {
        round.exercises.forEach(exercise => {
          if (exercise.weight) {
            const existing = actuals.find(a => a.name === exercise.name && a.round === currentRound);
            if (!existing || !existing.weight) {
              updateActual(exercise.name, 'weight', exercise.weight);
            }
          }
        });
      }
    });
  }, [currentRound]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateActual = (exerciseName: string, field: 'reps' | 'weight', value: number | null) => {
    const existing = actuals.find(a => a.name === exerciseName && a.round === currentRound);
    if (existing) {
      setActuals(actuals.map(a => 
        a.name === exerciseName && a.round === currentRound 
          ? { ...a, [field]: value }
          : a
      ));
    } else {
      setActuals([...actuals, {
        name: exerciseName,
        round: currentRound,
        reps: field === 'reps' ? value : null,
        weight: field === 'weight' ? value : null
      }]);
    }
  };

  const getActualValue = (exerciseName: string, field: 'reps' | 'weight') => {
    const actual = actuals.find(a => a.name === exerciseName && a.round === currentRound);
    return actual?.[field] || '';
  };

  const isPR = (exerciseName: string, weight: number): boolean => {
    const history = exerciseHistory[exerciseName] || [];
    if (history.length === 0) return false;
    const maxWeight = Math.max(...history.filter(h => h.weight).map(h => h.weight || 0));
    return weight > maxWeight;
  };

  const handleSave = () => {
    setEndTime(new Date());
    onSave(actuals);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const totalRounds = getTotalRounds();

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Log Your Workout</h2>
          <div className="flex items-center gap-4">
            <div className="text-lg font-mono text-blue-400">
              {formatTime(elapsedTime)}
            </div>
            <Button onClick={handleSave} variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Workout'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentRound(Math.max(1, currentRound - 1))}
            disabled={currentRound === 1}
          >
            ← Previous
          </Button>
          
          <div className="text-center">
            <span className="text-3xl font-bold text-primary-400">Round {currentRound}</span>
            <span className="text-gray-500 ml-2">of {totalRounds}</span>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setCurrentRound(Math.min(totalRounds, currentRound + 1))}
            disabled={currentRound === totalRounds}
          >
            Next →
          </Button>
        </div>

        <motion.div 
          className="space-y-4"
          variants={staggerListVariants.list}
          initial="hidden"
          animate="show"
          key={currentRound}
        >
          {workoutPlan.map((round) => {
            if (currentRound > round.rounds) return null;
            
            return round.exercises.map((exercise, index) => {
              const exerciseKey = `${round.rounds}-${exercise.name}-${index}`;
              
              return (
                <motion.div 
                  key={exerciseKey}
                  variants={staggerListVariants.item}
                  className="bg-dark-bg rounded-lg p-4 border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-100">{exercise.name}</h3>
                    {exercise.weight && getActualValue(exercise.name, 'weight') && 
                     isPR(exercise.name, parseFloat(getActualValue(exercise.name, 'weight').toString())) && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        🎯 PR!
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Target: {exercise.reps || '-'} reps
                      </label>
                      <TextInput
                        type="number"
                        value={getActualValue(exercise.name, 'reps')}
                        onChange={(e) => updateActual(exercise.name, 'reps', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Actual reps"
                      />
                    </div>
                    
                    {exercise.weight && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Target: {exercise.weight_range || `${exercise.weight} ${exercise.weight_unit || 'lbs'}`}
                        </label>
                        <TextInput
                          type="number"
                          value={getActualValue(exercise.name, 'weight')}
                          onChange={(e) => updateActual(exercise.name, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="Actual weight"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            });
          })}
        </motion.div>

        <div className="flex justify-center gap-2">
          {Array.from({ length: totalRounds }, (_, i) => (
            <motion.button
              key={i + 1}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentRound === i + 1 ? 'bg-primary-500' : 'bg-gray-600'
              }`}
              onClick={() => setCurrentRound(i + 1)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
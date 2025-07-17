import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SavedWorkout, WorkoutPlan } from '../types/workout';
import { WorkoutService } from '../services/workoutService';
import { Button } from './Button';
import { Card } from './Card';
import { TextInput } from './TextInput';
import { staggerListVariants } from '../animations/staggerListVariants';
import { useAuth } from '../contexts/AuthContext';

interface SavedWorkoutsProps {
  currentWorkout: WorkoutPlan | null;
  onLoadWorkout: (workout: WorkoutPlan) => void;
  onSaveSuccess?: () => void;
}

export const SavedWorkouts: React.FC<SavedWorkoutsProps> = ({ 
  currentWorkout, 
  onLoadWorkout,
  onSaveSuccess 
}) => {
  const { user } = useAuth();
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSavedWorkouts();
    }
  }, [user]);

  const loadSavedWorkouts = async () => {
    setLoading(true);
    try {
      const workouts = await WorkoutService.getSavedWorkouts();
      setSavedWorkouts(workouts);
    } catch (error) {
      console.error('Failed to load saved workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!currentWorkout || !workoutName.trim()) return;

    setSaving(true);
    try {
      await WorkoutService.saveWorkout(workoutName, currentWorkout);
      setWorkoutName('');
      setShowSaveForm(false);
      loadSavedWorkouts();
      onSaveSuccess?.();
    } catch (error) {
      console.error('Failed to save workout:', error);
      alert('Failed to save workout. Please ensure you have proper permissions in Firebase.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      await WorkoutService.deleteSavedWorkout(id);
      loadSavedWorkouts();
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWorkoutSummary = (workout: WorkoutPlan) => {
    const totalExercises = workout.reduce((sum, round) => sum + round.exercises.length * round.rounds, 0);
    const uniqueExercises = new Set(workout.flatMap(round => round.exercises.map(ex => ex.name))).size;
    const totalRounds = workout.reduce((sum, round) => sum + round.rounds, 0);
    
    return {
      totalExercises,
      uniqueExercises,
      totalRounds,
      exercises: workout.flatMap(round => round.exercises.map(ex => ex.name))
    };
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Saved Workouts</h2>
          {currentWorkout && user && (
            <Button
              onClick={() => setShowSaveForm(!showSaveForm)}
              variant="primary"
            >
              Save Current Workout
            </Button>
          )}
        </div>

        {!user && (
          <div className="text-gray-400 text-center py-8">
            Please sign in to save and manage your workouts
          </div>
        )}

        {showSaveForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-bg p-4 rounded-lg space-y-4"
          >
            <TextInput
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name..."
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSaveWorkout}
                variant="primary"
                disabled={!workoutName.trim() || saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => {
                  setShowSaveForm(false);
                  setWorkoutName('');
                }}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {user && loading ? (
          <div className="text-center py-8 text-gray-400">Loading saved workouts...</div>
        ) : user && savedWorkouts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No saved workouts yet</div>
        ) : user && (
          <motion.div
            className="space-y-3"
            variants={staggerListVariants.list}
            initial="hidden"
            animate="show"
          >
            {savedWorkouts.map((savedWorkout) => {
              const summary = getWorkoutSummary(savedWorkout.workout);
              const isExpanded = expandedWorkout === savedWorkout.id;
              
              return (
                <motion.div
                  key={savedWorkout.id}
                  variants={staggerListVariants.item}
                  className="bg-dark-bg rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => setExpandedWorkout(isExpanded ? null : savedWorkout.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-100">{savedWorkout.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Last saved: {formatDate(savedWorkout.updatedAt || savedWorkout.createdAt)}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>{summary.totalRounds} rounds</span>
                          <span>{summary.uniqueExercises} unique exercises</span>
                          <span>{summary.totalExercises} total exercises</span>
                        </div>
                      </div>
                      <motion.svg
                        className="w-5 h-5 text-gray-400"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-800"
                    >
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-300">Exercises:</h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(summary.exercises)).map((exercise, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded"
                              >
                                {exercise}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => onLoadWorkout(savedWorkout.workout)}
                            variant="primary"
                            className="flex-1"
                          >
                            Start Workout
                          </Button>
                          <Button
                            onClick={() => {
                              onLoadWorkout(savedWorkout.workout);
                              // Could add edit mode here
                            }}
                            variant="ghost"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteWorkout(savedWorkout.id)}
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </Card>
  );
};
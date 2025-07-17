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
      year: 'numeric' 
    });
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
            {savedWorkouts.map((savedWorkout) => (
              <motion.div
                key={savedWorkout.id}
                variants={staggerListVariants.item}
                className="bg-dark-bg rounded-lg p-4 flex justify-between items-center hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{savedWorkout.name}</h3>
                  <p className="text-sm text-gray-400">
                    Saved on {formatDate(savedWorkout.createdAt)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {savedWorkout.workout.reduce((total, round) => total + round.exercises.length * round.rounds, 0)} total exercises
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onLoadWorkout(savedWorkout.workout)}
                    variant="primary"
                    className="text-sm"
                  >
                    Load
                  </Button>
                  <Button
                    onClick={() => handleDeleteWorkout(savedWorkout.id)}
                    variant="ghost"
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Card>
  );
};
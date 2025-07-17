import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkoutPlan, WorkoutRound, Exercise } from '../types/workout';
import { Button } from './Button';
import { Card } from './Card';
import { TextInput } from './TextInput';
import { ExerciseCard } from './ExerciseCard';
import { staggerListVariants } from '../animations/staggerListVariants';
import { WorkoutService } from '../services/workoutService';

interface WorkoutPlanReviewProps {
  workoutPlan: WorkoutPlan;
  onChange: (plan: WorkoutPlan) => void;
  onSave: () => void;
}

export const WorkoutPlanReview: React.FC<WorkoutPlanReviewProps> = ({ 
  workoutPlan, 
  onChange, 
  onSave 
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [saving, setSaving] = useState(false);
  const updateRound = (roundIndex: number, field: keyof WorkoutRound, value: any) => {
    const newPlan = [...workoutPlan];
    newPlan[roundIndex] = { ...newPlan[roundIndex], [field]: value };
    onChange(newPlan);
  };

  const updateExercise = (roundIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => {
    const newPlan = [...workoutPlan];
    const newExercises = [...newPlan[roundIndex].exercises];
    newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], [field]: value };
    newPlan[roundIndex] = { ...newPlan[roundIndex], exercises: newExercises };
    onChange(newPlan);
  };

  const addExercise = (roundIndex: number) => {
    const newExercise: Exercise = {
      name: 'New Exercise',
      reps: null,
      weight: null,
      weight_range: null,
      weight_unit: null,
      duration: null,
      distance: null,
      distance_unit: null,
      note: null
    };
    const newPlan = [...workoutPlan];
    newPlan[roundIndex] = {
      ...newPlan[roundIndex],
      exercises: [...newPlan[roundIndex].exercises, newExercise]
    };
    onChange(newPlan);
  };

  const removeExercise = (roundIndex: number, exerciseIndex: number) => {
    const newPlan = [...workoutPlan];
    newPlan[roundIndex] = {
      ...newPlan[roundIndex],
      exercises: newPlan[roundIndex].exercises.filter((_, i) => i !== exerciseIndex)
    };
    onChange(newPlan);
  };

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) return;
    
    setSaving(true);
    try {
      await WorkoutService.saveWorkout(workoutName, workoutPlan);
      setShowSaveDialog(false);
      setWorkoutName('');
      onSave(); // Call the original onSave callback
    } catch (error) {
      console.error('Failed to save workout:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Review & Edit Plan</h2>
          <Button onClick={handleSaveClick} variant="primary">
            Save Plan
          </Button>
        </div>

        <motion.div 
          className="space-y-6"
          variants={staggerListVariants.list}
          initial="hidden"
          animate="show"
        >
          {workoutPlan.map((round, roundIndex) => (
            <motion.div 
              key={roundIndex}
              variants={staggerListVariants.item}
              className="bg-dark-bg rounded-lg p-4 border border-gray-800"
            >
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-primary-400">Round {roundIndex + 1}</h3>
                <div className="flex items-center gap-2">
                  <label className="text-gray-400">Rounds:</label>
                  <TextInput
                    type="number"
                    value={round.rounds}
                    onChange={(e) => updateRound(roundIndex, 'rounds', parseInt(e.target.value) || 1)}
                    className="w-20"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {round.exercises.map((exercise, exerciseIndex) => (
                  <ExerciseCard
                    key={exerciseIndex}
                    exercise={exercise}
                    roundIndex={roundIndex}
                    exerciseIndex={exerciseIndex}
                    updateExercise={updateExercise}
                    removeExercise={removeExercise}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => addExercise(roundIndex)}
                className="mt-3 w-full"
              >
                + Add Exercise
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-card-bg p-6 rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-100 mb-4">Save Workout Plan</h3>
              <TextInput
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Enter workout name..."
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSaveWorkout()}
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleSaveWorkout}
                  variant="primary"
                  disabled={!workoutName.trim() || saving}
                  className="flex-1"
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setWorkoutName('');
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
      )}
    </Card>
  );
};
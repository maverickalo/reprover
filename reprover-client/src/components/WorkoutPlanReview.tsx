import React from 'react';
import { motion } from 'framer-motion';
import { WorkoutPlan, WorkoutRound, Exercise } from '../types/workout';
import { Button } from './Button';
import { Card } from './Card';
import { TextInput } from './TextInput';
import { staggerListVariants } from '../animations/staggerListVariants';

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

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Review & Edit Plan</h2>
          <Button onClick={onSave} variant="primary">
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
                  <motion.div 
                    key={exerciseIndex}
                    className="p-3 bg-card-bg rounded-md space-y-3"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <TextInput
                        value={exercise.name}
                        onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'name', e.target.value)}
                        placeholder="Exercise name"
                        className="md:col-span-2"
                      />
                      
                      <TextInput
                        type="number"
                        value={exercise.reps || ''}
                        onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'reps', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Reps"
                      />
                      
                      <TextInput
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Weight"
                      />
                      
                      <TextInput
                        value={exercise.weight_unit || ''}
                        onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'weight_unit', e.target.value || null)}
                        placeholder="Unit"
                      />
                      
                      <Button
                        variant="ghost"
                        onClick={() => removeExercise(roundIndex, exerciseIndex)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                    
                    {/* Distance row - only show if exercise has distance or user is editing */}
                    {(exercise.distance || exercise.distance_unit) && (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div className="md:col-span-2" />
                        <TextInput
                          type="number"
                          value={exercise.distance || ''}
                          onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'distance', e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="Distance"
                        />
                        <TextInput
                          value={exercise.distance_unit || ''}
                          onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'distance_unit', e.target.value || null)}
                          placeholder="Unit (m, km, mi)"
                        />
                        <div className="md:col-span-2" />
                      </div>
                    )}
                  </motion.div>
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
    </Card>
  );
};
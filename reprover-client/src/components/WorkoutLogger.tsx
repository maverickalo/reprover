import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkoutPlan, ExerciseActual } from '../types/workout';
import { Button } from './Button';
import { Card } from './Card';
import { TextInput } from './TextInput';
import { staggerListVariants } from '../animations/staggerListVariants';

interface WorkoutLoggerProps {
  workoutPlan: WorkoutPlan;
  onSave: (actuals: ExerciseActual[]) => void;
  isSaving: boolean;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ workoutPlan, onSave, isSaving }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [actuals, setActuals] = useState<ExerciseActual[]>([]);

  const getTotalRounds = () => {
    return Math.max(...workoutPlan.map(round => round.rounds));
  };

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

  const handleSave = () => {
    onSave(actuals);
  };

  const totalRounds = getTotalRounds();

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Log Your Workout</h2>
          <Button onClick={handleSave} variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Workout'}
          </Button>
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
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">{exercise.name}</h3>
                  
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
                          Target: {exercise.weight} {exercise.weight_unit || 'lbs'}
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
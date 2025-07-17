import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Exercise } from '../types/workout';
import { ApiClient } from '../api/api';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { ExerciseHistory } from './ExerciseHistory';
import { YouTubeVideo } from './YouTubeVideo';

interface ExerciseCardProps {
  exercise: Exercise;
  roundIndex: number;
  exerciseIndex: number;
  updateExercise: (roundIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => void;
  removeExercise: (roundIndex: number, exerciseIndex: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  roundIndex,
  exerciseIndex,
  updateExercise,
  removeExercise
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Reset description when exercise name changes
    setShowDescription(false);
    updateExercise(roundIndex, exerciseIndex, 'description', undefined);
  }, [exercise.name]);

  const loadDescription = async () => {
    if (exercise.description || loading) return;
    
    setLoading(true);
    try {
      const description = await ApiClient.getExerciseDescription(exercise.name);
      updateExercise(roundIndex, exerciseIndex, 'description', description);
      setShowDescription(true);
    } catch (error) {
      console.error('Failed to load exercise description:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatExerciseDisplay = () => {
    const parts = [];
    
    if (exercise.reps) {
      parts.push(`${exercise.reps} reps`);
    }
    
    if (exercise.weight_range) {
      parts.push(`@ ${exercise.weight_range}`);
    } else if (exercise.weight) {
      parts.push(`@ ${exercise.weight}${exercise.weight_unit || 'lbs'}`);
    }
    
    if (exercise.duration) {
      parts.push(`for ${exercise.duration}`);
    }
    
    if (exercise.distance) {
      parts.push(`${exercise.distance} ${exercise.distance_unit || 'meters'}`);
    }
    
    if (exercise.note) {
      parts.push(`(${exercise.note})`);
    }
    
    return parts.join(' ');
  };

  return (
    <motion.div 
      className="p-4 bg-card-bg rounded-md space-y-3 border border-gray-800"
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      {/* Exercise Title Row */}
      <div className="flex items-center justify-between relative">
        <h4 
          className="text-lg font-semibold text-primary-400 cursor-pointer"
          onMouseEnter={() => setShowHistory(true)}
          onMouseLeave={() => setShowHistory(false)}
        >
          {exercise.name}
        </h4>
        <ExerciseHistory exerciseName={exercise.name} show={showHistory} />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              if (showDescription) {
                setShowDescription(false);
              } else {
                loadDescription();
              }
            }}
            className="text-sm"
            disabled={loading}
          >
            {loading ? 'Loading...' : showDescription ? 'Hide Info' : 'Show Info'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => removeExercise(roundIndex, exerciseIndex)}
            className="text-red-400 hover:text-red-300"
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Exercise Summary */}
      <p className="text-gray-300">{formatExerciseDisplay()}</p>

      {/* Exercise Description */}
      {showDescription && exercise.description && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-dark-bg p-3 rounded-md space-y-2 text-sm"
        >
          <div>
            <span className="text-primary-400 font-medium">Form: </span>
            <span className="text-gray-300">{exercise.description.form}</span>
          </div>
          <div>
            <span className="text-primary-400 font-medium">Common Mistakes: </span>
            <span className="text-gray-300">{exercise.description.mistakes}</span>
          </div>
          <div>
            <span className="text-primary-400 font-medium">Muscles Worked: </span>
            <span className="text-gray-300">{exercise.description.muscles}</span>
          </div>
          {exercise.description.youtubeQuery && (
            <YouTubeVideo 
              searchQuery={exercise.description.youtubeQuery} 
              exerciseName={exercise.name}
            />
          )}
        </motion.div>
      )}

      {/* Edit Fields */}
      <div className="space-y-3">
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
          
          <div className="md:col-span-2" />
        </div>
        
        {/* Duration row - show if exercise has duration */}
        {exercise.duration && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2" />
            <TextInput
              value={exercise.duration || ''}
              onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'duration', e.target.value || null)}
              placeholder="Duration"
              className="md:col-span-2"
            />
            <div className="md:col-span-2" />
          </div>
        )}
        
        {/* Distance row - only show if exercise has distance */}
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
        
        {/* Note row - show if exercise has a note */}
        {exercise.note && (
          <div className="grid grid-cols-1">
            <TextInput
              value={exercise.note || ''}
              onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'note', e.target.value || null)}
              placeholder="Note"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
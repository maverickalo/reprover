import React from 'react';
import { WorkoutPlan, Exercise } from '../types/workout';
import * as S from './WorkoutPlanReview.styled';

interface WorkoutPlanReviewProps {
  plan: WorkoutPlan;
  onPlanChange: (plan: WorkoutPlan) => void;
  onSave: () => void;
}

export const WorkoutPlanReview: React.FC<WorkoutPlanReviewProps> = ({ 
  plan, 
  onPlanChange, 
  onSave 
}) => {
  const updateExercise = (
    roundIndex: number, 
    exerciseIndex: number, 
    field: keyof Exercise, 
    value: string | number | null
  ) => {
    const newPlan = [...plan];
    const exercise = newPlan[roundIndex].exercises[exerciseIndex];
    
    if (field === 'reps' || field === 'weight') {
      exercise[field] = value === '' ? null : Number(value);
    } else {
      exercise[field] = value as any;
    }
    
    onPlanChange(newPlan);
  };

  const updateRounds = (roundIndex: number, rounds: number) => {
    const newPlan = [...plan];
    newPlan[roundIndex].rounds = rounds;
    onPlanChange(newPlan);
  };

  return (
    <S.ReviewContainer>
      <S.ReviewHeader>Review Your Workout Plan</S.ReviewHeader>
      
      {plan.map((round, roundIndex) => (
        <S.RoundContainer key={roundIndex}>
          <S.RoundHeader>
            <span>Rounds:</span>
            <S.RoundInput
              type="number"
              value={round.rounds}
              onChange={(e) => updateRounds(roundIndex, Number(e.target.value))}
              min="1"
            />
          </S.RoundHeader>
          
          {round.exercises.map((exercise, exerciseIndex) => (
            <S.ExerciseContainer key={exerciseIndex}>
              <S.ExerciseName
                type="text"
                value={exercise.name}
                onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'name', e.target.value)}
                placeholder="Exercise name"
              />
              
              <S.FieldsGrid>
                <S.FieldGroup>
                  <S.FieldLabel>Reps</S.FieldLabel>
                  <S.FieldInput
                    type="number"
                    value={exercise.reps || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'reps', e.target.value)}
                    placeholder="-"
                  />
                </S.FieldGroup>
                
                <S.FieldGroup>
                  <S.FieldLabel>Weight</S.FieldLabel>
                  <S.FieldInput
                    type="number"
                    value={exercise.weight || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'weight', e.target.value)}
                    placeholder="-"
                  />
                </S.FieldGroup>
                
                <S.FieldGroup>
                  <S.FieldLabel>Unit</S.FieldLabel>
                  <S.FieldInput
                    type="text"
                    value={exercise.weight_unit || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'weight_unit', e.target.value)}
                    placeholder="-"
                  />
                </S.FieldGroup>
                
                <S.FieldGroup>
                  <S.FieldLabel>Duration</S.FieldLabel>
                  <S.FieldInput
                    type="text"
                    value={exercise.duration || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'duration', e.target.value)}
                    placeholder="-"
                  />
                </S.FieldGroup>
                
                <S.FieldGroup>
                  <S.FieldLabel>Note</S.FieldLabel>
                  <S.FieldInput
                    type="text"
                    value={exercise.note || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'note', e.target.value)}
                    placeholder="-"
                  />
                </S.FieldGroup>
              </S.FieldsGrid>
            </S.ExerciseContainer>
          ))}
        </S.RoundContainer>
      ))}
      
      <S.SaveButton onClick={onSave}>
        Save Plan
      </S.SaveButton>
    </S.ReviewContainer>
  );
};
import React from 'react';
import { WorkoutPlan, WorkoutRound, Exercise } from '../types/workout';

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
    roundContainer: {
      marginBottom: '24px',
      padding: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    roundHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: '600',
    },
    roundInput: {
      width: '50px',
      padding: '4px 8px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    exerciseContainer: {
      marginBottom: '12px',
      padding: '12px',
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #e5e5e5',
    },
    exerciseHeader: {
      marginBottom: '8px',
    },
    exerciseName: {
      width: '100%',
      padding: '8px',
      fontSize: '16px',
      fontWeight: '500',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '8px',
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    fieldLabel: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '4px',
    },
    fieldInput: {
      padding: '6px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    saveButton: {
      display: 'block',
      margin: '32px auto 0',
      padding: '12px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#28a745',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Review Your Workout Plan</h2>
      
      {plan.map((round, roundIndex) => (
        <div key={roundIndex} style={styles.roundContainer}>
          <div style={styles.roundHeader}>
            <span>Rounds:</span>
            <input
              type="number"
              value={round.rounds}
              onChange={(e) => updateRounds(roundIndex, Number(e.target.value))}
              style={styles.roundInput}
              min="1"
            />
          </div>
          
          {round.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} style={styles.exerciseContainer}>
              <div style={styles.exerciseHeader}>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'name', e.target.value)}
                  style={styles.exerciseName}
                  placeholder="Exercise name"
                />
              </div>
              
              <div style={styles.fieldsGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Reps</label>
                  <input
                    type="number"
                    value={exercise.reps || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'reps', e.target.value)}
                    style={styles.fieldInput}
                    placeholder="-"
                  />
                </div>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Weight</label>
                  <input
                    type="number"
                    value={exercise.weight || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'weight', e.target.value)}
                    style={styles.fieldInput}
                    placeholder="-"
                  />
                </div>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Unit</label>
                  <input
                    type="text"
                    value={exercise.weight_unit || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'weight_unit', e.target.value)}
                    style={styles.fieldInput}
                    placeholder="-"
                  />
                </div>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Duration</label>
                  <input
                    type="text"
                    value={exercise.duration || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'duration', e.target.value)}
                    style={styles.fieldInput}
                    placeholder="-"
                  />
                </div>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Note</label>
                  <input
                    type="text"
                    value={exercise.note || ''}
                    onChange={(e) => updateExercise(roundIndex, exerciseIndex, 'note', e.target.value)}
                    style={styles.fieldInput}
                    placeholder="-"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <button 
        style={styles.saveButton}
        onClick={onSave}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#218838';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#28a745';
        }}
      >
        Save Plan
      </button>
    </div>
  );
};
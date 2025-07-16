import React, { useState, useEffect } from 'react';
import { WorkoutPlan, ExerciseActual } from '../types/workout';

interface WorkoutLoggerProps {
  plan: WorkoutPlan;
  onSave: (actuals: ExerciseActual[]) => void;
  isSaving: boolean;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ plan, onSave, isSaving }) => {
  const [actuals, setActuals] = useState<ExerciseActual[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  
  // Initialize actuals based on plan
  useEffect(() => {
    const initialActuals: ExerciseActual[] = [];
    plan.forEach((roundSet) => {
      for (let round = 1; round <= roundSet.rounds; round++) {
        roundSet.exercises.forEach((exercise) => {
          initialActuals.push({
            name: exercise.name,
            round: round,
            reps: exercise.reps,
            weight: exercise.weight,
          });
        });
      }
    });
    setActuals(initialActuals);
  }, [plan]);

  const updateActual = (index: number, field: 'reps' | 'weight', value: string) => {
    const newActuals = [...actuals];
    const numValue = value === '' ? null : Number(value);
    newActuals[index] = { ...newActuals[index], [field]: numValue };
    setActuals(newActuals);
  };

  const getTotalRounds = () => {
    return plan.reduce((total, roundSet) => total + roundSet.rounds, 0);
  };

  const getExercisesForRound = (round: number) => {
    let roundCount = 0;
    for (const roundSet of plan) {
      if (round <= roundCount + roundSet.rounds) {
        return actuals.filter(actual => actual.round === round);
      }
      roundCount += roundSet.rounds;
    }
    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(actuals);
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center' as const,
    },
    roundSelector: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '24px',
    },
    roundButton: {
      padding: '8px 16px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    currentRound: {
      fontSize: '20px',
      fontWeight: 'bold',
      minWidth: '100px',
      textAlign: 'center' as const,
    },
    exerciseCard: {
      marginBottom: '16px',
      padding: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: 'white',
    },
    exerciseName: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#333',
    },
    inputRow: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
    },
    inputGroup: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    label: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '4px',
    },
    input: {
      padding: '8px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      width: '100%',
    },
    saveButton: {
      width: '100%',
      padding: '14px',
      marginTop: '24px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: isSaving ? '#6c757d' : '#28a745',
      border: 'none',
      borderRadius: '8px',
      cursor: isSaving ? 'not-allowed' : 'pointer',
    },
    completionNote: {
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#e8f5e9',
      borderRadius: '6px',
      textAlign: 'center' as const,
      fontSize: '14px',
      color: '#2e7d32',
    },
  };

  const totalRounds = getTotalRounds();
  const exercisesInRound = getExercisesForRound(currentRound);
  const actualIndexStart = actuals.findIndex(a => a.round === currentRound);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Log Your Workout</h2>
      
      <div style={styles.roundSelector}>
        <button
          style={{
            ...styles.roundButton,
            opacity: currentRound === 1 ? 0.5 : 1,
          }}
          onClick={() => setCurrentRound(Math.max(1, currentRound - 1))}
          disabled={currentRound === 1}
        >
          ← Previous
        </button>
        
        <div style={styles.currentRound}>
          Round {currentRound} of {totalRounds}
        </div>
        
        <button
          style={{
            ...styles.roundButton,
            opacity: currentRound === totalRounds ? 0.5 : 1,
          }}
          onClick={() => setCurrentRound(Math.min(totalRounds, currentRound + 1))}
          disabled={currentRound === totalRounds}
        >
          Next →
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {exercisesInRound.map((exercise, index) => {
          const actualIndex = actualIndexStart + index;
          return (
            <div key={`${exercise.name}-${exercise.round}-${index}`} style={styles.exerciseCard}>
              <div style={styles.exerciseName}>{exercise.name}</div>
              
              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Reps</label>
                  <input
                    type="number"
                    value={exercise.reps || ''}
                    onChange={(e) => updateActual(actualIndex, 'reps', e.target.value)}
                    style={styles.input}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Weight (lbs)</label>
                  <input
                    type="number"
                    value={exercise.weight || ''}
                    onChange={(e) => updateActual(actualIndex, 'weight', e.target.value)}
                    style={styles.input}
                    placeholder="0"
                    min="0"
                    step="2.5"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="submit"
          style={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Workout Log'}
        </button>
      </form>

      {currentRound === totalRounds && (
        <div style={styles.completionNote}>
          Great job! You're on the final round. Click "Save Workout Log" when done.
        </div>
      )}
    </div>
  );
};
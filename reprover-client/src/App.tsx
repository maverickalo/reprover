import React, { useState, useCallback } from 'react';
import { WorkoutInput } from './components/WorkoutInput';
import { WorkoutPlanReview } from './components/WorkoutPlanReview';
import { Toast } from './components/Toast';
import { ApiClient } from './api/api';
import { WorkoutPlan } from './types/workout';
import './App.css';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [toast, setToast] = useState<ToastState>({ 
    show: false, 
    message: '', 
    type: 'info' 
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const handleParse = async (text: string) => {
    setIsLoading(true);
    try {
      const plan = await ApiClient.parseWorkout(text);
      setWorkoutPlan(plan);
      showToast('Workout parsed successfully!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse workout';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (workoutPlan) {
      console.log('Saving workout plan:', JSON.stringify(workoutPlan, null, 2));
      showToast('Plan saved! (Check console for JSON)', 'success');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      margin: '0',
    },
    divider: {
      width: '100%',
      height: '1px',
      backgroundColor: '#e0e0e0',
      margin: '32px 0',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Reprover</h1>
        <p style={styles.subtitle}>Transform your trainer's messages into structured workout plans</p>
      </header>

      <WorkoutInput onParse={handleParse} isLoading={isLoading} />
      
      {workoutPlan && (
        <>
          <div style={styles.divider} />
          <WorkoutPlanReview 
            plan={workoutPlan} 
            onPlanChange={setWorkoutPlan}
            onSave={handleSavePlan}
          />
        </>
      )}

      {toast.show && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;
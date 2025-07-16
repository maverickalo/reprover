import React, { useState, useCallback } from 'react';
import { WorkoutInput } from './components/WorkoutInput';
import { WorkoutPlanReview } from './components/WorkoutPlanReview';
import { WorkoutLogger } from './components/WorkoutLogger';
import { ProgressChart } from './components/ProgressChart';
import { Toast } from './components/Toast';
import { ApiClient } from './api/api';
import { WorkoutPlan, ExerciseActual, WorkoutLog } from './types/workout';
import './App.css';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

type AppView = 'plan' | 'log' | 'progress';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('plan');
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
      showToast('Plan ready! Switch to "Log Workout" to track your progress.', 'success');
    }
  };

  const handleSaveLog = async (actuals: ExerciseActual[]) => {
    if (!workoutPlan) return;
    
    setIsSaving(true);
    try {
      const workoutLog: WorkoutLog = {
        timestamp: new Date().toISOString(),
        plan: workoutPlan,
        actuals: actuals
      };
      
      // For now, just log to console since backend isn't ready
      console.log('Workout Log:', JSON.stringify(workoutLog, null, 2));
      showToast('Workout logged successfully! (Check console)', 'success');
      
      // TODO: When backend is ready, uncomment this:
      // const response = await ApiClient.logWorkout(workoutLog);
      // showToast('Workout logged successfully!', 'success');
    } catch (error) {
      showToast('Failed to save workout log', 'error');
    } finally {
      setIsSaving(false);
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
    viewToggle: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '24px',
    },
    viewButton: {
      padding: '10px 24px',
      fontSize: '16px',
      fontWeight: '500',
      border: '2px solid #007bff',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    activeView: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    inactiveView: {
      backgroundColor: 'white',
      color: '#007bff',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Reprover</h1>
        <p style={styles.subtitle}>Transform your trainer's messages into structured workout plans</p>
      </header>

      {workoutPlan && (
        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.viewButton,
              ...(currentView === 'plan' ? styles.activeView : styles.inactiveView),
            }}
            onClick={() => setCurrentView('plan')}
          >
            Plan Workout
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(currentView === 'log' ? styles.activeView : styles.inactiveView),
            }}
            onClick={() => setCurrentView('log')}
          >
            Log Workout
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(currentView === 'progress' ? styles.activeView : styles.inactiveView),
            }}
            onClick={() => setCurrentView('progress')}
          >
            Progress
          </button>
        </div>
      )}

      {currentView === 'plan' ? (
        <>
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
        </>
      ) : currentView === 'log' ? (
        workoutPlan && (
          <WorkoutLogger
            plan={workoutPlan}
            onSave={handleSaveLog}
            isSaving={isSaving}
          />
        )
      ) : (
        workoutPlan && (
          <ProgressChart workoutPlan={workoutPlan} />
        )
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
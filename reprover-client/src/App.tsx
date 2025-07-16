import React, { useState, useCallback } from 'react';
import { WorkoutInput } from './components/WorkoutInput';
import { WorkoutPlanReview } from './components/WorkoutPlanReview';
import { WorkoutLogger } from './components/WorkoutLogger';
import { ProgressChart } from './components/ProgressChart';
import { Toast } from './components/Toast';
import { ApiClient } from './api/api';
import { WorkoutPlan, ExerciseActual, WorkoutLog } from './types/workout';
import { GlobalStyles } from './styles/GlobalStyles';
import * as S from './App.styled';
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
      
      await ApiClient.logWorkout(workoutLog);
      showToast('Workout logged successfully!', 'success');
    } catch (error) {
      showToast('Failed to save workout log', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <S.AppContainer>
        <S.Header>
          <S.Title>Reprover</S.Title>
          <S.Subtitle>Transform your trainer's messages into structured workout plans</S.Subtitle>
        </S.Header>

        <S.ContentContainer>
          {workoutPlan && (
            <S.ViewToggle>
              <S.ViewButton
                $active={currentView === 'plan'}
                onClick={() => setCurrentView('plan')}
              >
                Plan Workout
              </S.ViewButton>
              <S.ViewButton
                $active={currentView === 'log'}
                onClick={() => setCurrentView('log')}
              >
                Log Workout
              </S.ViewButton>
              <S.ViewButton
                $active={currentView === 'progress'}
                onClick={() => setCurrentView('progress')}
              >
                Progress
              </S.ViewButton>
            </S.ViewToggle>
          )}

          {currentView === 'plan' ? (
            <>
              <WorkoutInput onParse={handleParse} isLoading={isLoading} />
              
              {workoutPlan && (
                <>
                  <S.Divider />
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
        </S.ContentContainer>

        {toast.show && (
          <Toast 
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </S.AppContainer>
    </>
  );
}

export default App;
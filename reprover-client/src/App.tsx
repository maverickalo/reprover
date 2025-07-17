import React, { useState, useCallback } from 'react';
import { WorkoutInput } from './components/WorkoutInput';
import { WorkoutPlanReview } from './components/WorkoutPlanReview';
import { WorkoutLogger } from './components/WorkoutLogger';
import { ProgressChart } from './components/ProgressChart';
import { WorkoutInfoPanel } from './components/WorkoutInfoPanel';
import { SavedWorkouts } from './components/SavedWorkouts';
import { Toast } from './components/Toast';
import { PageWrapper } from './components/PageWrapper';
import { Button } from './components/Button';
import { ApiClient } from './api/api';
import { WorkoutPlan, ExerciseActual, WorkoutLog } from './types/workout';
import logo from './logo/Flux1.AI-2025-07-16 (2).png';
import './App.css';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

type AppView = 'plan' | 'log' | 'progress' | 'saved';

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

  const handleLoadWorkout = (workout: WorkoutPlan) => {
    setWorkoutPlan(workout);
    setCurrentView('plan');
    showToast('Workout loaded successfully!', 'success');
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
    <PageWrapper pageKey={currentView}>
      <div className="min-h-screen">
        <header className="bg-black border-b border-gray-800 shadow-lg">
          <div className="container py-6">
            <div className="flex justify-center">
              <img src={logo} alt="Reprover Logo" className="h-32 w-auto" />
            </div>
          </div>
        </header>

        <main className="container py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={currentView === 'plan' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('plan')}
            >
              Plan Builder
            </Button>
            {workoutPlan && (
              <>
                <Button
                  variant={currentView === 'log' ? 'primary' : 'ghost'}
                  onClick={() => setCurrentView('log')}
                >
                  Log Workout
                </Button>
                <Button
                  variant={currentView === 'progress' ? 'primary' : 'ghost'}
                  onClick={() => setCurrentView('progress')}
                >
                  Progress
                </Button>
              </>
            )}
            <Button
              variant={currentView === 'saved' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('saved')}
            >
              Saved Workouts
            </Button>
          </div>

          {currentView === 'plan' && (
            <div className="space-y-8">
              <WorkoutInput 
                onParse={handleParse} 
                isLoading={isLoading} 
              />
              
              {workoutPlan && (
                <>
                  <WorkoutInfoPanel workoutPlan={workoutPlan} />
                  <WorkoutPlanReview 
                    workoutPlan={workoutPlan} 
                    onChange={setWorkoutPlan}
                    onSave={handleSavePlan}
                  />
                </>
              )}
            </div>
          )}

          {currentView === 'log' && workoutPlan && (
            <WorkoutLogger 
              workoutPlan={workoutPlan} 
              onSave={handleSaveLog}
              isSaving={isSaving}
            />
          )}

          {currentView === 'progress' && workoutPlan && (
            <ProgressChart workoutPlan={workoutPlan} />
          )}

          {currentView === 'saved' && (
            <SavedWorkouts 
              currentWorkout={workoutPlan}
              onLoadWorkout={handleLoadWorkout}
              onSaveSuccess={() => showToast('Workout saved successfully!', 'success')}
            />
          )}
        </main>

        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      </div>
    </PageWrapper>
  );
}

export default App;
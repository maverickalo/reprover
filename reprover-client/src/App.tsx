import React, { useState, useCallback } from 'react';
import { WorkoutInput } from './components/WorkoutInput';
import { WorkoutPlanReview } from './components/WorkoutPlanReview';
import { WorkoutLogger } from './components/WorkoutLogger';
import { ProgressChart } from './components/ProgressChart';
import { WorkoutInfoPanel } from './components/WorkoutInfoPanel';
import { SavedWorkouts } from './components/SavedWorkouts';
import { WorkoutHistory } from './components/WorkoutHistory';
import { Login } from './components/Login';
import { Toast } from './components/Toast';
import { PageWrapper } from './components/PageWrapper';
import { Button } from './components/Button';
import { ApiClient } from './api/api';
import { WorkoutPlan, ExerciseActual, WorkoutLog } from './types/workout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import logo from './logo/Flux1.AI-2025-07-16 (2).png';
import './App.css';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

type AppView = 'plan' | 'log' | 'progress' | 'saved' | 'history';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('plan');
  const [toast, setToast] = useState<ToastState>({ 
    show: false, 
    message: '', 
    type: 'info' 
  });
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }

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
    setCurrentView('log');
    showToast('Workout loaded! Ready to start logging.', 'success');
  };

  const handleSavePlan = () => {
    if (workoutPlan) {
      console.log('Saving workout plan:', JSON.stringify(workoutPlan, null, 2));
      showToast('Workout saved successfully!', 'success');
      // Redirect to saved workouts page after a short delay
      setTimeout(() => {
        setCurrentView('saved');
      }, 1000);
    }
  };

  const handleSaveLog = async (actuals: ExerciseActual[]) => {
    if (!workoutPlan) return;
    
    setIsSaving(true);
    try {
      const endTime = new Date();
      const duration = workoutStartTime ? endTime.getTime() - workoutStartTime.getTime() : undefined;
      
      const workoutLog: WorkoutLog = {
        timestamp: new Date().toISOString(),
        plan: workoutPlan,
        actuals: actuals,
        duration: duration
      };
      
      await ApiClient.logWorkout(workoutLog);
      showToast('Workout logged successfully!', 'success');
      setWorkoutStartTime(null); // Reset for next workout
    } catch (error) {
      console.error('Failed to save workout log:', error);
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
            <div className="flex justify-between items-center">
              <div className="w-24" /> {/* Spacer for centering */}
              <img src={logo} alt="Reprover Logo" className="h-32 w-auto" />
              <Button
                onClick={logout}
                variant="ghost"
                className="text-gray-400 hover:text-gray-200"
              >
                Logout
              </Button>
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
                  onClick={() => {
                    setCurrentView('log');
                    if (!workoutStartTime) {
                      setWorkoutStartTime(new Date());
                    }
                  }}
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
            <Button
              variant={currentView === 'history' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('history')}
            >
              History
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

          {currentView === 'history' && (
            <WorkoutHistory />
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
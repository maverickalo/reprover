import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { WorkoutLog } from '../types/workout';
import { ApiClient } from '../api/api';

interface WorkoutLogWithId extends WorkoutLog {
  id: string;
  totalExercises?: number;
  exerciseNames?: string[];
}

interface AnalysisState {
  [logId: string]: {
    loading: boolean;
    data?: any;
    error?: string;
  };
}

interface WorkoutHistoryProps {}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = () => {
  const [logs, setLogs] = useState<WorkoutLogWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisState>({});

  useEffect(() => {
    loadWorkoutLogs();
  }, []);

  const loadWorkoutLogs = async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.getWorkoutLogs();
      console.log('Workout logs response:', response);
      console.log('Number of logs:', response.logs.length);
      setLogs(response.logs);
    } catch (error) {
      console.error('Failed to load workout logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (milliseconds?: number): string => {
    if (!milliseconds) return 'N/A';
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const calculateCompletionRate = (log: WorkoutLogWithId): number => {
    const totalPlanned = log.plan.reduce((sum, round) => 
      sum + (round.exercises.length * round.rounds), 0
    );
    const totalCompleted = log.actuals.length;
    return Math.round((totalCompleted / totalPlanned) * 100);
  };

  const getWorkoutSummary = (log: WorkoutLogWithId): string => {
    const allNames = log.plan.flatMap(round => 
      round.exercises.map(ex => ex.name)
    );
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.slice(0, 3).join(', ') + 
      (uniqueNames.length > 3 ? ` +${uniqueNames.length - 3} more` : '');
  };

  const getCompletedExerciseSummary = (log: WorkoutLogWithId): { [key: string]: { reps: number[], weights: number[] } } => {
    const summary: { [key: string]: { reps: number[], weights: number[] } } = {};
    
    log.actuals.forEach(actual => {
      if (!summary[actual.name]) {
        summary[actual.name] = { reps: [], weights: [] };
      }
      if (actual.reps) summary[actual.name].reps.push(actual.reps);
      if (actual.weight) summary[actual.name].weights.push(actual.weight);
    });
    
    return summary;
  };

  const handleAnalyzeWorkout = async (log: WorkoutLogWithId) => {
    setAnalyses(prev => ({
      ...prev,
      [log.id]: { loading: true }
    }));
    
    try {
      const response = await ApiClient.analyzeWorkout(log);
      const scalingData = response.scalingRecommendations;
      
      setAnalyses(prev => ({
        ...prev,
        [log.id]: { loading: false, data: scalingData }
      }));
    } catch (error) {
      console.error('Failed to analyze workout:', error);
      setAnalyses(prev => ({
        ...prev,
        [log.id]: { loading: false, error: 'Failed to analyze workout' }
      }));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-gray-400">Loading workout history...</div>
        </div>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-gray-400">No workout logs yet. Complete a workout to see your history!</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Workout History</h2>
        
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-gray-400">{formatDate(log.timestamp)}</div>
                  <div className="text-lg font-semibold text-gray-100 mt-1">
                    {log.workoutName || getWorkoutSummary(log)}
                  </div>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-400">
                      Duration: <span className="text-gray-200">{formatDuration(log.duration)}</span>
                    </span>
                    <span className="text-gray-400">
                      Completion: <span className="text-gray-200">{calculateCompletionRate(log)}%</span>
                    </span>
                    <span className="text-gray-400">
                      Exercises: <span className="text-gray-200">{log.totalExercises}</span>
                    </span>
                  </div>
                  
                  {/* Completed exercises summary */}
                  <div className="mt-3 text-sm">
                    <div className="text-gray-400 mb-1">Completed:</div>
                    <div className="space-y-1">
                      {Object.entries(getCompletedExerciseSummary(log)).slice(0, 3).map(([exercise, data]) => (
                        <div key={exercise} className="text-gray-300">
                          • {exercise}: 
                          {data.reps.length > 0 && ` ${data.reps.join(', ')} reps`}
                          {data.weights.length > 0 && ` @ ${data.weights.join(', ')}lbs`}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <svg 
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedLog === log.id ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedLog === log.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="mb-4">
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnalyzeWorkout(log);
                      }}
                      disabled={analyses[log.id]?.loading}
                      className="text-sm py-1 px-3"
                    >
                      {analyses[log.id]?.loading ? 'Analyzing...' : 'Analyze & Get Scaling Recommendations'}
                    </Button>
                  </div>
                  
                  {analyses[log.id]?.data && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-100 mb-3">Workout Analysis</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-400">Effort Level</div>
                          <div className="text-gray-200">
                            {analyses[log.id].data.effortLevel}/10 - {analyses[log.id].data.effortDescription}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Strengths</div>
                          <ul className="list-disc list-inside text-sm text-gray-300">
                            {analyses[log.id].data.strengths?.map((strength: string, i: number) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Progression Recommendations</div>
                          <ul className="list-disc list-inside text-sm text-gray-300">
                            {analyses[log.id].data.progressionRecommendations?.map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {analyses[log.id].data.scalingStrategy && (
                          <div>
                            <div className="text-sm text-gray-400">Scaling Strategy</div>
                            <div className="text-sm text-gray-200">{analyses[log.id].data.scalingStrategy}</div>
                          </div>
                        )}
                        
                        {analyses[log.id].data.nextWorkoutTargets && (
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Next Workout Targets</div>
                            <div className="space-y-1">
                              {Object.entries(analyses[log.id].data.nextWorkoutTargets).map(([exercise, target]: [string, any]) => (
                                <div key={exercise} className="text-sm text-gray-300">
                                  <span className="font-medium">{exercise}:</span> 
                                  {target.reps && ` ${target.reps} reps`}
                                  {target.weight && ` @ ${target.weight}lbs`}
                                  {target.notes && ` (${target.notes})`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {analyses[log.id]?.error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-200">
                      {analyses[log.id].error}
                    </div>
                  )}
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Workout Plan</h4>
                  {log.plan.map((round, roundIndex) => (
                    <div key={roundIndex} className="mb-3">
                      <div className="text-sm text-gray-400 mb-1">
                        Round {roundIndex + 1} - {round.rounds}x
                      </div>
                      <div className="ml-4 space-y-1">
                        {round.exercises.map((exercise, exIndex) => (
                          <div key={exIndex} className="text-sm text-gray-300">
                            • {exercise.name}
                            {exercise.reps && ` - ${exercise.reps} reps`}
                            {exercise.weight && ` @ ${exercise.weight}${exercise.weight_unit || 'lbs'}`}
                            {exercise.duration && ` - ${exercise.duration}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {log.actuals.length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 mt-4">Completed</h4>
                      <div className="space-y-1">
                        {log.actuals.map((actual, index) => (
                          <div key={index} className="text-sm text-gray-300 ml-4">
                            • Round {actual.round}: {actual.name}
                            {actual.reps && ` - ${actual.reps} reps`}
                            {actual.weight && ` @ ${actual.weight}lbs`}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
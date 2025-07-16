export interface Exercise {
  name: string;
  reps: number | null;
  weight: number | null;
  weight_unit: string | null;
  duration: string | null;
  note: string | null;
}

export interface WorkoutRound {
  rounds: number;
  exercises: Exercise[];
}

export type WorkoutPlan = WorkoutRound[];

export interface ParseWorkoutRequest {
  text: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

// Logger types
export interface ExerciseActual {
  name: string;
  round: number;
  reps: number | null;
  weight: number | null;
}

export interface WorkoutLog {
  timestamp: string; // ISO string
  plan: WorkoutPlan;
  actuals: ExerciseActual[];
}

export interface LogWorkoutResponse {
  status: 'ok';
  id: string;
}
export interface Exercise {
  name: string;
  reps: number | null;
  weight: number | null;
  weight_range: string | null;
  weight_unit: string | null;
  duration: string | null;
  distance: number | null;
  distance_unit: string | null;
  note: string | null;
  description?: ExerciseDescription;
}

export interface ExerciseDescription {
  form: string;
  mistakes: string;
  muscles: string;
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

// History types
export interface ExerciseHistory {
  date: string;
  reps: number | null;
  weight: number | null;
  round: number;
}

// Workout Info types
export interface WorkoutInfo {
  workoutType: string;
  muscleGroups: string[];
  estimatedCalories: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tips: string[];
  modifications: {
    easier: string[];
    harder: string[];
  };
  recoveryTime: string;
}
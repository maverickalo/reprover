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
import { WorkoutPlan, ParseWorkoutRequest, ApiError, WorkoutLog, LogWorkoutResponse, ExerciseHistory, WorkoutInfo, ExerciseDescription, SavedWorkout } from '../types/workout';

// Use the same domain as the current window to avoid CORS issues
const API_BASE_URL = window.location.origin;

export class ApiClient {
  static async parseWorkout(text: string): Promise<WorkoutPlan> {
    try {
      console.log('Sending request to:', `${API_BASE_URL}/api/parse-workout`);
      console.log('Request body:', { text });
      
      const response = await fetch(`${API_BASE_URL}/api/parse-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text } as ParseWorkoutRequest),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json() as ApiError;
          console.error('API Error:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!responseText) {
        throw new Error('Empty response body');
      }

      try {
        const data = JSON.parse(responseText) as WorkoutPlan;
        console.log('Parsed response:', data);
        return data;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Failed to parse:', responseText);
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async logWorkout(workoutLog: WorkoutLog): Promise<LogWorkoutResponse> {
    try {
      console.log('Sending workout log:', JSON.stringify(workoutLog, null, 2));
      const response = await fetch(`${API_BASE_URL}/api/log-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutLog),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        console.error('Log workout error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as LogWorkoutResponse;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async getExerciseHistory(exerciseName: string): Promise<ExerciseHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history?exercise=${encodeURIComponent(exerciseName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as ExerciseHistory[];
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async getWorkoutInfo(workout: WorkoutPlan): Promise<WorkoutInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workout-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workout }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as WorkoutInfo;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async getExerciseDescription(exerciseName: string): Promise<ExerciseDescription> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/exercise-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseName }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as { description: ExerciseDescription };
      return data.description;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async getSavedWorkouts(): Promise<SavedWorkout[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-workouts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as SavedWorkout[];
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async saveWorkout(name: string, workout: WorkoutPlan): Promise<{ id: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, workout }),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as { id: string };
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async deleteSavedWorkout(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-workouts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async getWorkoutLogs(limit: number = 50, offset: number = 0): Promise<{ logs: any[], hasMore: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workout-logs?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}
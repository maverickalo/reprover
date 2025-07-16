import { WorkoutPlan, ParseWorkoutRequest, ApiError } from '../types/workout';

const API_BASE_URL = 'https://www.reprover.dev';

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
        const errorData = await response.json() as ApiError;
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as WorkoutPlan;
      console.log('Parsed response:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}
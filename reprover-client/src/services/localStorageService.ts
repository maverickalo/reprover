import { WorkoutPlan, SavedWorkout } from '../types/workout';

const STORAGE_KEY = 'reprover_saved_workouts';

export class LocalStorageService {
  static async getSavedWorkouts(): Promise<SavedWorkout[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const workouts = JSON.parse(stored) as SavedWorkout[];
      return workouts.sort((a, b) => 
        new Date(b.updatedAt || b.createdAt).getTime() - 
        new Date(a.updatedAt || a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }

  static async saveWorkout(name: string, workout: WorkoutPlan): Promise<{ id: string }> {
    try {
      const workouts = await this.getSavedWorkouts();
      const id = Date.now().toString();
      const now = new Date().toISOString();
      
      const newWorkout: SavedWorkout = {
        id,
        name,
        workout,
        createdAt: now,
        updatedAt: now
      };
      
      workouts.push(newWorkout);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
      
      return { id };
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save workout');
    }
  }

  static async deleteSavedWorkout(id: string): Promise<void> {
    try {
      const workouts = await this.getSavedWorkouts();
      const filtered = workouts.filter(w => w.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      throw new Error('Failed to delete workout');
    }
  }
}
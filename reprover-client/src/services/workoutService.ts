import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { WorkoutPlan, SavedWorkout } from '../types/workout';
import { auth } from '../firebase';

export class WorkoutService {
  static async getSavedWorkouts(): Promise<SavedWorkout[]> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to get saved workouts');
    }

    try {
      const workoutsRef = collection(db, 'savedWorkouts');
      const q = query(
        workoutsRef, 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const workouts: SavedWorkout[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workouts.push({
          id: doc.id,
          name: data.name,
          workout: data.workout,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        });
      });
      
      return workouts;
    } catch (error) {
      console.error('Error fetching saved workouts:', error);
      throw new Error('Failed to fetch saved workouts');
    }
  }

  static async saveWorkout(name: string, workout: WorkoutPlan): Promise<{ id: string }> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to save workouts');
    }

    try {
      // Clean the workout data to remove undefined values
      const cleanedWorkout = workout.map(round => ({
        rounds: round.rounds,
        exercises: round.exercises.map(exercise => {
          const cleanExercise: any = {
            name: exercise.name
          };
          
          // Only include defined values
          if (exercise.reps !== null && exercise.reps !== undefined) cleanExercise.reps = exercise.reps;
          if (exercise.weight !== null && exercise.weight !== undefined) cleanExercise.weight = exercise.weight;
          if (exercise.weight_range !== null && exercise.weight_range !== undefined) cleanExercise.weight_range = exercise.weight_range;
          if (exercise.weight_unit !== null && exercise.weight_unit !== undefined) cleanExercise.weight_unit = exercise.weight_unit;
          if (exercise.duration !== null && exercise.duration !== undefined) cleanExercise.duration = exercise.duration;
          if (exercise.distance !== null && exercise.distance !== undefined) cleanExercise.distance = exercise.distance;
          if (exercise.distance_unit !== null && exercise.distance_unit !== undefined) cleanExercise.distance_unit = exercise.distance_unit;
          if (exercise.note !== null && exercise.note !== undefined) cleanExercise.note = exercise.note;
          
          return cleanExercise;
        })
      }));

      const workoutsRef = collection(db, 'savedWorkouts');
      const docRef = await addDoc(workoutsRef, {
        name,
        workout: cleanedWorkout,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: docRef.id };
    } catch (error) {
      console.error('Error saving workout:', error);
      throw new Error('Failed to save workout');
    }
  }

  static async deleteSavedWorkout(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to delete workouts');
    }

    try {
      const workoutRef = doc(db, 'savedWorkouts', id);
      await deleteDoc(workoutRef);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }
}
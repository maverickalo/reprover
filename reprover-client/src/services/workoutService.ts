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
      const workoutsRef = collection(db, 'savedWorkouts');
      const docRef = await addDoc(workoutsRef, {
        name,
        workout,
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
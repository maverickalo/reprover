import { db } from '../firebase.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all saved workouts
      const workoutsRef = db.collection('savedWorkouts');
      const snapshot = await workoutsRef.orderBy('createdAt', 'desc').get();
      
      const workouts = [];
      snapshot.forEach((doc) => {
        workouts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json(workouts);
    }
    
    if (req.method === 'POST') {
      // Save a new workout
      const { name, workout } = req.body;
      
      if (!name || !workout) {
        return res.status(400).json({ error: 'Name and workout are required' });
      }
      
      const workoutsRef = db.collection('savedWorkouts');
      const docRef = await workoutsRef.add({
        name,
        workout,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return res.status(200).json({ 
        id: docRef.id,
        message: 'Workout saved successfully' 
      });
    }
    
    if (req.method === 'DELETE') {
      // Delete a saved workout
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Workout ID is required' });
      }
      
      const workoutsRef = db.collection('savedWorkouts');
      await workoutsRef.doc(id).delete();
      
      return res.status(200).json({ 
        message: 'Workout deleted successfully' 
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling saved workouts:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
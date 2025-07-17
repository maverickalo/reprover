// Temporary in-memory storage for workouts
// In production, this should use a proper database
const workouts = new Map();

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
      const allWorkouts = Array.from(workouts.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return res.status(200).json(allWorkouts);
    }
    
    if (req.method === 'POST') {
      // Save a new workout
      const { name, workout } = req.body;
      
      if (!name || !workout) {
        return res.status(400).json({ error: 'Name and workout are required' });
      }
      
      const id = Date.now().toString();
      const workoutData = {
        id,
        name,
        workout,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      workouts.set(id, workoutData);
      
      return res.status(200).json({ 
        id,
        message: 'Workout saved successfully (in-memory storage)' 
      });
    }
    
    if (req.method === 'DELETE') {
      // Delete a saved workout
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Workout ID is required' });
      }
      
      workouts.delete(id);
      
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
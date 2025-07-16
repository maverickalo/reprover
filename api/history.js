import { getDb } from '../lib/firebase.js';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { exercise } = req.query;
    
    if (!exercise || typeof exercise !== 'string') {
      return res.status(400).json({ error: 'Exercise name is required' });
    }
    
    // Initialize Firestore
    const db = getDb();
    
    // Query logs collection for all documents
    const logsSnapshot = await db.collection('logs')
      .orderBy('timestamp', 'desc')
      .get();
    
    // Process logs to extract exercise history
    const history = [];
    
    logsSnapshot.forEach(doc => {
      const log = doc.data();
      const date = log.timestamp;
      
      // Find all instances of this exercise in the actuals
      log.actuals.forEach(actual => {
        if (actual.name.toLowerCase() === exercise.toLowerCase()) {
          history.push({
            date,
            reps: actual.reps,
            weight: actual.weight,
            round: actual.round
          });
        }
      });
    });
    
    // Sort by date (oldest first for charting)
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    res.status(200).json(history);
    
  } catch (error) {
    console.error('History error:', error);
    
    // If Firebase is not configured, return empty array
    if (error.code === 'app/no-app' || error.message?.includes('projectId')) {
      return res.status(200).json([]);
    }
    
    res.status(500).json({ 
      error: 'Failed to get exercise history', 
      details: error.message 
    });
  }
}
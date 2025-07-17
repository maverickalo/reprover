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
    const { limit = 50, offset = 0 } = req.query;
    
    // Initialize Firestore
    const db = getDb();
    
    // Query logs collection, ordered by timestamp descending
    const logsSnapshot = await db.collection('logs')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();
    
    // Process logs
    const logs = [];
    logsSnapshot.forEach(doc => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        ...data,
        // Calculate workout duration if start and end times exist
        duration: data.duration || null,
        // Calculate total exercises completed
        totalExercises: data.actuals ? data.actuals.length : 0,
        // Get unique exercise names from plan
        exerciseNames: data.plan ? 
          [...new Set(data.plan.flatMap(round => 
            round.exercises.map(ex => ex.name)
          ))] : []
      });
    });
    
    res.status(200).json({
      logs,
      hasMore: logs.length === parseInt(limit)
    });
    
  } catch (error) {
    console.error('Get workout logs error:', error);
    res.status(500).json({ 
      error: 'Failed to get workout logs', 
      details: error.message 
    });
  }
}
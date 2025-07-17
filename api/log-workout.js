import { z } from 'zod';
import { getDb } from '../lib/firebase.js';

// Define schemas for validation
const exerciseSchema = z.object({
  name: z.string(),
  reps: z.number().nullable(),
  weight: z.number().nullable(),
  weight_unit: z.string().nullable(),
  duration: z.string().nullable(),
  note: z.string().nullable()
});

const workoutRoundSchema = z.object({
  rounds: z.number(),
  exercises: z.array(exerciseSchema)
});

const exerciseActualSchema = z.object({
  name: z.string(),
  round: z.number(),
  reps: z.number().nullable(),
  weight: z.number().nullable()
});

const workoutLogSchema = z.object({
  timestamp: z.string(), // ISO string
  plan: z.array(workoutRoundSchema),
  actuals: z.array(exerciseActualSchema),
  duration: z.number().optional(), // Duration in milliseconds
  workoutName: z.string().optional() // Name of the saved workout if applicable
});

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const workoutLog = workoutLogSchema.parse(req.body);
    
    // Initialize Firestore
    const db = getDb();
    
    // Add document to 'logs' collection
    const docRef = await db.collection('logs').add({
      ...workoutLog,
      createdAt: new Date().toISOString()
    });
    
    // Return success response
    res.status(200).json({
      status: 'ok',
      id: docRef.id
    });
    
  } catch (error) {
    console.error('Log workout error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to log workout', 
      details: error.message 
    });
  }
}
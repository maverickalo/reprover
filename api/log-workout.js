import { z } from 'zod';
import { getDb } from '../lib/firebase.js';

// Define schemas for validation
const exerciseSchema = z.object({
  name: z.string(),
  reps: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  weight_range: z.string().nullable().optional(),
  weight_unit: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  distance: z.number().nullable().optional(),
  distance_unit: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  description: z.object({
    form: z.string(),
    mistakes: z.string(),
    muscles: z.string(),
    youtubeQuery: z.string()
  }).optional()
}).passthrough(); // Allow extra fields

const workoutRoundSchema = z.object({
  rounds: z.number(),
  exercises: z.array(exerciseSchema)
}).passthrough();

const exerciseActualSchema = z.object({
  name: z.string(),
  round: z.number(),
  reps: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  weight_unit: z.string().optional()
}).passthrough();

const workoutLogSchema = z.object({
  timestamp: z.string(), // ISO string
  plan: z.array(workoutRoundSchema),
  actuals: z.array(exerciseActualSchema),
  duration: z.number().optional(), // Duration in milliseconds
  workoutName: z.string().optional() // Name of the saved workout if applicable
}).passthrough();

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
    // Log the incoming request body for debugging
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    // Clean undefined values from the request body
    const cleanData = JSON.parse(JSON.stringify(req.body));
    
    // Validate request body
    const workoutLog = workoutLogSchema.parse(cleanData);
    
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
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
      console.error('Failed to validate body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: error.errors,
        receivedData: req.body // Include this for debugging
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to log workout', 
      details: error.message 
    });
  }
}
import { z } from 'zod';
import { getDb } from '../lib/firebase.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeWorkoutSchema = z.object({
  timestamp: z.string(),
  workoutName: z.string().optional(),
  plan: z.array(z.object({
    round_name: z.string().optional(),
    rounds: z.number(),
    exercises: z.array(z.object({
      name: z.string(),
      reps: z.number().optional().nullable(),
      weight: z.number().optional().nullable(),
      weight_range: z.string().optional().nullable(),
      weight_unit: z.string().optional().nullable(),
      duration: z.string().optional().nullable(),
      distance: z.number().optional().nullable(),
      distance_unit: z.string().optional().nullable(),
      note: z.string().optional().nullable()
    }))
  })),
  actuals: z.array(z.object({
    round: z.number(),
    name: z.string(),
    reps: z.number().optional().nullable(),
    weight: z.number().optional().nullable(),
    completed: z.boolean().optional()
  })),
  duration: z.number().optional()
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
    console.log('Analyze workout request body:', JSON.stringify(req.body, null, 2));
    const workout = analyzeWorkoutSchema.parse(req.body);
    
    // Get user's workout history for context
    const db = getDb();
    const historySnapshot = await db.collection('logs')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
    
    const history = [];
    historySnapshot.forEach(doc => {
      const data = doc.data();
      // Only include similar workouts for better comparison
      if (data.timestamp !== workout.timestamp) {
        history.push(data);
      }
    });
    
    // Create a prompt for GPT-4
    const prompt = `Analyze this workout and provide recommendations for progression and effort assessment.

Current Workout:
${JSON.stringify(workout, null, 2)}

Previous Workouts (last 10):
${JSON.stringify(history, null, 2)}

Please provide:
1. Effort Level Assessment (1-10 scale based on completion rate and weights used)
2. Progression Recommendations (how to scale up next time)
3. Areas of Strength (what went well)
4. Areas for Improvement
5. Specific weight/rep increases for next workout
6. Overall scaling strategy (e.g., increase weight by 5-10%, add 1-2 reps, reduce rest time)

Format as JSON with these fields:
{
  "effortLevel": number,
  "effortDescription": string,
  "progressionRecommendations": string[],
  "strengths": string[],
  "improvements": string[],
  "nextWorkoutTargets": {
    "exerciseName": { "weight": number, "reps": number, "notes": string }
  },
  "scalingStrategy": string
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional fitness coach analyzing workout data. Provide specific, actionable recommendations based on the workout history. Focus on progressive overload and safe scaling strategies.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    
    res.status(200).json({
      analysis: response.choices[0].message.content,
      scalingRecommendations: analysis
    });
    
  } catch (error) {
    console.error('Analyze workout error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: error.errors,
        issues: error.issues 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze workout', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
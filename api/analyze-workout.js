import { z } from 'zod';
import { getDb } from '../lib/firebase.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeWorkoutSchema = z.object({
  workoutId: z.string()
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
    const { workoutId } = analyzeWorkoutSchema.parse(req.body);
    
    // Get the specific workout
    const db = getDb();
    const workoutDoc = await db.collection('logs').doc(workoutId).get();
    
    if (!workoutDoc.exists) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    const workout = workoutDoc.data();
    
    // Get user's workout history for context
    const historySnapshot = await db.collection('logs')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
    
    const history = [];
    historySnapshot.forEach(doc => {
      if (doc.id !== workoutId) {
        history.push(doc.data());
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

Format as JSON with these fields:
{
  "effortLevel": number,
  "effortDescription": string,
  "progressionRecommendations": string[],
  "strengths": string[],
  "improvements": string[],
  "nextWorkoutTargets": {
    "exerciseName": { "weight": number, "reps": number, "notes": string }
  }
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional fitness coach analyzing workout data. Provide specific, actionable recommendations based on the workout history.'
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
    
    // Save analysis to the workout document
    await db.collection('logs').doc(workoutId).update({
      analysis,
      analyzedAt: new Date().toISOString()
    });
    
    res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analyze workout error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze workout', 
      details: error.message 
    });
  }
}
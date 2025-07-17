import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7
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
    const { workout } = req.body;

    if (!workout) {
      return res.status(400).json({ error: 'Workout data is required' });
    }

    const prompt = `Analyze this workout and provide helpful information:
${JSON.stringify(workout, null, 2)}

Please provide:
1. Workout Type: (e.g., HIIT, Strength, Cardio, Mixed)
2. Primary Muscle Groups: List the main muscles worked
3. Estimated Calories: Rough estimate for a 150lb person
4. Difficulty Level: Beginner/Intermediate/Advanced
5. Tips: 2-3 tips for performing this workout effectively
6. Modifications: Suggest easier and harder variations
7. Recovery: Recommended rest between sessions

Format as JSON with these keys: workoutType, muscleGroups[], estimatedCalories, difficulty, tips[], modifications{easier[], harder[]}, recoveryTime`;

    const response = await model.invoke(prompt);
    const content = response.content;
    
    // Try to parse the JSON from the response
    let workoutInfo;
    try {
      // Extract JSON from the response (it might be wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workoutInfo = JSON.parse(jsonMatch[0]);
      } else {
        workoutInfo = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse workout info:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse workout analysis',
        raw: content 
      });
    }

    res.status(200).json(workoutInfo);
  } catch (error) {
    console.error('Workout info error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze workout',
      details: error.message 
    });
  }
}
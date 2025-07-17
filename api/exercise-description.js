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
    const { exerciseName } = req.body;

    if (!exerciseName) {
      return res.status(400).json({ error: 'Exercise name is required' });
    }

    const prompt = `Provide a brief, instructional description for the exercise "${exerciseName}". 
    Include:
    1. Proper form and technique (2-3 key points)
    2. Common mistakes to avoid (1-2 points)
    3. Which muscles it targets
    4. A good YouTube search query to find a tutorial video for this exercise (be specific, like "Jeff Nippard ${exerciseName} form" or "Athlean-X ${exerciseName} tutorial")
    
    Keep the descriptions concise - max 3-4 sentences total. Be direct and actionable.
    
    Format the response as JSON with keys: form, mistakes, muscles, youtubeQuery`;

    const response = await model.invoke([
      { role: 'system', content: 'You are a professional fitness instructor providing clear, concise exercise guidance.' },
      { role: 'user', content: prompt }
    ]);

    // Parse the response
    let description;
    try {
      const content = response.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        description = JSON.parse(jsonMatch[0]);
      } else {
        description = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      description = {
        form: "Focus on controlled movement and proper breathing throughout the exercise.",
        mistakes: "Avoid rushing through the movement.",
        muscles: "Various muscle groups",
        youtubeQuery: `${exerciseName} exercise tutorial form`
      };
    }

    res.status(200).json({ description });
  } catch (error) {
    console.error('Error getting exercise description:', error);
    res.status(500).json({ error: 'Failed to get exercise description' });
  }
}
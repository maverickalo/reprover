import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 150
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.query;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Exercise name is required' });
    }
    
    // Generate exercise description using AI
    const prompt = `Provide a brief, informative description of the exercise "${name}" in 2-3 sentences. 
    Include the primary muscles worked and basic form tips. Keep it under 300 characters.`;
    
    const response = await model.invoke(prompt);
    const description = response.content.trim();
    
    // For now, videoUrl is null (YouTube integration can be added later)
    const result = {
      description: description.substring(0, 300), // Ensure max 300 chars
      videoUrl: null
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Exercise info error:', error);
    res.status(500).json({ 
      error: 'Failed to get exercise information', 
      details: error.message 
    });
  }
}
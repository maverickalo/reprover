import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { parseWorkout, workoutSchema } from './agent.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/parse-workout', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const parsedOutput = await parseWorkout(text);
    const validatedData = workoutSchema.parse(parsedOutput);
    
    res.json(validatedData);
  } catch (error) {
    console.error('Agent error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Agent failed', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Workout parser server running on port ${PORT}`);
});
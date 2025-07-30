import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { parseWorkout, workoutSchema } from './agent.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// Serve static files from React build in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'reprover-client/build')));
}

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

// Catch all handler - send React app for any route not handled by API
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'reprover-client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Workout parser server running on port ${PORT}`);
});
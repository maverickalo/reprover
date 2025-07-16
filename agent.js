import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';

const workoutSchema = z.array(
  z.object({
    rounds: z.number(),
    exercises: z.array(
      z.object({
        name: z.string(),
        reps: z.number().nullable(),
        weight: z.number().nullable(),
        weight_unit: z.string().nullable(),
        duration: z.string().nullable(),
        note: z.string().nullable()
      })
    )
  })
);

const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0
});

const parseWorkout = async (text) => {
  const systemPrompt = `You are a workout parsing assistant. Extract workout information from text and return it as JSON.
  
  The response MUST be a JSON array (starting with [ and ending with ]).
  Each element in the array represents a set of rounds with exercises.
  
  Each array element must have this structure:
  {
    "rounds": <number>,
    "exercises": [
      {
        "name": <string>,
        "reps": <number or null>,
        "weight": <number or null>,
        "weight_unit": <string or null>,
        "duration": <string or null>,
        "note": <string or null>
      }
    ]
  }
  
  Example response for "3 rounds: 10 push-ups, 15 squats at 135lbs":
  [
    {
      "rounds": 3,
      "exercises": [
        {"name": "push-ups", "reps": 10, "weight": null, "weight_unit": null, "duration": null, "note": null},
        {"name": "squats", "reps": 15, "weight": 135, "weight_unit": "lbs", "duration": null, "note": null}
      ]
    }
  ]
  
  Return ONLY the JSON array, no other text.`;
  
  const response = await model.invoke([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ]);
  
  const content = response.content.trim();
  
  // Try to extract JSON array from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  // If no array found, try parsing as-is
  return JSON.parse(content);
};

export { parseWorkout, workoutSchema };
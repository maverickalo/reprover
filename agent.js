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
        distance: z.number().nullable(),
        distance_unit: z.string().nullable(),
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
        "distance": <number or null>,
        "distance_unit": <string or null>,
        "note": <string or null>
      }
    ]
  }
  
  Example responses:
  - "3 rounds: 10 push-ups, 15 squats at 135lbs":
    [{"rounds": 3, "exercises": [
      {"name": "push-ups", "reps": 10, "weight": null, "weight_unit": null, "duration": null, "distance": null, "distance_unit": null, "note": null},
      {"name": "squats", "reps": 15, "weight": 135, "weight_unit": "lbs", "duration": null, "distance": null, "distance_unit": null, "note": null}
    ]}]
  
  - "Row 1000 meters, then 20 burpees":
    [{"rounds": 1, "exercises": [
      {"name": "row", "reps": null, "weight": null, "weight_unit": null, "duration": null, "distance": 1000, "distance_unit": "meters", "note": null},
      {"name": "burpees", "reps": 20, "weight": null, "weight_unit": null, "duration": null, "distance": null, "distance_unit": null, "note": null}
      ]
    }
  ]
  
  Important parsing rules:
  - If something involves distance (meters, km, miles, yards), put the number in "distance" and unit in "distance_unit"
  - Duration is for time-based exercises (e.g., "hold plank for 30 seconds")
  - Common distance exercises: row, run, bike, swim, ski
  
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
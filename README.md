# Reprover - Workout Parser API

A serverless API that uses AI to parse natural language workout descriptions into structured JSON data.

## API Endpoint

```
POST /api/parse-workout
```

### Request
```json
{
  "text": "3 rounds: 10 push-ups, 15 squats at 135lbs, 30 second plank"
}
```

### Response
```json
[
  {
    "rounds": 3,
    "exercises": [
      {
        "name": "push-ups",
        "reps": 10,
        "weight": null,
        "weight_unit": null,
        "duration": null,
        "note": null
      },
      {
        "name": "squats",
        "reps": 15,
        "weight": 135,
        "weight_unit": "lbs",
        "duration": null,
        "note": null
      },
      {
        "name": "plank",
        "reps": null,
        "weight": null,
        "weight_unit": null,
        "duration": "30 seconds",
        "note": null
      }
    ]
  }
]
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Set up your OpenAI API key as a Vercel secret:
```bash
vercel secrets add openai-api-key "your-openai-api-key-here"
```

3. Deploy to Vercel:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project?: No
   - Project name: reprover
   - Directory: ./
   - Override settings: No

Your API will be available at: `https://reprover.vercel.app/api/parse-workout`

## Local Development

1. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your-key-here
```

2. Install dependencies:
```bash
npm install
```

3. Run locally:
```bash
vercel dev
```

The API will be available at `http://localhost:3000/api/parse-workout`
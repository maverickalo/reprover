const testWorkout = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/parse-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: "3 rounds: 10 push-ups, 15 squats at 135lbs, 30 second plank"
      })
    });
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testWorkout();
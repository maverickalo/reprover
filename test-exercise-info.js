const testExerciseInfo = async () => {
  try {
    // Test with different exercises
    const exercises = ['push-ups', 'squats', 'plank', 'deadlift'];
    
    for (const exercise of exercises) {
      console.log(`\nFetching info for: ${exercise}`);
      console.log('---');
      
      const response = await fetch(`http://localhost:3000/api/exercise-info?name=${encodeURIComponent(exercise)}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Description:', data.description);
        console.log('Video URL:', data.videoUrl || 'Not available');
      } else {
        console.log('Error:', data.error);
      }
    }
    
    // Test error case
    console.log('\nTesting error case (no name parameter):');
    console.log('---');
    const errorResponse = await fetch('http://localhost:3000/api/exercise-info');
    const errorData = await errorResponse.json();
    console.log('Expected error:', errorData.error);
    
  } catch (error) {
    console.error('Test error:', error);
  }
};

testExerciseInfo();
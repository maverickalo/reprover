import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';

const testOpenAI = async () => {
  try {
    console.log('Testing OpenAI connection...');
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key length:', process.env.OPENAI_API_KEY?.length);
    
    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0
    });
    
    const response = await model.invoke('Say hello');
    console.log('OpenAI response:', response.content);
  } catch (error) {
    console.error('OpenAI test error:', error.message);
  }
};

testOpenAI();
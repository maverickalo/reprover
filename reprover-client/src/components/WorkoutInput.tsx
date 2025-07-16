import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { Card } from './Card';

interface WorkoutInputProps {
  onParse: (text: string) => void;
  isLoading: boolean;
}

export const WorkoutInput: React.FC<WorkoutInputProps> = ({ onParse, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onParse(inputText);
    }
  };

  const placeholderText = `Example:
Round 1: 3 rounds
- 20 burpees
- 15 pull-ups
- 10 deadlifts @ 225lbs

Round 2: 4 rounds
- 30 wall balls
- 20 box jumps
- 10 muscle-ups`;

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Parse Workout</h2>
          <p className="text-gray-400">Paste your trainer's workout text below</p>
        </div>
        
        <TextInput
          multiline
          rows={10}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={placeholderText}
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          variant="primary"
          disabled={!inputText.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Parsing...
            </motion.span>
          ) : (
            'Parse Workout'
          )}
        </Button>
      </form>
    </Card>
  );
};
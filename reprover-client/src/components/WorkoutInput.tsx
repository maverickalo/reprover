import React, { useState } from 'react';
import * as S from './WorkoutInput.styled';

interface WorkoutInputProps {
  onParse: (text: string) => void;
  isLoading: boolean;
}

export const WorkoutInput: React.FC<WorkoutInputProps> = ({ onParse, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onParse(text);
    }
  };

  return (
    <S.InputContainer>
      <S.Form onSubmit={handleSubmit}>
        <S.Label htmlFor="workout-text">
          Paste your trainer's workout message:
        </S.Label>
        <S.TextArea
          id="workout-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., 3 rounds: 10 push-ups, 15 squats at 135lbs, 30 second plank"
          disabled={isLoading}
        />
        <S.ParseButton 
          type="submit" 
          disabled={isLoading || !text.trim()}
          $loading={isLoading}
        >
          {isLoading && <S.LoadingSpinner />}
          {isLoading ? 'Parsing...' : 'Parse Workout'}
        </S.ParseButton>
      </S.Form>
    </S.InputContainer>
  );
};
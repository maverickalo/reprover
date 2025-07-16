import React, { useState } from 'react';

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

  const styles = {
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    textarea: {
      width: '100%',
      minHeight: '150px',
      padding: '12px',
      fontSize: '16px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: isLoading ? '#cccccc' : '#007bff',
      border: 'none',
      borderRadius: '8px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s',
    },
    label: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="workout-text" style={styles.label}>
          Paste your trainer's workout message:
        </label>
        <textarea
          id="workout-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.textarea}
          placeholder="e.g., 3 rounds: 10 push-ups, 15 squats at 135lbs, 30 second plank"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          style={styles.button}
          disabled={isLoading || !text.trim()}
          onMouseEnter={(e) => {
            if (!isLoading && text.trim()) {
              e.currentTarget.style.backgroundColor = '#0056b3';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#007bff';
            }
          }}
        >
          {isLoading ? 'Parsing...' : 'Parse Workout'}
        </button>
      </form>
    </div>
  );
};
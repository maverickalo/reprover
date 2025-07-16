import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  multiline?: boolean;
  rows?: number;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  multiline = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  const inputClasses = `input-base w-full ${className}`;
  
  if (multiline) {
    return (
      <textarea
        className={inputClasses}
        rows={rows}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }
  
  return (
    <input
      className={inputClasses}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
};
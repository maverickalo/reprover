import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  disabled = false,
  children,
  className = '',
  ...props 
}) => {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  const disabledClasses = disabled ? 'btn-disabled' : '';
  
  return (
    <motion.button
      className={`${baseClasses} ${disabledClasses} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hover = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`card ${className}`}
      whileHover={hover ? { y: -2, boxShadow: "0 4px 12px 0 rgba(0,0,0,0.35)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
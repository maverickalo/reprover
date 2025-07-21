import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';
import { pageVariants } from '../animations/pageVariants';

interface PageWrapperProps {
  children: React.ReactNode;
  pageKey?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageKey }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion ? {} : pageVariants;
  
  return (
    <AnimatePresenceWrapper mode="wait">
      <motion.main
        key={pageKey || 'default'}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        className="min-h-screen"
      >
        {children}
      </motion.main>
    </AnimatePresenceWrapper>
  );
};
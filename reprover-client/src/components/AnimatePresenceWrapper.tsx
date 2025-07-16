import React from 'react';
import { AnimatePresence } from 'framer-motion';

interface AnimatePresenceWrapperProps {
  children: React.ReactNode;
  mode?: "wait" | "sync" | "popLayout";
}

// Wrapper to fix TypeScript issues with AnimatePresence in React 18
export const AnimatePresenceWrapper: React.FC<AnimatePresenceWrapperProps> = ({ children, mode }) => {
  return (
    <>{React.createElement(AnimatePresence as any, { mode }, children)}</>
  );
};
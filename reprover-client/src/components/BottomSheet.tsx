import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresenceWrapper>
      <>
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ opacity }}
          onClick={onClose}
        />
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-card-bg rounded-t-2xl z-50 max-h-[90vh] overflow-hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ y }}
        >
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-4" />
          <div className="px-4 pb-8 overflow-y-auto max-h-[calc(90vh-2rem)]">
            {children}
          </div>
        </motion.div>
      </>
    </AnimatePresenceWrapper>
  );
};
import React, { useEffect } from 'react';
import * as S from './Toast.styled';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <S.ToastContainer $type={type}>
      <S.ToastMessage>{message}</S.ToastMessage>
      <S.ToastCloseButton onClick={onClose}>
        ×
      </S.ToastCloseButton>
    </S.ToastContainer>
  );
};
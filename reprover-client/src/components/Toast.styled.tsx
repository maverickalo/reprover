import styled from 'styled-components';
import { theme } from '../styles/theme';

export const ToastContainer = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  position: fixed;
  bottom: ${theme.spacing.xl};
  right: ${theme.spacing.xl};
  max-width: 400px;
  padding: ${theme.spacing.lg};
  background: ${props => 
    props.$type === 'success' ? theme.colors.success :
    props.$type === 'error' ? theme.colors.error :
    theme.colors.info
  };
  color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  animation: slideInRight ${theme.transitions.normal} ease-out;
  
  @media (max-width: 768px) {
    left: ${theme.spacing.md};
    right: ${theme.spacing.md};
    bottom: ${theme.spacing.md};
    max-width: none;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const ToastMessage = styled.span`
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.normal};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.cardBackground};
  font-size: ${theme.typography.fontSize['2xl']};
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
import styled from 'styled-components';
import { theme } from '../styles/theme';

export const InputContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const Label = styled.label`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
  display: block;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  font-family: ${theme.typography.fontFamily.sans};
  line-height: ${theme.typography.lineHeight.relaxed};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.cardBackground};
  color: ${theme.colors.textPrimary};
  resize: vertical;
  transition: all ${theme.transitions.fast};
  
  &::placeholder {
    color: ${theme.colors.textLight};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
  
  &:disabled {
    background: ${theme.colors.backgroundSecondary};
    cursor: not-allowed;
  }
`;

export const ParseButton = styled.button<{ $loading?: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.cardBackground};
  background: ${props => props.$loading ? theme.colors.textLight : theme.colors.primary};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  
  &:hover:not(:disabled) {
    background: ${props => props.$loading ? theme.colors.textLight : theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${theme.colors.border};
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${theme.colors.cardBackground}40;
  border-top-color: ${theme.colors.cardBackground};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
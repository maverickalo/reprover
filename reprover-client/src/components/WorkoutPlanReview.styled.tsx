import styled from 'styled-components';
import { theme } from '../styles/theme';

export const ReviewContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

export const ReviewHeader = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  color: ${theme.colors.textPrimary};
`;

export const RoundContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export const RoundHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
`;

export const RoundInput = styled.input`
  width: 60px;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.textPrimary};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background: ${theme.colors.cardBackground};
  }
`;

export const ExerciseContainer = styled.div`
  margin-bottom: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.borderLight};
  transition: all ${theme.transitions.fast};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${theme.colors.border};
  }
`;

export const ExerciseName = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  border: 2px solid transparent;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.cardBackground};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${theme.spacing.md};
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const FieldLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textLight};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const FieldInput = styled.input`
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.base};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.cardBackground};
  color: ${theme.colors.textPrimary};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

export const SaveButton = styled.button`
  display: block;
  margin: ${theme.spacing['2xl']} auto 0;
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.cardBackground};
  background: ${theme.colors.success};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  min-width: 200px;
  
  &:hover {
    background: ${theme.colors.success}dd;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
`;
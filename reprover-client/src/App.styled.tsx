import styled from 'styled-components';
import { theme } from './styles/theme';

export const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, ${theme.colors.background} 0%, ${theme.colors.backgroundSecondary} 100%);
`;

export const Header = styled.header`
  text-align: center;
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl} ${theme.spacing['2xl']};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background: ${theme.colors.border};
  }
`;

export const Title = styled.h1`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

export const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.textSecondary};
  margin: 0;
  font-weight: ${theme.typography.fontWeight.light};
`;

export const ViewToggle = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing['2xl']};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.xl};
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow: ${theme.shadows.sm};
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$active ? theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? theme.colors.cardBackground : theme.colors.textSecondary};
  transition: all ${theme.transitions.fast};
  min-width: 120px;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? theme.colors.primaryDark : theme.colors.backgroundSecondary};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.xl} ${theme.spacing['3xl']};
  animation: fadeIn ${theme.transitions.normal} ease-out;
  
  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md} ${theme.spacing['2xl']};
  }
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${theme.colors.border};
  margin: ${theme.spacing['2xl']} 0;
`;
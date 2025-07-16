import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${theme.typography.fontFamily.sans};
    font-size: ${theme.typography.fontSize.base};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.textPrimary};
    background-color: ${theme.colors.background};
    min-height: 100vh;
    transition: all ${theme.transitions.normal};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.semibold};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.textPrimary};
    margin-bottom: ${theme.spacing.md};
  }

  h1 {
    font-size: ${theme.typography.fontSize['4xl']};
    font-weight: ${theme.typography.fontWeight.bold};
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: ${theme.typography.fontSize['3xl']};
    letter-spacing: -0.01em;
  }

  h3 {
    font-size: ${theme.typography.fontSize['2xl']};
  }

  p {
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.textSecondary};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primaryDark};
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    transition: all ${theme.transitions.fast};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea {
    font-family: inherit;
    font-size: inherit;
    transition: all ${theme.transitions.fast};
    
    &::placeholder {
      color: ${theme.colors.textLight};
    }

    &:focus {
      outline: none;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.backgroundSecondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: ${theme.borderRadius.full};
    transition: background ${theme.transitions.fast};

    &:hover {
      background: ${theme.colors.textLight};
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .fade-in {
    animation: fadeIn ${theme.transitions.normal} ease-out;
  }

  .slide-in {
    animation: slideIn ${theme.transitions.normal} ease-out;
  }
`;
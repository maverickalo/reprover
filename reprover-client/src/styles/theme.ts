export const theme = {
  colors: {
    // Primary palette - earthy, natural tones
    primary: '#8B7355', // Warm brown
    primaryDark: '#6B5A45', // Darker brown
    primaryLight: '#A68B6F', // Light brown
    
    // Background colors
    background: '#FAF8F5', // Off-white, warm
    backgroundSecondary: '#F5F2ED', // Slightly darker warm white
    cardBackground: '#FFFFFF',
    
    // Text colors
    textPrimary: '#2C2825', // Almost black, warm
    textSecondary: '#5A544C', // Medium brown-gray
    textLight: '#8B8580', // Light brown-gray
    
    // Accent colors
    success: '#7A9A65', // Sage green
    error: '#C17767', // Terracotta
    info: '#8B9DC3', // Dusty blue
    warning: '#D4A574', // Golden brown
    
    // UI colors
    border: '#E8E4DE', // Light warm gray
    borderLight: '#F0EDE8',
    shadow: 'rgba(44, 40, 37, 0.08)',
    overlay: 'rgba(44, 40, 37, 0.6)',
  },
  
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: 'Georgia, "Times New Roman", serif', // For special headings
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '2rem',    // 32px
      '4xl': '2.5rem',  // 40px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(44, 40, 37, 0.05)',
    md: '0 4px 6px -1px rgba(44, 40, 37, 0.1), 0 2px 4px -1px rgba(44, 40, 37, 0.06)',
    lg: '0 10px 15px -3px rgba(44, 40, 37, 0.1), 0 4px 6px -2px rgba(44, 40, 37, 0.05)',
    xl: '0 20px 25px -5px rgba(44, 40, 37, 0.1), 0 10px 10px -5px rgba(44, 40, 37, 0.04)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
};
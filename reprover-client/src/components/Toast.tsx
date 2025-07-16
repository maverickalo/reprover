import React, { useEffect } from 'react';

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

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'info':
        return '#17a2b8';
      default:
        return '#333';
    }
  };

  const styles = {
    container: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '20px',
      maxWidth: '350px',
      padding: '16px',
      backgroundColor: getBackgroundColor(),
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      animation: 'slideIn 0.3s ease-out',
    },
    message: {
      marginRight: '16px',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '0',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <span style={styles.message}>{message}</span>
        <button onClick={onClose} style={styles.closeButton}>
          ×
        </button>
      </div>
    </>
  );
};
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}
//for managing the in app snackbar
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showSuccess = (message: string) => {
    setSnackbar({
      message,
      type: 'success',
      visible: true,
    });
  };

  const showError = (message: string) => {
    setSnackbar({
      message,
      type: 'error',
      visible: true,
    });
  };

  const handleDismiss = () => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={handleDismiss}
        duration={snackbar.type === 'success' ? 3000 : 4000}
        action={{
          label: 'OK',
          onPress: handleDismiss,
          textColor: '#ffffff',
        }}
      >
        {snackbar.message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { Snackbar } from 'react-native-paper';
import { debounce } from 'lodash';

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  isVisible: boolean
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

  const showSuccessInternal = useCallback((message: string) => {
    setSnackbar({
      message,
      type: 'success',
      visible: true,
    });
  }, []);

  const showErrorInternal = useCallback((message: string) => {
    setSnackbar({
      message,
      type: 'error',
      visible: true,
    });
  }, []);

  // Debounce snackbar messages by 500 milliseconds
  const showSuccess = useMemo(
    () => debounce(showSuccessInternal, 500),
    [showSuccessInternal]
  );

  const showError = useMemo(
    () => debounce(showErrorInternal, 500),
    [showErrorInternal]
  );

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      showSuccess.cancel();
      showError.cancel();
    };
  }, [showSuccess, showError]);

  const handleDismiss = () => {
    setSnackbar((prev) => ({ ...prev, visible: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, isVisible: snackbar.visible }}>
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

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { configStore, persistor } from './src/reducers/store';
import { PersistGate } from 'redux-persist/integration/react';
import NetworkRequestsScreen from './src/screens/NetworkRequestsScreen';
import { SnackbarProvider } from './src/contexts/useSnackbarContext';
import { PaperProvider } from 'react-native-paper';

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={configStore}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider>
            <SnackbarProvider>
              <StatusBar style="auto" />
              <NetworkRequestsScreen/>
            </SnackbarProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});

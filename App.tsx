import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { configStore, persistor } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import NetworkRequestsScreen from './src/screens/NetworkRequestsScreen';
import { SnackbarProvider } from './src/contexts/useSnackbarContext';
import { PaperProvider } from 'react-native-paper';
import * as ScreenOrientation from "expo-screen-orientation"
import { useEffect } from 'react';

export default function App() {

  const unlockScreenOerientation = async () => {
    await ScreenOrientation.unlockAsync()
  }
  
  useEffect(() => {
    unlockScreenOerientation()
  }, [])

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
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar, Platform } from 'react-native';
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
              <ExpoStatusBar style="dark" backgroundColor='#f5f5f5' translucent={false} />
              <NetworkRequestsScreen/>
            </SnackbarProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
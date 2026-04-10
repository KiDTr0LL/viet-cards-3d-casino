import React, { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { GameProvider } from './contexts/GameContext';

export default function App() {
  useEffect(() => {
    // Handle app state changes for Unity bridge
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && Platform.OS === 'android') {
        // App came to foreground - reinitialize bridge if needed
        console.log('App resumed - Unity bridge reinit');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CurrencyProvider>
            <GameProvider>
              <Slot />
            </GameProvider>
          </CurrencyProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

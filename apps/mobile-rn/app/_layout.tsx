import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthProvider } from '../contexts/AuthContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { UnityBridgeProvider } from '../contexts/UnityBridgeContext';

// Premium casino theme colors
const THEME = {
  primary: '#0d4d3a',   // Emerald green
  secondary: '#d4af37', // Rich gold
  background: '#083d1e', // Deep green
  text: '#f5f5f0',      // Cream white
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <UnityBridgeProvider>
          <LinearGradient colors={[THEME.background, THEME.primary]} style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: THEME.primary,
                },
                headerTintColor: THEME.secondary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                contentStyle: {
                  backgroundColor: THEME.background,
                },
              }}
            >
              <Stack.Screen
                name="login"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="game/maubinh"
                options={{
                  presentation: 'fullScreenModal',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="game/tienlen"
                options={{
                  presentation: 'fullScreenModal',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="store"
                options={{
                  title: 'Skin Store',
                }}
              />
              <Stack.Screen
                name="transactions"
                options={{
                  title: 'Transaction History',
                }}
              />
              <Stack.Screen
                name="+not-found"
                options={{
                  title: 'Not Found',
                }}
              />
            </Stack>
            <StatusBar style="light" />
          </LinearGradient>
        </UnityBridgeProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

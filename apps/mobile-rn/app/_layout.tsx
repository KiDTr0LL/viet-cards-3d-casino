import { Slot } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { GameProvider } from '../contexts/GameContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <GameProvider>
          <Slot />
        </GameProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

import { Slot } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Slot />
      </CurrencyProvider>
    </AuthProvider>
  );
}

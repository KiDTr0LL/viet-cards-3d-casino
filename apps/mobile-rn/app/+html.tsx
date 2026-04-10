import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function Root() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = 'Vietnamese Card Games';
    }
  }, []);

  return <StatusBar style="light" />;
}

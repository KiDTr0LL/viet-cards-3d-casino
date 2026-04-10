import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported as 'App'
export function App() {
  const ctx = require.context('.', true, /\.(tsx?)$/);
  return <ExpoRoot context={ctx} />;
}

// Register the app
registerRootComponent(App);

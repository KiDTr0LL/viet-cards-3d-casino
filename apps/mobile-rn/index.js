import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';

AppRegistry.registerComponent(appName, () => App);

// Register Unity bridge handler
if (global.WebSocket) {
  // Initialize Unity bridge
  console.log('Unity bridge initialized');
}

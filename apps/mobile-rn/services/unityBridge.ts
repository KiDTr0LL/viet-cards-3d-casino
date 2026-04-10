import { Platform } from 'react-native';

// Unity Bridge types
export interface UnityMessage {
  type: 'GAME_STATE' | 'SKIN_APPLIED' | 'EFFECT_TRIGGER' | 'BALANCE_UPDATE';
  payload: any;
  timestamp: number;
}

export interface UnityBridge {
  // Send commands to Unity
  setGameMode: (mode: 'TIENLEN' | 'MAUBINH') => void;
  setSkins: (cardSkinId: string, tableSkinId: string) => void;
  triggerEffect: (effect: 'WIN' | 'LOSS' | 'PURCHASE' | 'DAILY_REFRESH') => void;
  updateBalance: (gold: number, diamonds: number) => void;

  // Subscribe to Unity events
  subscribe: (callback: (message: UnityMessage) => void) => () => void;

  // Lifecycle
  isReady: () => boolean;
  initialize: () => Promise<void>;
}

// Mock bridge for development/testing
class UnityBridgeMock implements UnityBridge {
  private listeners: Set<(message: UnityMessage) => void> = new Set();
  private ready = false;

  async initialize() {
    console.log('[UnityBridge] Initializing mock bridge');
    this.ready = true;
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('[UnityBridge] Mock bridge ready');
  }

  isReady() {
    return this.ready;
  }

  setGameMode(mode: 'TIENLEN' | 'MAUBINH') {
    console.log('[UnityBridge] setGameMode:', mode);
    this.notify({ type: 'GAME_STATE', payload: { mode }, timestamp: Date.now() });
  }

  setSkins(cardSkinId: string, tableSkinId: string) {
    console.log('[UnityBridge] setSkins:', { cardSkinId, tableSkinId });
    this.notify({ type: 'SKIN_APPLIED', payload: { cardSkinId, tableSkinId }, timestamp: Date.now() });
  }

  triggerEffect(effect: 'WIN' | 'LOSS' | 'PURCHASE' | 'DAILY_REFRESH') {
    console.log('[UnityBridge] triggerEffect:', effect);
    this.notify({ type: 'EFFECT_TRIGGER', payload: { effect }, timestamp: Date.now() });
  }

  updateBalance(gold: number, diamonds: number) {
    console.log('[UnityBridge] updateBalance:', { gold, diamonds });
    this.notify({ type: 'BALANCE_UPDATE', payload: { gold, diamonds }, timestamp: Date.now() });
  }

  subscribe(callback: (message: UnityMessage) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(message: UnityMessage) {
    this.listeners.forEach(cb => cb(message));
  }
}

// Native bridge implementation for production
class UnityBridgeNative implements UnityBridge {
  private ready = false;

  async initialize() {
    console.log('[UnityBridge] Initializing native bridge');
    // In production, this would initialize the react-native-unity module
    this.ready = true;
  }

  isReady() {
    return this.ready;
  }

  setGameMode(mode: 'TIENLEN' | 'MAUBINH') {
    if (Platform.OS === 'android') {
      // Android: Call Unity player
      console.log('[UnityBridge Android] setGameMode:', mode);
      // new AndroidJavaClass('com.unity3d.player.UnityPlayer')
      //   .getStatic('currentActivity')
      //   .call('runOnUnityThread', JSON.stringify({ type: 'GAME_STATE', payload: { mode } }));
    } else if (Platform.OS === 'ios') {
      // iOS: UnitySendMessage
      console.log('[UnityBridge iOS] setGameMode:', mode);
      // UnitySendMessage('UnityBridge', 'OnMessageFromRN', JSON.stringify({ type: 'GAME_STATE', payload: { mode } }));
    }
  }

  setSkins(cardSkinId: string, tableSkinId: string) {
    this.sendMessage({ type: 'SKIN_APPLIED', payload: { cardSkinId, tableSkinId } });
  }

  triggerEffect(effect: 'WIN' | 'LOSS' | 'PURCHASE' | 'DAILY_REFRESH') {
    this.sendMessage({ type: 'EFFECT_TRIGGER', payload: { effect } });
  }

  updateBalance(gold: number, diamonds: number) {
    this.sendMessage({ type: 'BALANCE_UPDATE', payload: { gold, diamonds } });
  }

  subscribe(callback: (message: UnityMessage) => void) {
    // In production, register with native module
    console.log('[UnityBridge] Native subscription registered');
    return () => console.log('[UnityBridge] Native subscription removed');
  }

  private sendMessage(message: Omit<UnityMessage, 'timestamp'>) {
    const fullMessage: UnityMessage = { ...message, timestamp: Date.now() };

    if (Platform.OS === 'android') {
      console.log('[UnityBridge Android] Sending:', fullMessage);
    } else if (Platform.OS === 'ios') {
      console.log('[UnityBridge iOS] Sending:', fullMessage);
    }
  }
}

// Export the appropriate bridge based on environment
export const unityBridge: UnityBridge =
  process.env.NODE_ENV === 'test' || Platform.OS === 'web'
    ? new UnityBridgeMock()
    : new UnityBridgeNative();

export default unityBridge;

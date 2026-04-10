import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

// Types for Unity ↔ React Native communication
export interface UnityMessage {
  type: 'BALANCE_UPDATE' | 'SKIN_APPLIED' | 'GAME_STATE' | 'EFFECT_TRIGGER';
  payload: any;
  timestamp: number;
}

export interface UnityBridgeState {
  isReady: boolean;
  lastMessage: UnityMessage | null;
}

export interface UnityBridgeContextType {
  state: UnityBridgeState;
  sendToUnity: (message: Omit<UnityMessage, 'timestamp'>) => void;
  subscribeToUnity: (callback: (message: UnityMessage) => void) => () => void;
  setGameMode: (mode: 'TIENLEN' | 'MAUBINH') => void;
  setSkins: (cardSkinId: string, tableSkinId: string) => void;
  triggerEffect: (effect: 'WIN' | 'LOSS' | 'PURCHASE' | 'DAILY_REFRESH') => void;
}

const UnityBridgeContext = createContext<UnityBridgeContextType | undefined>(undefined);

// Mock implementation for development
// In production, this will use react-native-unity bridge
class UnityBridgeMock {
  private listeners: Set<(message: UnityMessage) => void> = new Set();

  send(type: string, payload: any) {
    console.log(`[Unity Mock] Sending: ${type}`, payload);
    // Simulate response
    setTimeout(() => {
      this.listeners.forEach(cb =>
        cb({ type: 'RESPONSE', payload, timestamp: Date.now() })
      );
    }, 100);
  }

  subscribe(callback: (message: UnityMessage) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

const mockBridge = new UnityBridgeMock();

export function UnityBridgeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UnityBridgeState>({
    isReady: false,
    lastMessage: null,
  });
  const subscribeRef = useRef<ReturnType<typeof mockBridge.subscribe>>();

  useEffect(() => {
    // Initialize bridge
    subscribeRef.current = mockBridge.subscribe((msg) => {
      setState(prev => ({ ...prev, lastMessage: msg }));
    });
    setState(prev => ({ ...prev, isReady: true }));

    return () => {
      if (subscribeRef.current) {
        subscribeRef.current();
      }
    };
  }, []);

  const sendToUnity = useCallback((message: Omit<UnityMessage, 'timestamp'>) => {
    const fullMessage: UnityMessage = {
      ...message,
      timestamp: Date.now(),
    };

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Production: Use actual Unity bridge
      // UnityBridge.send(message.type, message.payload);
      console.log('[Unity] Would send:', fullMessage);
    } else {
      // Development: Use mock
      mockBridge.send(message.type, message.payload);
    }
  }, []);

  const subscribeToUnity = useCallback((callback: (message: UnityMessage) => void) => {
    return mockBridge.subscribe(callback);
  }, []);

  const setGameMode = useCallback((mode: 'TIENLEN' | 'MAUBINH') => {
    sendToUnity({ type: 'GAME_STATE', payload: { mode } });
  }, [sendToUnity]);

  const setSkins = useCallback((cardSkinId: string, tableSkinId: string) => {
    sendToUnity({ type: 'SKIN_APPLIED', payload: { cardSkinId, tableSkinId } });
  }, [sendToUnity]);

  const triggerEffect = useCallback((effect: 'WIN' | 'LOSS' | 'PURCHASE' | 'DAILY_REFRESH') => {
    sendToUnity({ type: 'EFFECT_TRIGGER', payload: { effect } });
  }, [sendToUnity]);

  return (
    <UnityBridgeContext.Provider
      value={{
        state,
        sendToUnity,
        subscribeToUnity,
        setGameMode,
        setSkins,
        triggerEffect,
      }}
    >
      {children}
    </UnityBridgeContext.Provider>
  );
}

export function useUnityBridge() {
  const context = useContext(UnityBridgeContext);
  if (context === undefined) {
    throw new Error('useUnityBridge must be used within a UnityBridgeProvider');
  }
  return context;
}

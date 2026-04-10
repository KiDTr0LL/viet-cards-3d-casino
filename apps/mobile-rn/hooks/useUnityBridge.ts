import { useEffect, useState, useCallback } from 'react';
import { unityBridge, UnityMessage } from '../services/unityBridge';

export function useUnityBridge() {
  const [isReady, setIsReady] = useState(false);
  const [lastMessage, setLastMessage] = useState<UnityMessage | null>(null);

  // Initialize bridge on mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      await unityBridge.initialize();
      setIsReady(true);

      // Subscribe to Unity events
      unsubscribe = unityBridge.subscribe((message) => {
        setLastMessage(message);

        // Handle different message types
        switch (message.type) {
          case 'BALANCE_UPDATE':
            // Could trigger local state update here
            console.log('Balance update received:', message.payload);
            break;
          case 'EFFECT_TRIGGER':
            // Could trigger local animations
            console.log('Effect triggered:', message.payload);
            break;
        }
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Bridge methods
  const setGameMode = useCallback((mode: 'TIENLEN' | 'MAUBINH') => {
    unityBridge.setGameMode(mode);
  }, []);

  const setSkins = useCallback((cardSkinId: string, tableSkinId: string) => {
    unityBridge.setSkins(cardSkinId, tableSkinId);
  }, []);

  const triggerEffect = useCallback((effect: 'WIN' | 'LOSS' | 'PURCHASE' | 'DAILY_REFRESH') => {
    unityBridge.triggerEffect(effect);
  }, []);

  const updateBalance = useCallback((gold: number, diamonds: number) => {
    unityBridge.updateBalance(gold, diamonds);
  }, []);

  return {
    isReady,
    lastMessage,
    setGameMode,
    setSkins,
    triggerEffect,
    updateBalance,
  };
}

export default useUnityBridge;

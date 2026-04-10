import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCurrency } from './CurrencyContext';
import { useUnityBridge } from '../hooks/useUnityBridge';
import { getUserProfile } from '../services/api';

interface GameState {
  isInGame: boolean;
  gameMode: 'TIENLEN' | 'MAUBINH' | null;
  tableSkinId: string | null;
  cardSkinId: string | null;
  currentBet: number;
}

interface GameContextType {
  state: GameState;
  enterGame: (mode: 'TIENLEN' | 'MAUBINH') => Promise<void>;
  leaveGame: () => void;
  setBet: (amount: number) => void;
  refreshProfile: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { sessionId } = useAuth();
  const { updateBalance } = useCurrency();
  const { isReady, setGameMode, setSkins, updateBalance: unityUpdateBalance } = useUnityBridge();

  const [state, setState] = useState<GameState>({
    isInGame: false,
    gameMode: null,
    tableSkinId: null,
    cardSkinId: null,
    currentBet: 100,
  });

  // Sync equipped skins from server
  useEffect(() => {
    if (sessionId) {
      refreshProfile();
    }
  }, [sessionId]);

  // Sync Unity bridge when ready
  useEffect(() => {
    if (isReady && sessionId) {
      // Send current skin preferences to Unity
      setSkins(state.cardSkinId || '', state.tableSkinId || '');
    }
  }, [isReady, state.cardSkinId, state.tableSkinId]);

  const enterGame = async (mode: 'TIENLEN' | 'MAUBINH') => {
    if (!sessionId) return;

    try {
      // Fetch latest profile with equipped skins
      const profile = await getUserProfile(sessionId);

      setState({
        isInGame: true,
        gameMode: mode,
        tableSkinId: profile.equippedTableSkin || null,
        cardSkinId: profile.equippedCardSkin || null,
        currentBet: state.currentBet,
      });

      // Tell Unity to switch to game mode
      setGameMode(mode);

      // Apply skins to Unity
      if (profile.equippedCardSkin || profile.equippedTableSkin) {
        setSkins(
          profile.equippedCardSkin || '',
          profile.equippedTableSkin || ''
        );
      }
    } catch (error) {
      console.error('Failed to enter game:', error);
    }
  };

  const leaveGame = () => {
    setState({
      isInGame: false,
      gameMode: null,
      tableSkinId: null,
      cardSkinId: null,
      currentBet: state.currentBet,
    });

    // Return to lobby in Unity
    setGameMode('LOBBY' as any);
  };

  const setBet = (amount: number) => {
    setState(prev => ({ ...prev, currentBet: amount }));
  };

  const refreshProfile = async () => {
    if (!sessionId) return;

    try {
      const profile = await getUserProfile(sessionId);

      // Update local state with fresh data
      setState(prev => ({
        ...prev,
        cardSkinId: profile.equippedCardSkin || null,
        tableSkinId: profile.equippedTableSkin || null,
      }));

      // Update currency context
      updateBalance();

      // Sync to Unity if in game
      if (isReady) {
        setSkins(
          profile.equippedCardSkin || '',
          profile.equippedTableSkin || ''
        );
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        state,
        enterGame,
        leaveGame,
        setBet,
        refreshProfile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

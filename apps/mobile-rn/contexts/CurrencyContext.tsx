import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '../services/api';

interface CurrencyContextType {
  gold: number;
  diamonds: number;
  updateBalance: () => Promise<void>;
  formatGold: (amount: number) => string;
  formatDiamonds: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { sessionId, user, setUser } = useAuth();
  const [gold, setGold] = useState(user?.gold || 0);
  const [diamonds, setDiamonds] = useState(user?.diamonds || 0);

  // Update balance when user changes
  useEffect(() => {
    if (user) {
      setGold(user.gold);
      setDiamonds(user.diamonds);
    }
  }, [user]);

  const updateBalance = async () => {
    if (!sessionId) return;
    try {
      const profile = await getUserProfile(sessionId);
      setUser(profile);
      setGold(profile.gold);
      setDiamonds(profile.diamonds);
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const formatGold = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  const formatDiamonds = (amount: number): string => {
    return amount.toLocaleString();
  };

  return (
    <CurrencyContext.Provider
      value={{
        gold,
        diamonds,
        updateBalance,
        formatGold,
        formatDiamonds,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

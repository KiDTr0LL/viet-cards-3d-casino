import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface CurrencyState {
  gold: number;
  diamonds: number;
  pendingGold: number;  // For animation buffering
  pendingDiamonds: number;
}

interface CurrencyContextType {
  currency: CurrencyState;
  updateGold: (delta: number, animated?: boolean) => void;
  updateDiamonds: (delta: number, animated?: boolean) => void;
  animateToValue: (targetGold: number, targetDiamonds: number) => void;
  formatGold: (amount: number) => string;
  formatDiamonds: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [currency, setCurrency] = useState<CurrencyState>({
    gold: profile?.currencyBalance || 1000,
    diamonds: profile?.diamondBalance || 0,
    pendingGold: 0,
    pendingDiamonds: 0,
  });

  const updateGold = useCallback((delta: number, animated: boolean = true) => {
    setCurrency(prev => ({
      ...prev,
      gold: prev.gold + delta,
      ...(animated ? { pendingGold: delta } : {}),
    }));
  }, []);

  const updateDiamonds = useCallback((delta: number, animated: boolean = true) => {
    setCurrency(prev => ({
      ...prev,
      diamonds: prev.diamonds + delta,
      ...(animated ? { pendingDiamonds: delta } : {}),
    }));
  }, []);

  const animateToValue = useCallback((targetGold: number, targetDiamonds: number) => {
    setCurrency(prev => ({
      ...prev,
      gold: targetGold,
      diamonds: targetDiamonds,
    }));
  }, []);

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
        currency,
        updateGold,
        updateDiamonds,
        animateToValue,
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

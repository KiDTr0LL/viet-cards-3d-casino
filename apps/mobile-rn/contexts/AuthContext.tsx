import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

interface UserProfile {
  displayName: string;
  avatarUrl?: string;
  currencyBalance: number;
  diamondBalance: number;
  totalGames: number;
  totalWins: number;
  leagueTier: string;
  equippedCardSkin?: string;
  equippedTableSkin?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase Auth (to be implemented)
  useEffect(() => {
    // TODO: Initialize Firebase auth listener
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    // TODO: Implement Firebase Google Sign-In
    console.log('Sign in with Google');
  };

  const signInWithGuest = async () => {
    // TODO: Implement guest authentication
    console.log('Sign in as guest');
  };

  const signOut = async () => {
    // TODO: Implement sign out
    console.log('Sign out');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithGuest,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SessionResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  setUser: (user: User | null) => void;
  setSessionId: (sessionId: string | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const signOut = () => {
    setUser(null);
    setSessionId(null);
  };

  return (
    <AuthContext.Provider value={{ user, sessionId, setUser, setSessionId, signOut }}>
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

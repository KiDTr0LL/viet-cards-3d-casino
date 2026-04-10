// Shared types between server, client, and Unity

// ===== User Types =====
export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  email?: string;
  isGuest: boolean;
  gold: number;
  diamonds: number;
  equippedCardSkinId?: string;
  equippedTableSkinId?: string;
  totalGames?: number;
  totalWins?: number;
  leagueTier?: string;
}

export interface SessionResponse {
  sessionId: string;
  user: User;
}

// ===== Skin Types =====
export type SkinType = 'CARD' | 'TABLE' | 'AVATAR_FRAME' | 'EFFECT';
export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Skin {
  id: string;
  name: string;
  type: SkinType;
  rarity: Rarity;
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
  isActive: boolean;
}

export interface OwnedSkin {
  skinId: string;
  skin: Skin;
  equipped: boolean;
  purchasedAt: string;
}

// ===== Currency Types =====
export type CurrencyType = 'GOLD' | 'DIAMOND';
export type TransactionType = 'WIN' | 'LOSS' | 'PURCHASE' | 'REFRESH' | 'GIFT' | 'BONUS' | 'RAKE';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  currencyType: CurrencyType;
  amount: number;
  balanceAfter: number;
  description?: string;
  metadata?: any;
  createdAt: string;
}

// ===== Game Types =====
export type GameType = 'TIENLEN' | 'MAUBINH';
export type GamePhase = 'WAITING' | 'DEALING' | 'PLAYING' | 'ARRANGING' | 'COMPARING' | 'END_GAME' | 'FINISHED';

export interface GameSession {
  id: string;
  gameType: GameType;
  hostId: string;
  roomId: string;
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  maxPlayers: number;
  betAmount: number;
  players: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type CardSuit = 'S' | 'H' | 'D' | 'C';

export interface Card {
  rank: CardRank;
  suit: CardSuit;
}

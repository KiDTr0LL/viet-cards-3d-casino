const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  displayName: string;
  gold: number;
  diamonds: number;
  isGuest: boolean;
  avatarUrl?: string;
  equippedCardSkin?: string;
  equippedTableSkin?: string;
}

export interface SessionResponse {
  sessionId: string;
  user: User;
}

export interface Skin {
  id: string;
  name: string;
  type: 'CARD' | 'TABLE';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
}

export interface OwnedSkin {
  skinId: string;
  skin: Skin;
  equipped: boolean;
  purchasedAt: string;
}

export async function devLogin(displayName?: string): Promise<SessionResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/dev/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName }),
  });

  if (!res.ok) {
    throw new Error('Dev login failed');
  }

  return res.json();
}

export async function guestLogin(): Promise<SessionResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/guest/login`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Guest login failed');
  }

  return res.json();
}

export async function validateSession(sessionId: string): Promise<{ valid: boolean; user?: User }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/session/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });

  if (!res.ok) {
    return { valid: false };
  }

  return res.json();
}

export async function getUserProfile(sessionId: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me/${sessionId}`);

  if (!res.ok) {
    throw new Error('Failed to get profile');
  }

  return res.json();
}

export async function getSkinCatalog(): Promise<Skin[]> {
  const res = await fetch(`${API_BASE_URL}/api/skins/catalog`);

  if (!res.ok) {
    throw new Error('Failed to get skin catalog');
  }

  return res.json();
}

export async function getSkinInventory(sessionId: string): Promise<{ ownedSkins: OwnedSkin[] }> {
  const res = await fetch(`${API_BASE_URL}/api/skins/inventory/${sessionId}`);

  if (!res.ok) {
    throw new Error('Failed to get inventory');
  }

  return res.json();
}

export async function purchaseSkin(sessionId: string, skinId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/api/skins/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, skinId }),
  });

  if (!res.ok) {
    throw new Error('Purchase failed');
  }

  return res.json();
}

export async function equipSkin(
  sessionId: string,
  skinId: string,
  skinType: 'CARD' | 'TABLE'
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/api/skins/equip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, skinId, skinType }),
  });

  if (!res.ok) {
    throw new Error('Equip failed');
  }

  return res.json();
}

export async function getEquippedSkins(sessionId: string): Promise<{ cardSkin?: string; tableSkin?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/skins/equipped/${sessionId}`);

  if (!res.ok) {
    throw new Error('Failed to get equipped skins');
  }

  return res.json();
}

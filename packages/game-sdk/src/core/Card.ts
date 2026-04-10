// Core card types - reusable across server and client
export type Suit = 'S' | 'H' | 'D' | 'C';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
    rank: Rank;
    suit: Suit;
}

// Suit display symbols
export const SUIT_SYMBOLS: Record<Suit, string> = {
    'S': '♠',
    'H': '♥',
    'D': '♦',
    'C': '♣',
};

// Suit colors (for rendering)
export const SUIT_COLORS: Record<Suit, string> = {
    'S': '#000000',
    'H': '#E63946',
    'D': '#E63946',
    'C': '#000000',
};

// Rank comparison values (Vietnamese rules: 2 is highest)
export const RANK_VALUES: Record<Rank, number> = {
    '2': 14,
    'A': 13,
    'K': 12,
    'Q': 11,
    'J': 10,
    '10': 9,
    '9': 8,
    '8': 7,
    '7': 6,
    '6': 5,
    '5': 4,
    '4': 3,
    '3': 2,
};

// Suit comparison (for Tiến Lên: ♣ < ♦ < ♥ < ♠)
export const SUIT_ORDER: Record<Suit, number> = {
    'C': 0,
    'D': 1,
    'H': 2,
    'S': 3,
};

export function compareCards(a: Card, b: Card): number {
    const rankDiff = RANK_VALUES[a.rank] - RANK_VALUES[b.rank];
    if (rankDiff !== 0) return rankDiff;
    // Same rank, compare suit
    return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
}

export function createCard(rank: Rank, suit: Suit): Card {
    return { rank, suit };
}

export function parseCard(str: string): Card {
    const suit = str.slice(-1) as Suit;
    const rank = str.slice(0, -1) as Rank;
    return { rank, suit };
}

export function cardToString(card: Card): string {
    return `${card.rank}${card.suit}`;
}

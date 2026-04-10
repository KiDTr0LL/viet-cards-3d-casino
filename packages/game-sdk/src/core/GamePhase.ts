// Common game phases
export type GamePhase = 'WAITING' | 'PLAYING' | 'FINISHED';

// Tiến Lên specific phases
export type TienLenPhase = 'WAITING' | 'DEALING' | 'PLAYING' | 'END_GAME' | 'FINISHED';

// Mậu Binh specific phases
export type MauBinhPhase = 'WAITING' | 'DEALING' | 'ARRANGING' | 'COMPARING' | 'FINISHED';

export const PHASE_ORDER: Record<string, number> = {
    'WAITING': 0,
    'DEALING': 1,
    'PLAYING': 2,
    'ARRANGING': 2,
    'COMPARING': 3,
    'END_GAME': 3,
    'FINISHED': 4,
};

export function isPhaseBefore(a: GamePhase | string, b: GamePhase | string): boolean {
    return PHASE_ORDER[a] < PHASE_ORDER[b];
}

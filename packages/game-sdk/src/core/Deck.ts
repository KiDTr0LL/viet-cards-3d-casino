import { Card, createCard } from './Card';

export class Deck {
    private cards: Card[] = [];

    constructor() {
        this.reset();
    }

    reset(): void {
        this.cards = [];
        const suits: ('S' | 'H' | 'D' | 'C')[] = ['S', 'H', 'D', 'C'];
        const ranks: ('2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A')[] =
            ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push(createCard(rank, suit));
            }
        }
    }

    shuffle(): void {
        // Fisher-Yates shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(count: number): Card[] {
        const dealt: Card[] = [];
        for (let i = 0; i < count && this.cards.length > 0; i++) {
            dealt.push(this.cards.pop()!);
        }
        return dealt;
    }

    dealToPlayers(playerCount: number, cardsPerPlayer: number): Card[][] {
        const hands: Card[][] = Array.from({ length: playerCount }, () => []);
        for (let i = 0; i < playerCount; i++) {
            hands[i] = this.deal(cardsPerPlayer);
        }
        return hands;
    }

    remaining(): number {
        return this.cards.length;
    }

    getCards(): Card[] {
        return [...this.cards];
    }
}

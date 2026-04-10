import { CurrencyType, TransactionType } from '@prisma/client';
import { userRepository } from '../repositories/UserRepository';
import { currencyRepository } from '../repositories/CurrencyRepository';

export interface CurrencyService {
  updateGold(userId: string, delta: number, type: TransactionType, metadata?: any): Promise<number>;
  updateDiamonds(userId: string, delta: number, type: TransactionType, metadata?: any): Promise<number>;
  dailyRefresh(userId: string): Promise<{ gold: number; refreshed: boolean }>;
  getBalance(userId: string): Promise<{ gold: number; diamonds: number }>;
}

export class CurrencyServiceImpl implements CurrencyService {
  async updateGold(userId: string, delta: number, type: TransactionType, metadata?: any) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const newBalance = user.gold + delta;

    await userRepository.updateBalance(userId, {
      goldTransaction: delta,
      newGold: newBalance,
      type,
      currencyType: CurrencyType.GOLD,
      metadata,
    });

    return newBalance;
  }

  async updateDiamonds(userId: string, delta: number, type: TransactionType, metadata?: any) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const newBalance = user.diamonds + delta;

    await userRepository.updateBalance(userId, {
      diamondTransaction: delta,
      newDiamonds: newBalance,
      type,
      currencyType: CurrencyType.DIAMOND,
      metadata,
    });

    return newBalance;
  }

  async dailyRefresh(userId: string) {
    const balance = await this.getBalance(userId);

    const REFRESH_THRESHOLD = 500;
    const REFRESH_AMOUNT = 1000;

    if (balance.gold < REFRESH_THRESHOLD) {
      const newGold = balance.gold + REFRESH_AMOUNT;

      await userRepository.updateBalance(userId, {
        goldTransaction: REFRESH_AMOUNT,
        newGold,
        type: TransactionType.REFRESH,
        currencyType: CurrencyType.GOLD,
        metadata: { reason: 'daily_refresh' },
      });

      return { gold: newGold, refreshed: true };
    }

    return { gold: balance.gold, refreshed: false };
  }

  async getBalance(userId: string) {
    return currencyRepository.getBalance(userId);
  }
}

export const currencyService = new CurrencyServiceImpl();

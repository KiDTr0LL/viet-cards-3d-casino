import { PrismaClient, CurrencyType, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export interface CurrencyUpdate {
  userId: string;
  amount: number;
  type: CurrencyType;
  transactionType: TransactionType;
  metadata?: any;
}

export interface CurrencyService {
  updateGold(userId: string, delta: number, type: TransactionType, metadata?: any): Promise<number>;
  updateDiamonds(userId: string, delta: number, type: TransactionType, metadata?: any): Promise<number>;
  dailyRefresh(userId: string): Promise<{ gold: number; refreshed: boolean }>;
  getBalance(userId: string): Promise<{ gold: number; diamonds: number }>;
}

export class CurrencyServiceImpl implements CurrencyService {
  async updateGold(userId: string, delta: number, type: TransactionType, metadata?: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newBalance = user.gold + delta;

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          type,
          currencyType: CurrencyType.GOLD,
          amount: delta,
          balanceAfter: newBalance,
          metadata,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { gold: newBalance },
      }),
    ]);

    return newBalance;
  }

  async updateDiamonds(userId: string, delta: number, type: TransactionType, metadata?: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newBalance = user.diamonds + delta;

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          type,
          currencyType: CurrencyType.DIAMOND,
          amount: delta,
          balanceAfter: newBalance,
          metadata,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { diamonds: newBalance },
      }),
    ]);

    return newBalance;
  }

  async dailyRefresh(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const REFRESH_THRESHOLD = 500;
    const REFRESH_AMOUNT = 1000;

    if (user.gold < REFRESH_THRESHOLD) {
      const newBalance = user.gold + REFRESH_AMOUNT;
      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            userId,
            type: TransactionType.REFRESH,
            currencyType: CurrencyType.GOLD,
            amount: REFRESH_AMOUNT,
            balanceAfter: newBalance,
            metadata: { reason: 'daily_refresh' },
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { gold: newBalance },
        }),
      ]);

      return { gold: newBalance, refreshed: true };
    }

    return { gold: user.gold, refreshed: false };
  }

  async getBalance(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gold: true, diamonds: true },
    });

    if (!user) throw new Error('User not found');

    return user;
  }
}

export const currencyService = new CurrencyServiceImpl();

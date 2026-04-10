import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CurrencyRepository {
  async getBalance(userId: string): Promise<{ gold: number; diamonds: number }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gold: true, diamonds: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async setGold(userId: string, amount: number): Promise<number> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { gold: amount },
    });
    return user.gold;
  }

  async setDiamonds(userId: string, amount: number): Promise<number> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { diamonds: amount },
    });
    return user.diamonds;
  }

  async addGold(userId: string, amount: number): Promise<number> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { gold: { increment: amount } },
    });
    return user.gold;
  }

  async subtractGold(userId: string, amount: number): Promise<number> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { gold: { decrement: amount } },
    });
    return user.gold;
  }

  async addDiamonds(userId: string, amount: number): Promise<number> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { diamonds: { increment: amount } },
    });
    return user.diamonds;
  }

  async subtractDiamonds(userId: string, amount: number): Promise<number> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { diamonds: { decrement: amount } },
    });
    return user.diamonds;
  }
}

export const currencyRepository = new CurrencyRepository();

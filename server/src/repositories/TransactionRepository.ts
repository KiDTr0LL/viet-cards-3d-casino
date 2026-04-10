import { PrismaClient, Transaction, TransactionType, CurrencyType } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTransactionInput {
  userId: string;
  type: TransactionType;
  currencyType: CurrencyType;
  amount: number;
  balanceAfter: number;
  description?: string;
  metadata?: any;
}

export class TransactionRepository {
  async create(data: CreateTransactionInput): Promise<Transaction> {
    return prisma.transaction.create({
      data,
    });
  }

  async findByUserId(userId: string, limit = 10): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({ where: { id } });
  }

  async findRecentByUserIdAndType(
    userId: string,
    type: TransactionType,
    limit = 1
  ): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId, type },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const transactionRepository = new TransactionRepository();

import { PrismaClient, User, TransactionType, CurrencyType } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserInput {
  firebaseUid?: string;
  devSessionId?: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  isGuest?: boolean;
  gold?: number;
  diamonds?: number;
}

export interface UpdateUserInput {
  displayName?: string;
  gold?: number;
  diamonds?: number;
  equippedCardSkinId?: string;
  equippedTableSkinId?: string;
}

export interface BalanceUpdateInput {
  goldTransaction?: number;
  diamondTransaction?: number;
  newGold?: number;
  newDiamonds?: number;
  type: TransactionType;
  currencyType?: CurrencyType;
  metadata?: any;
}

export class UserRepository {
  // Expose prisma instance for tests
  get prisma() {
    return prisma;
  }
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByDevSessionId(sessionId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { devSessionId: sessionId } });
  }

  async findByFirebaseUid(uid: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { firebaseUid: uid } });
  }

  async findBySession(sessionId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ devSessionId: sessionId }, { firebaseUid: sessionId }],
      },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async incrementGold(id: string, amount: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { gold: { increment: amount } },
    });
  }

  async incrementDiamonds(id: string, amount: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { diamonds: { increment: amount } },
    });
  }

  async decrementDiamonds(id: string, amount: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { diamonds: { decrement: amount } },
    });
  }

  async updateBalance(
    userId: string,
    input: BalanceUpdateInput
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: input.type,
          currencyType: input.currencyType || CurrencyType.GOLD,
          amount: input.goldTransaction ?? input.diamondTransaction ?? 0,
          balanceAfter: input.newGold ?? input.newDiamonds ?? 0,
          metadata: input.metadata,
        },
      });

      // Update user balance
      if (input.newGold !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: { gold: input.newGold },
        });
      }
      if (input.newDiamonds !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: { diamonds: input.newDiamonds },
        });
      }
    });
  }
}

export const userRepository = new UserRepository();

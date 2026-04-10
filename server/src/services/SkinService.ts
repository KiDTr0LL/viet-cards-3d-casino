import { PrismaClient, CurrencyType, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export interface SkinPurchase {
  userId: string;
  skinId: string;
}

export interface SkinService {
  getAllSkins(): Promise<any[]>;
  getUserSkins(userId: string): Promise<any[]>;
  purchaseSkin(purchase: SkinPurchase): Promise<{ success: boolean; transaction: any }>;
  equipCardSkin(userId: string, skinId: string): Promise<void>;
  equipTableSkin(userId: string, skinId: string): Promise<void>;
  getEquippedSkins(userId: string): Promise<{ cardSkin?: string; tableSkin?: string }>;
}

export class SkinServiceImpl implements SkinService {
  async getAllSkins() {
    return prisma.skin.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });
  }

  async getUserSkins(userId: string) {
    return prisma.userSkin.findMany({
      where: { userId },
      include: { skin: true },
    });
  }

  async purchaseSkin({ userId, skinId }: SkinPurchase) {
    const skin = await prisma.skin.findUnique({ where: { id: skinId } });
    if (!skin) throw new Error('Skin not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Check if user has enough diamonds
    if (user.diamonds < skin.price) {
      return { success: false, transaction: { error: 'Insufficient diamonds' } };
    }

    // Check if already owned
    const existing = await prisma.userSkin.findUnique({
      where: { userId_skinId: { userId, skinId } },
    });

    if (existing) {
      return { success: false, transaction: { error: 'Skin already owned' } };
    }

    // Deduct diamonds and add skin
    const [purchase, transaction] = await prisma.$transaction([
      prisma.userSkin.create({
        data: { userId, skinId },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.PURCHASE,
          currencyType: CurrencyType.DIAMOND,
          amount: -skin.price,
          balanceAfter: user.diamonds - skin.price,
          metadata: { skinId, skinName: skin.name },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { diamonds: { decrement: skin.price } },
      }),
    ]);

    return { success: true, transaction };
  }

  async equipCardSkin(userId: string, skinId: string) {
    const owned = await prisma.userSkin.findUnique({
      where: { userId_skinId: { userId, skinId } },
    });

    if (!owned) {
      throw new Error('Skin not owned');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { equippedCardSkinId: skinId },
    });
  }

  async equipTableSkin(userId: string, skinId: string) {
    const owned = await prisma.userSkin.findUnique({
      where: { userId_skinId: { userId, skinId } },
    });

    if (!owned) {
      throw new Error('Skin not owned');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { equippedTableSkinId: skinId },
    });
  }

  async getEquippedSkins(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        equippedCardSkinId: true,
        equippedTableSkinId: true,
      },
    });

    return {
      cardSkin: user?.equippedCardSkinId || undefined,
      tableSkin: user?.equippedTableSkinId || undefined,
    };
  }
}

export const skinService = new SkinServiceImpl();

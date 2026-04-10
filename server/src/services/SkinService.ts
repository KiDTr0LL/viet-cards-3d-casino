import { PrismaClient, CurrencyType, TransactionType } from '@prisma/client';
import { skinRepository } from '../repositories/SkinRepository';
import { userSkinRepository } from '../repositories/UserSkinRepository';
import { userRepository } from '../repositories/UserRepository';
import { currencyRepository } from '../repositories/CurrencyRepository';

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
    return skinRepository.findAll();
  }

  async getUserSkins(userId: string) {
    return userSkinRepository.findByUserId(userId);
  }

  async purchaseSkin({ userId, skinId }: SkinPurchase) {
    const skin = await skinRepository.findById(skinId);
    if (!skin) throw new Error('Skin not found');

    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    // Check if user has enough diamonds
    if (user.diamonds < skin.price) {
      return { success: false, transaction: 'Insufficient diamonds' };
    }

    // Check if already owned
    const existing = await userSkinRepository.findByUserIdAndSkinId(userId, skinId);

    if (existing) {
      return { success: false, transaction: 'Skin already owned' };
    }

    // Use Prisma transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Create user skin ownership
      const purchase = await tx.userSkin.create({
        data: { userId, skinId },
        include: { skin: true },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.PURCHASE,
          currencyType: CurrencyType.DIAMOND,
          amount: -skin.price,
          balanceAfter: user.diamonds - skin.price,
          metadata: { skinId, skinName: skin.name },
        },
      });

      // Deduct diamonds
      await tx.user.update({
        where: { id: userId },
        data: { diamonds: { decrement: skin.price } },
      });

      return { purchase, transaction };
    });

    return { success: true, transaction: result.transaction };
  }

  async equipCardSkin(userId: string, skinId: string) {
    const owned = await userSkinRepository.findByUserIdAndSkinId(userId, skinId);

    if (!owned) {
      throw new Error('Skin not owned');
    }

    await userRepository.update(userId, { equippedCardSkinId: skinId });
  }

  async equipTableSkin(userId: string, skinId: string) {
    const owned = await userSkinRepository.findByUserIdAndSkinId(userId, skinId);

    if (!owned) {
      throw new Error('Skin not owned');
    }

    await userRepository.update(userId, { equippedTableSkinId: skinId });
  }

  async getEquippedSkins(userId: string) {
    const user = await userRepository.findById(userId);

    return {
      cardSkin: user?.equippedCardSkinId || undefined,
      tableSkin: user?.equippedTableSkinId || undefined,
    };
  }
}

export const skinService = new SkinServiceImpl();

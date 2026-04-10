import { PrismaClient, UserSkin } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserSkinInput {
  userId: string;
  skinId: string;
  equipped?: boolean;
}

export class UserSkinRepository {
  async findByUserIdAndSkinId(userId: string, skinId: string): Promise<UserSkin | null> {
    return prisma.userSkin.findUnique({
      where: { userId_skinId: { userId, skinId } },
    });
  }

  async findByUserId(userId: string): Promise<UserSkin[]> {
    return prisma.userSkin.findMany({
      where: { userId },
      include: { skin: true },
    });
  }

  async create(data: CreateUserSkinInput): Promise<UserSkin> {
    return prisma.userSkin.create({
      data,
      include: { skin: true },
    });
  }

  async equip(userId: string, skinId: string): Promise<UserSkin> {
    return prisma.userSkin.update({
      where: { userId_skinId: { userId, skinId } },
      data: { equipped: true },
    });
  }

  async unequipAllForType(userId: string, skinType: 'CARD' | 'TABLE'): Promise<void> {
    // This would require a more complex query based on skin type
    // For now, we handle this in the service layer
  }

  async isOwned(userId: string, skinId: string): Promise<boolean> {
    const existing = await this.findByUserIdAndSkinId(userId, skinId);
    return existing !== null;
  }
}

export const userSkinRepository = new UserSkinRepository();

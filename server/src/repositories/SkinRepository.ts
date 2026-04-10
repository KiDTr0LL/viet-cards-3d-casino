import { PrismaClient, Skin, SkinType, Rarity } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateSkinInput {
  name: string;
  type: SkinType;
  rarity: Rarity;
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
  isActive?: boolean;
}

export class SkinRepository {
  async findAll(): Promise<Skin[]> {
    return prisma.skin.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { rarity: 'desc' }],
    });
  }

  async findById(id: string): Promise<Skin | null> {
    return prisma.skin.findUnique({ where: { id } });
  }

  async findByType(type: SkinType): Promise<Skin[]> {
    return prisma.skin.findMany({
      where: { type, isActive: true },
      orderBy: [{ category: 'asc' }, { rarity: 'desc' }],
    });
  }

  async findByCategory(category: string): Promise<Skin[]> {
    return prisma.skin.findMany({
      where: { category, isActive: true },
      orderBy: [{ rarity: 'desc' }],
    });
  }

  async findFreeSkins(): Promise<Skin[]> {
    return prisma.skin.findMany({
      where: { price: 0, isActive: true },
      orderBy: [{ category: 'asc' }],
    });
  }

  async create(data: CreateSkinInput): Promise<Skin> {
    return prisma.skin.create({ data });
  }

  async findFreeCardSkin(): Promise<Skin | null> {
    const skins = await this.findByType(SkinType.CARD);
    return skins.find(s => s.price === 0) || null;
  }
}

export const skinRepository = new SkinRepository();

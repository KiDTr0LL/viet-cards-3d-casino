import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { skinService } from '../services/SkinService';
import { currencyService } from '../services/CurrencyService';

export const skinRouter = Router();

// Get all available skins
skinRouter.get('/catalog', async (req: Request, res: Response) => {
  try {
    const { type, category } = req.query;

    const where: any = { isActive: true };
    if (type) where.type = type;
    if (category) where.category = category;

    const skins = await prisma.skin.findMany({
      where,
      orderBy: [{ category: 'asc' }, { rarity: 'desc' }],
    });

    res.json(skins);
  } catch (error) {
    console.error('Get catalog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's owned skins
skinRouter.get('/inventory/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ devSessionId: sessionId }, { firebaseUid: sessionId }],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ownedSkins = await prisma.userSkin.findMany({
      where: { userId: user.id },
      include: { skin: true },
    });

    res.json({
      ownedSkins: ownedSkins.map((us) => ({
        skinId: us.skinId,
        skin: us.skin,
        equipped: us.equipped,
        purchasedAt: us.purchased,
      })),
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Purchase a skin
skinRouter.post('/purchase', async (req: Request, res: Response) => {
  try {
    const { sessionId, skinId } = req.body;

    if (!sessionId || !skinId) {
      return res.status(400).json({ error: 'Missing sessionId or skinId' });
    }

    // Get user
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ devSessionId: sessionId }, { firebaseUid: sessionId }],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Purchase skin
    const result = await skinService.purchaseSkin({ userId: user.id, skinId });

    if (!result.success) {
      return res.status(400).json(result.transaction);
    }

    res.json({ success: true, transaction: result.transaction });
  } catch (error) {
    console.error('Purchase skin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Equip a skin
skinRouter.post('/equip', async (req: Request, res: Response) => {
  try {
    const { sessionId, skinId, skinType } = req.body;

    if (!sessionId || !skinId || !skinType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ devSessionId: sessionId }, { firebaseUid: sessionId }],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate ownership
    const owned = await prisma.userSkin.findUnique({
      where: { userId_skinId: { userId: user.id, skinId } },
    });

    if (!owned) {
      return res.status(403).json({ error: 'Skin not owned' });
    }

    // Equip skin
    if (skinType === 'CARD') {
      await prisma.user.update({
        where: { id: user.id },
        data: { equippedCardSkinId: skinId },
      });
    } else if (skinType === 'TABLE') {
      await prisma.user.update({
        where: { id: user.id },
        data: { equippedTableSkinId: skinId },
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Equip skin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get equipped skins
skinRouter.get('/equipped/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ devSessionId: sessionId }, { firebaseUid: sessionId }],
      },
      select: {
        equippedCardSkinId: true,
        equippedTableSkinId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      cardSkin: user.equippedCardSkinId,
      tableSkin: user.equippedTableSkinId,
    });
  } catch (error) {
    console.error('Get equipped error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

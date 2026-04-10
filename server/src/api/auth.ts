import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const authRouter = Router();

// Dev login - creates a session for local testing
authRouter.post('/dev/login', async (req: Request, res: Response) => {
  try {
    const { displayName } = req.body;
    const devSessionId = `dev_${uuidv4()}`;
    const safeName = displayName || `DevUser_${devSessionId.slice(0, 8)}`;

    // Create or update dev user
    let user = await prisma.user.findUnique({
      where: { devSessionId },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      // New dev user - give starting bonus
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            devSessionId,
            displayName: safeName,
            isGuest: true,
            gold: 1000,
            diamonds: 0,
          },
        });

        await tx.transaction.create({
          data: {
            userId: newUser.id,
            type: 'BONUS',
            currencyType: 'GOLD',
            amount: 1000,
            balanceAfter: 1000,
            description: 'Dev welcome bonus',
          },
        });

        return await tx.user.findUnique({
          where: { id: newUser.id },
          include: { transactions: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
      });
    } else {
      // Returning dev user - just update lastActive
      user = await prisma.user.update({
        where: { id: user.id },
        data: {}, // Just update the timestamp
        include: { transactions: { orderBy: { createdAt: 'desc' }, take: 1 } },
      });
    }

    res.json({
      sessionId: devSessionId,
      user: {
        id: user.id,
        displayName: user.displayName,
        gold: user.gold,
        diamonds: user.diamonds,
        isGuest: user.isGuest,
      },
    });
  } catch (error) {
    console.error('Dev login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Guest login - creates a random guest user
authRouter.post('/guest/login', async (req: Request, res: Response) => {
  try {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const guestNames = ['Lucky Dragon', 'Golden Phoenix', 'Jade Tiger', 'Silver Koi', 'Ruby Crane'];
    const randomName = guestNames[Math.floor(Math.random() * guestNames.length)] + ' ' + Math.floor(Math.random() * 1000);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firebaseUid: guestId,
          displayName: randomName,
          isGuest: true,
          gold: 1000,
          diamonds: 0,
        },
      });

      await tx.transaction.create({
        data: {
          userId: newUser.id,
          type: 'BONUS',
          currencyType: 'GOLD',
          amount: 1000,
          balanceAfter: 1000,
          description: 'Guest welcome bonus',
        },
      });

      return await tx.user.findUnique({
        where: { id: newUser.id },
        include: { transactions: { orderBy: { createdAt: 'desc' }, take: 1 } },
      });
    });

    res.json({
      sessionId: user.firebaseUid!,
      user: {
        id: user.id,
        displayName: user.displayName,
        gold: user.gold,
        diamonds: user.diamonds,
        isGuest: true,
      },
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Session validation - check if session is still valid
authRouter.post('/session/validate', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(401).json({ error: 'Missing session ID' });
    }

    // Check both dev and guest sessions
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { devSessionId: sessionId },
          { firebaseUid: sessionId },
        ],
      },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        gold: user.gold,
        diamonds: user.diamonds,
        isGuest: user.isGuest,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
authRouter.get('/me/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { devSessionId: sessionId },
          { firebaseUid: sessionId },
        ],
      },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      displayName: user.displayName,
      gold: user.gold,
      diamonds: user.diamonds,
      isGuest: user.isGuest,
      transactions: user.transactions,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

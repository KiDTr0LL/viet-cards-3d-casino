import { prisma } from '../src/db';

describe('Skin Purchase Flow', () => {
  let devSessionId;
  let userId;
  let cardSkinId;

  beforeAll(async () => {
    // Create dev user
    const res = await fetch('http://localhost:3001/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'PurchaseTestUser' }),
    });
    const data = await res.json();
    devSessionId = data.sessionId;
    userId = data.user.id;

    // Get a card skin to purchase
    const skins = await prisma.skin.findMany({ where: { type: 'CARD', price: { gt: 0 } } });
    if (skins.length > 0) {
      cardSkinId = skins[0].id;
      // Give user some diamonds for testing
      await prisma.user.update({
        where: { id: userId },
        data: { diamonds: 200 },
      });
    }
  });

  it('should allow purchase if user has enough diamonds', async () => {
    if (!cardSkinId) {
      // Skip if no paid skins available
      return;
    }

    const res = await fetch('http://localhost:3001/api/skins/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: devSessionId, skinId: cardSkinId }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify skin was added to inventory
    const owned = await prisma.userSkin.findUnique({
      where: { userId_skinId: { userId, skinId: cardSkinId } },
    });
    expect(owned).toBeTruthy();

    // Verify diamonds were deducted
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user.diamonds).toBeLessThan(200);
  });

  it('should reject purchase if skin already owned', async () => {
    if (!cardSkinId) return;

    const res = await fetch('http://localhost:3001/api/skins/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: devSessionId, skinId: cardSkinId }),
    });

    const data = await res.json();
    expect(data.error).toBe('Skin already owned');
  });

  it('should reject purchase if insufficient diamonds', async () => {
    // Get an expensive skin
    const expensiveSkins = await prisma.skin.findMany({
      where: { price: { gt: 1000 } },
      take: 1,
    });

    if (expensiveSkins.length === 0) return;

    const res = await fetch('http://localhost:3001/api/skins/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: devSessionId, skinId: expensiveSkins[0].id }),
    });

    const data = await res.json();
    expect(data.error).toBe('Insufficient diamonds');
  });
});

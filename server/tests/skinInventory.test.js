import { prisma } from '../src/db';

describe('Skin Inventory', () => {
  let devSessionId;
  let userId;
  let freeSkinId;

  beforeAll(async () => {
    // Create dev user
    const res = await fetch('http://localhost:3001/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'InventoryTestUser' }),
    });
    const data = await res.json();
    devSessionId = data.sessionId;
    userId = data.user.id;

    // Get a free skin
    const skins = await prisma.skin.findMany({ where: { price: 0 } });
    if (skins.length > 0) {
      freeSkinId = skins[0].id;
      // Purchase it
      await prisma.userSkin.create({
        data: { userId, skinId: freeSkinId },
      });
    }
  });

  it('should return owned skins', async () => {
    if (!freeSkinId) return;

    const res = await fetch(`http://localhost:3001/api/skins/inventory/${devSessionId}`);

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.ownedSkins).toBeDefined();
    expect(data.ownedSkins.length).toBeGreaterThan(0);

    const ownedSkin = data.ownedSkins.find((s) => s.skinId === freeSkinId);
    expect(ownedSkin).toBeTruthy();
  });

  it('should allow equipping owned skin', async () => {
    if (!freeSkinId) return;

    const res = await fetch('http://localhost:3001/api/skins/equip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: devSessionId,
        skinId: freeSkinId,
        skinType: 'CARD',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify equipped
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user.equippedCardSkinId).toBe(freeSkinId);
  });

  it('should return equipped skins', async () => {
    if (!freeSkinId) return;

    const res = await fetch(`http://localhost:3001/api/skins/equipped/${devSessionId}`);

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.cardSkin).toBe(freeSkinId);
  });
});

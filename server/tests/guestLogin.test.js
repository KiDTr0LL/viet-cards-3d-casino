import { prisma } from '../src/db';

describe('Guest Login', () => {
  it('should create a new guest user with 1000 gold', async () => {
    const res = await fetch('http://localhost:3001/api/auth/guest/login', {
      method: 'POST',
    });

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data).toHaveProperty('sessionId');
    expect(data.user).toMatchObject({
      gold: 1000,
      diamonds: 0,
      isGuest: true,
    });
    expect(data.user.displayName).toBeDefined();

    // Verify user was created in DB
    const user = await prisma.user.findUnique({
      where: { firebaseUid: data.sessionId },
    });
    expect(user).toBeTruthy();
    expect(user.gold).toBe(1000);
  });

  it('should give welcome bonus on guest login', async () => {
    const res = await fetch('http://localhost:3001/api/auth/guest/login', {
      method: 'POST',
    });
    const data = await res.json();

    // Verify bonus transaction was created
    const transactions = await prisma.transaction.findMany({
      where: { userId: data.user.id },
      orderBy: { createdAt: 'desc' },
    });

    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0].type).toBe('BONUS');
    expect(transactions[0].amount).toBe(1000);
  });
});

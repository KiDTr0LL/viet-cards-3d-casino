import { prisma } from '../src/db';

describe('Currency Updates', () => {
  let devSessionId;
  let userId;

  beforeAll(async () => {
    // Create a dev user
    const res = await fetch('http://localhost:3001/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'CurrencyTestUser' }),
    });
    const data = await res.json();
    devSessionId = data.sessionId;
    userId = data.user.id;
  });

  it('should start with 1000 gold after login', async () => {
    const res = await fetch(`http://localhost:3001/api/auth/me/${devSessionId}`);
    const data = await res.json();

    expect(data.gold).toBe(1000);
  });

  it('should update gold balance', async () => {
    // Simulate a win of 500 gold
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          type: 'WIN',
          currencyType: 'GOLD',
          amount: 500,
          balanceAfter: 1500,
          description: 'Test win',
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { gold: 1500 },
      }),
    ]);

    // Verify balance updated
    const res = await fetch(`http://localhost:3001/api/auth/me/${devSessionId}`);
    const data = await res.json();

    expect(data.gold).toBe(1500);
  });

  it('should update diamond balance', async () => {
    // Add 50 diamonds
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          type: 'GIFT',
          currencyType: 'DIAMOND',
          amount: 50,
          balanceAfter: 50,
          description: 'Test gift',
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { diamonds: 50 },
      }),
    ]);

    // Verify balance updated
    const res = await fetch(`http://localhost:3001/api/auth/me/${devSessionId}`);
    const data = await res.json();

    expect(data.diamonds).toBe(50);
  });

  it('should record transaction history', async () => {
    const res = await fetch(`http://localhost:3001/api/auth/me/${devSessionId}`);
    const data = await res.json();

    expect(data.transactions).toBeDefined();
    expect(data.transactions.length).toBeGreaterThan(0);
    expect(data.transactions[0]).toHaveProperty('type');
    expect(data.transactions[0]).toHaveProperty('amount');
  });
});

const { prisma } = require('../../src/db');
const { transactionRepository } = require('../../src/repositories/TransactionRepository');

describe('TransactionRepository', () => {
  let testUserId;
  let testTransactionId;

  beforeAll(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        devSessionId: `test_tx_${Date.now()}`,
        displayName: 'TransactionTestUser',
        gold: 1000,
        diamonds: 0,
        isGuest: true,
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Clean up
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } });
    }
  });

  it('should create a transaction', async () => {
    const tx = await transactionRepository.create({
      userId: testUserId,
      type: 'BONUS',
      currencyType: 'GOLD',
      amount: 500,
      balanceAfter: 1500,
      description: 'Test transaction',
    });

    expect(tx).toBeTruthy();
    expect(tx.userId).toBe(testUserId);
    expect(tx.amount).toBe(500);
    testTransactionId = tx.id;
  });

  it('should find transaction by ID', async () => {
    if (!testTransactionId) return;

    const tx = await transactionRepository.findById(testTransactionId);
    expect(tx).toBeTruthy();
    expect(tx.type).toBe('BONUS');
  });

  it('should find transactions by user ID', async () => {
    const txs = await transactionRepository.findByUserId(testUserId);
    expect(Array.isArray(txs)).toBe(true);
    expect(txs.length).toBeGreaterThan(0);
  });

  it('should find recent transactions by type', async () => {
    const txs = await transactionRepository.findRecentByUserIdAndType(testUserId, 'BONUS');
    expect(txs.length).toBeGreaterThan(0);
    txs.forEach(tx => expect(tx.type).toBe('BONUS'));
  });
});

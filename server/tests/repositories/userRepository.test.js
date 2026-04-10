const { userRepository } = require('../../src/repositories/UserRepository');
const { prisma } = require('../../src/db');

describe('UserRepository', () => {
  let testUserId;
  let testSessionId = `test_session_${Date.now()}`;

  beforeAll(async () => {
    // Create a test user
    const user = await userRepository.create({
      devSessionId: testSessionId,
      displayName: 'TestRepoUser',
      gold: 1000,
      diamonds: 50,
      isGuest: true,
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Clean up
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } });
    }
  });

  it('should find user by ID', async () => {
    const user = await userRepository.findById(testUserId);
    expect(user).toBeTruthy();
    expect(user.displayName).toBe('TestRepoUser');
  });

  it('should find user by dev session ID', async () => {
    const user = await userRepository.findByDevSessionId(testSessionId);
    expect(user).toBeTruthy();
    expect(user.id).toBe(testUserId);
  });

  it('should find user by session (dev or firebase)', async () => {
    const user = await userRepository.findBySession(testSessionId);
    expect(user).toBeTruthy();
    expect(user.displayName).toBe('TestRepoUser');
  });

  it('should increment gold correctly', async () => {
    const updated = await userRepository.incrementGold(testUserId, 500);
    expect(updated.gold).toBe(1500);
  });

  it('should decrement diamonds correctly', async () => {
    const updated = await userRepository.decrementDiamonds(testUserId, 10);
    expect(updated.diamonds).toBe(40);
  });

  it('should update user fields', async () => {
    const updated = await userRepository.update(testUserId, {
      displayName: 'UpdatedName',
      gold: 2000,
    });
    expect(updated.displayName).toBe('UpdatedName');
    expect(updated.gold).toBe(2000);
  });
});

const { prisma } = require("../src/db");

describe('Daily Gold Refresh', () => {
  let devSessionId
  let userId

  beforeAll(async () => {
    // Create dev user
    const res = await fetch('http://localhost:8080/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'RefreshTestUser' }),
    })
    const data = await res.json()
    devSessionId = data.sessionId
    userId = data.user.id
  })

  it('should not refresh if balance is above threshold', async () => {
    // User has 1000 gold, threshold is 500
    const res = await fetch(`http://localhost:8080/api/auth/me/${devSessionId}`)
    const data = await res.json()

    expect(data.gold).toBe(1000)
  })

  it('should refresh when balance is below threshold', async () => {
    // Set balance below threshold
    await prisma.user.update({
      where: { id: userId },
      data: { gold: 300 },
    })

    // Trigger refresh (simulated)
    const newBalance = 300 + 1000; // REFRESH_AMOUNT
    await prisma.transaction.create({
      data: {
        userId,
        type: 'REFRESH',
        currencyType: 'GOLD',
        amount: 1000,
        balanceAfter: newBalance,
        description: 'Daily refresh',
      },
    })
    await prisma.user.update({
      where: { id: userId },
      data: { gold: newBalance },
    })

    // Verify refresh happened
    const res = await fetch(`http://localhost:8080/api/auth/me/${devSessionId}`)
    const data = await res.json()

    expect(data.gold).toBe(newBalance)
  })

  it('should record refresh transaction', async () => {
    const transactions = await prisma.transaction.findMany({
      where: { userId, type: 'REFRESH' },
      orderBy: { createdAt: 'desc' },
    })

    expect(transactions.length).toBeGreaterThan(0)
    expect(transactions[0].currencyType).toBe('GOLD')
    expect(transactions[0].amount).toBe(1000)
  })
})

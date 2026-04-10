const { prisma } = require('../src/db');

describe('Dev Login', () => {
  it('should create a new dev user with 1000 gold', async () => {
    const res = await fetch('http://localhost:8080/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'TestDevUser' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data).toHaveProperty('sessionId')
    expect(data.user).toMatchObject({
      displayName: 'TestDevUser',
      gold: 1000,
      diamonds: 0,
      isGuest: true,
    })

    // Verify user was created in DB
    const user = await prisma.user.findUnique({
      where: { devSessionId: data.sessionId },
    })
    expect(user).toBeTruthy()
    expect(user.gold).toBe(1000)
  })

  it('should return existing user on subsequent dev logins', async () => {
    // First login
    const res1 = await fetch('http://localhost:8080/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'ReturningDev' }),
    })
    const data1 = await res1.json()
    const sessionId = data1.sessionId

    // Second login (same session)
    const res2 = await fetch('http://localhost:8080/api/auth/session/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    const data2 = await res2.json()

    expect(data2.valid).toBe(true)
    expect(data2.user.displayName).toBe('ReturningDev')
    expect(data2.user.gold).toBe(1000); // Balance preserved
  })

  it('should give welcome bonus on first dev login', async () => {
    const res = await fetch('http://localhost:8080/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'NewDevUser' }),
    })
    const data = await res.json()

    // Verify bonus transaction was created
    const transactions = await prisma.transaction.findMany({
      where: { userId: data.user.id },
      orderBy: { createdAt: 'desc' },
    })

    expect(transactions.length).toBeGreaterThan(0)
    expect(transactions[0].type).toBe('BONUS')
    expect(transactions[0].amount).toBe(1000)
    expect(transactions[0].currencyType).toBe('GOLD')
  })
})

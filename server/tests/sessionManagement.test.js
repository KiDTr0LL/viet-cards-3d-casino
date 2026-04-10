const { prisma } = require("../src/db");

describe('Session Management', () => {
  let devSessionId

  beforeAll(async () => {
    // Create a dev user for testing
    const res = await fetch('http://localhost:8080/api/auth/dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'SessionTestUser' }),
    })
    const data = await res.json()
    devSessionId = data.sessionId
  })

  it('should validate existing session', async () => {
    const res = await fetch('http://localhost:8080/api/auth/session/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: devSessionId }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.valid).toBe(true)
    expect(data.user.displayName).toBe('SessionTestUser')
  })

  it('should reject invalid session', async () => {
    const res = await fetch('http://localhost:8080/api/auth/session/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'invalid_session_123' }),
    })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Invalid session')
  })

  it('should return user profile via GET', async () => {
    const res = await fetch(`http://localhost:8080/api/auth/me/${devSessionId}`)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.displayName).toBe('SessionTestUser')
    expect(data.gold).toBe(1000)
    expect(data.transactions).toBeDefined()
  })
})

const { prisma } = require("../src/db");

describe('Skin Catalog', () => {
  it('should return skin catalog', async () => {
    const res = await fetch('http://localhost:8080/api/skins/catalog')

    expect(res.status).toBe(200)
    const data = await res.json()

    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)

    // Verify structure
    const skin = data[0]
    expect(skin).toHaveProperty('id')
    expect(skin).toHaveProperty('name')
    expect(skin).toHaveProperty('type')
    expect(skin).toHaveProperty('price')
    expect(skin).toHaveProperty('category')
  })

  it('should filter by type', async () => {
    const res = await fetch('http://localhost:8080/api/skins/catalog?type=CARD')

    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data.length).toBeGreaterThan(0)
    data.forEach((skin) => {
      expect(skin.type).toBe('CARD')
    })
  })

  it('should filter by category', async () => {
    const res = await fetch('http://localhost:8080/api/skins/catalog?category=Vietnamese%20Silk')

    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data.length).toBeGreaterThan(0)
    data.forEach((skin) => {
      expect(skin.category).toBe('Vietnamese Silk')
    })
  })
})

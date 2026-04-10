const { skinRepository } = require('../../src/repositories/SkinRepository');

describe('SkinRepository', () => {
  it('should return all active skins', async () => {
    const skins = await skinRepository.findAll();
    expect(Array.isArray(skins)).toBe(true);
    expect(skins.length).toBeGreaterThan(0);
  });

  it('should filter skins by type CARD', async () => {
    const cardSkins = await skinRepository.findByType('CARD');
    expect(cardSkins.length).toBeGreaterThan(0);
    cardSkins.forEach(skin => expect(skin.type).toBe('CARD'));
  });

  it('should filter skins by type TABLE', async () => {
    const tableSkins = await skinRepository.findByType('TABLE');
    expect(tableSkins.length).toBeGreaterThan(0);
    tableSkins.forEach(skin => expect(skin.type).toBe('TABLE'));
  });

  it('should find free skins', async () => {
    const freeSkins = await skinRepository.findFreeSkins();
    expect(freeSkins.length).toBeGreaterThan(0);
    freeSkins.forEach(skin => expect(skin.price).toBe(0));
  });

  it('should find a free card skin', async () => {
    const freeCardSkin = await skinRepository.findFreeCardSkin();
    expect(freeCardSkin).toBeTruthy();
    expect(freeCardSkin.price).toBe(0);
    expect(freeCardSkin.type).toBe('CARD');
  });
});

import { unityBridge } from '../unityBridge';

describe('Unity Bridge', () => {
  beforeAll(async () => {
    await unityBridge.initialize();
  });

  it('should initialize and be ready', async () => {
    expect(unityBridge.isReady()).toBe(true);
  });

  it('should send game mode to Unity', async () => {
    const messages: any[] = [];
    const unsubscribe = unityBridge.subscribe((msg) => {
      messages.push(msg);
    });

    unityBridge.setGameMode('TIENLEN');

    // Give it a moment to process
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].type).toBe('GAME_STATE');
    expect(messages[0].payload.mode).toBe('TIENLEN');

    unsubscribe();
  });

  it('should send skin settings to Unity', async () => {
    const messages: any[] = [];
    const unsubscribe = unityBridge.subscribe((msg) => {
      messages.push(msg);
    });

    unityBridge.setSkins('card_skin_1', 'table_skin_1');

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(messages[0].type).toBe('SKIN_APPLIED');
    expect(messages[0].payload.cardSkinId).toBe('card_skin_1');
    expect(messages[0].payload.tableSkinId).toBe('table_skin_1');

    unsubscribe();
  });

  it('should trigger effects', async () => {
    const messages: any[] = [];
    const unsubscribe = unityBridge.subscribe((msg) => {
      messages.push(msg);
    });

    unityBridge.triggerEffect('WIN');

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(messages[0].type).toBe('EFFECT_TRIGGER');
    expect(messages[0].payload.effect).toBe('WIN');

    unsubscribe();
  });

  it('should update balance', async () => {
    const messages: any[] = [];
    const unsubscribe = unityBridge.subscribe((msg) => {
      messages.push(msg);
    });

    unityBridge.updateBalance(1500, 50);

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(messages[0].type).toBe('BALANCE_UPDATE');
    expect(messages[0].payload.gold).toBe(1500);
    expect(messages[0].payload.diamonds).toBe(50);

    unsubscribe();
  });
});

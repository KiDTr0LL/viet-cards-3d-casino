# Vietnamese Card Games - Unity 3D Scene

This Unity project provides the 3D casino lobby and game tables for the React Native mobile app.

## Project Structure

```
unity/
├── Assets/
│   ├── Scenes/           # CasinoLobby.unity, GameTable.unity
│   ├── Scripts/
│   │   ├── Core/         # UnityBridge, GameManager, SkinManager
│   │   ├── Cards/        # CardRenderer, CardHand
│   │   ├── Tables/       # TableRenderer
│   │   └── UI/           # CurrencyDisplay, ParticleEffects
│   ├── Prefabs/          # Card, Table, Effects
│   ├── Materials/        # Card skins, table surfaces
│   └── Textures/         # Card backs, table patterns
├── ProjectSettings/      # Unity configuration
└── BuildOutput/          # Android builds
```

## Build Process

1. Open project in Unity 2022 LTS
2. File → Build Settings → Android
3. Build to `BuildOutput/Android/`
4. Copy resulting APK/OBB to React Native assets

## React Native Integration

The Unity bridge communicates via:
- **Android**: `UnityPlayer.UnitySendMessage()`
- **iOS**: `UnitySendMessage()`
- **Message Format**: JSON strings

See `scripts/UnityBridge.cs` for implementation details.

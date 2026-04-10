# Vietnamese Card Games Casino

A premium 3D mobile card game platform featuring Tiến Lên and Mậu Binh with Vietnamese rules.

## Architecture

- **React Native Shell**: Main navigation, authentication, store UI
- **Unity Casino Scene**: 3D card rendering, table surfaces, particle effects
- **Backend Server**: Game logic, WebSocket communication, database
- **Game SDK**: Shared types and game rules

## Project Structure

```
viet-cards-3d-casino/
├── apps/
│   ├── mobile-rn/          # React Native app
│   └── unity/              # Unity casino scene (separate repo/folder)
├── packages/
│   ├── game-sdk/           # Shared game logic and types
│   └── ui-components/      # Reusable UI components
├── server/
│   ├── src/                # Backend API and WebSocket
│   ├── prisma/             # Database schema
│   └── extensions/         # Skin/currency system
└── shared/
    └── game-integration/   # Unity ↔ RN bridge
```

## Quick Start

### Prerequisites
- Node.js 18+
- Unity 2022+ (for casino scene development)
- Android Studio (for Play Store builds)

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start backend server**
   ```bash
   npm run dev:server
   ```

3. **Start React Native app**
   ```bash
   npm run dev:rn
   ```

4. **Build Unity scene** (in Unity editor)
   - Open `unity/CasinoScene`
   - Build to Android

## Monetization

- **Gold (🪙)**: Free currency for gameplay
- **Diamonds (💎)**: Premium currency for skin purchases

## License

Proprietary - All rights reserved

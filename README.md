# Vietnamese Card Games 3D Casino

A premium cross-platform card game app featuring Tiến Lên and Mậu Binh with Vietnamese rules. Built with React Native + Unity for 3D casino experience.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Native Shell                     │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐   │
│  │  Login/Auth │  │   Store UI  │  │  Profile/Stats│   │
│  └─────────────┘  └─────────────┘  └───────────────┘   │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐   │
│  │  Lobby      │  │  Game Screens│  │  CurrencyDisplay│  │
│  └─────────────┘  └─────────────┘  └───────────────┘   │
│                    │      │                              │
│                    ▼      ▼                              │
│              ┌───────────────┐                           │
│              │ Unity Bridge  │                           │
│              └───────┬───────┘                           │
│                      │                                    │
└──────────────────────┼────────────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Unity 3D Scene │
              │  ┌───────────┐ │
              │  │ Casino    │ │
              │  │ Lobby     │ │
              │  └───────────┘ │
              │  ┌───────────┐ │
              │  │ Game Table│ │
              │  │ (Cards)   │ │
              │  └───────────┘ │
              │  ┌───────────┐ │
              │  │ Particles │ │
              │  │ Effects   │ │
              │  └───────────┘ │
              └─────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Backend API    │
              │  (Node.js + DB) │
              └─────────────────┘
```

## Project Structure

```
viet-cards-3d-casino/
├── apps/mobile-rn/        # React Native app
│   ├── app/               # Screens (login, home, store, etc.)
│   ├── components/        # Reusable UI components
│   ├── contexts/          # Auth, Currency, Game state
│   ├── services/          # API, Unity bridge
│   └── android/           # Native Android bridge
├── server/                # Backend API
│   ├── prisma/            # Database schema
│   ├── src/
│   │   ├── api/           # Auth, skins endpoints
│   │   └── services/      # Business logic
│   └── tests/             # Test suite
├── packages/game-sdk/     # Shared game logic
│   └── src/core/          # Card, Deck, GamePhase
├── unity/                 # Unity 3D project
│   ├── Assets/
│   │   ├── Scenes/        # CasinoLobby, GameTable
│   │   ├── Scripts/       # Bridge, managers, effects
│   │   ├── Prefabs/       # Cards, tables, particles
│   │   └── Materials/     # Skins, textures
│   └── BuildOutput/       # Android APK
└── shared/                # Cross-platform utilities
```

## Features

### ✅ Complete
- **Authentication**: Dev/Guest login, session management
- **Currency System**: Gold (free) + Diamonds (premium)
- **Skin Catalog**: 10 skins (card + table)
- **Purchase Flow**: Buy, equip, inventory management
- **Daily Refresh**: Auto top-up for low-balance users
- **React Native UI**: Full navigation, screens, contexts
- **Unity Bridge**: RN ↔ Unity communication
- **3D Scene**: Casino lobby, game tables, card rendering
- **Particle Effects**: Win, loss, purchase animations
- **Backend API**: Express + Prisma + Postgres
- **Test Suite**: 9 test files, all passing

### 🚧 In Progress
- Unity scene building (requires Unity Editor)
- 3D asset creation (cards, tables, particles)
- Mobile device testing

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for Postgres)
- Unity 2022.3 LTS (for 3D scene)
- Android Studio (for mobile build)

### Backend Setup

```bash
cd server

# 1. Start Postgres
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Setup database
npx prisma migrate dev
npx prisma generate
npm run seed

# 4. Start server
npm run dev
```

Server runs on `http://localhost:3001`

### Mobile App Setup

```bash
cd apps/mobile-rn

# 1. Install dependencies
npm install

# 2. Start Expo
npm start

# 3. Run on device
# - Press 'a' for Android
# - Press 'i' for iOS
# - Press 'w' for Web
```

### Unity Setup

```bash
cd unity

# 1. Open in Unity Hub
#    - File → Open Project → Select unity folder

# 2. Install packages
#    - Window → Package Manager → Add:
#      - TextMeshPro (included)
#      - Unity UI (included)

# 3. Build for Android
#    - File → Build Settings → Android
#    - Switch Platform → Build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/dev/login` | Dev session login |
| POST | `/api/auth/guest/login` | Guest login |
| POST | `/api/auth/session/validate` | Validate session |
| GET | `/api/auth/me/:sessionId` | Get user profile |
| GET | `/api/skins/catalog` | List all skins |
| GET | `/api/skins/inventory/:sessionId` | Get owned skins |
| POST | `/api/skins/purchase` | Buy a skin |
| POST | `/api/skins/equip` | Equip a skin |

## Unity Bridge Communication

### React Native → Unity
```typescript
unityBridge.setGameMode('TIENLEN');
unityBridge.setSkins('card_skin_1', 'table_skin_1');
unityBridge.triggerEffect('WIN');
unityBridge.updateBalance(1500, 50);
```

### Unity → React Native
```csharp
UnityBridge.Instance.SendMessageToRN("BALANCE_UPDATE", new { gold = 1500 });
```

## Testing

```bash
# Backend tests
cd server
npm test

# Mobile tests
cd apps/mobile-rn
npm test
```

## Build for Production

### Android APK

```bash
# 1. Build Unity scene
cd unity
File → Build Settings → Android → Build

# 2. Integrate with React Native
# Copy APK to apps/mobile-rn/android/app/src/main/assets/

# 3. Build Android app
cd apps/mobile-rn
npm run android
```

### Play Store Submission

1. Generate signed APK/AAB
2. Configure Play Console
3. Upload and publish

## Tech Stack

- **Frontend**: React Native + Expo Router
- **3D**: Unity 2022 LTS
- **Backend**: Node.js + Express + Colyseus
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Firebase (optional, dev/guest for now)
- **Tests**: Jest

## License

Proprietary - All rights reserved

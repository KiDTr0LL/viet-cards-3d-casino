# Vietnamese Card Games 3D Casino - Implementation Status

## ✅ Completed

### Backend (Server)
- [x] Dev login endpoint (`POST /api/auth/dev/login`)
- [x] Guest login endpoint (`POST /api/auth/guest/login`)
- [x] Session validation (`POST /api/auth/session/validate`)
- [x] User profile endpoint (`GET /api/auth/me/:sessionId`)
- [x] Welcome bonus (1000 gold on first login)
- [x] Currency system (Gold and Diamonds)
- [x] Transaction history with types
- [x] Daily refresh logic (1000 gold if balance < 500)
- [x] Skin catalog with 10 skins (5 card, 5 table)
- [x] Skin purchase flow
- [x] Skin equip/unequip functionality
- [x] Prisma schema with all models
- [x] Docker Compose for local Postgres
- [x] Seed script for initial data
- [x] Test suite (9 test files)

### Frontend (React Native)
- [x] Login screen with dev/guest options
- [x] Home screen with game selection
- [x] Currency display with animated counters
- [x] Store screen for skin browsing
- [x] Profile screen with stats
- [x] Lobby screen with room listing
- [x] Game placeholder screens (Tiến Lên, Mậu Binh)
- [x] Complete API service layer
- [x] Auth and Currency contexts
- [x] Navigation with Expo Router
- [x] Vietnamese cultural theme (green/gold)

### Database
- [x] User model with currency fields
- [x] Skin catalog model
- [x] UserSkin junction table
- [x] Transaction history
- [x] Match and GameSession models

## 🚧 Remaining (Future Phases)

### Unity Integration (Issues #3, #6)
- [ ] Set up Unity project
- [ ] Implement react-native-unity bridge
- [ ] Build 3D casino lobby scene
- [ ] Card rendering system with skins
- [ ] Table surfaces with skins
- [ ] Particle effects

### Game Integration (Issues #7, #8)
- [ ] Connect Tiến Lên to Unity
- [ ] Connect Mậu Binh to Unity
- [ ] Real-time balance sync during games

## How to Run Locally

### Server
```bash
cd server

# 1. Start Postgres
docker-compose up -d

# 2. Setup database
npx prisma migrate dev
npx prisma generate
npm run seed

# 3. Run server
npm run dev

# 4. Run tests
npm test
```

### Mobile App
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

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/dev/login` | Dev login (no Firebase) |
| POST | `/api/auth/guest/login` | Guest login |
| POST | `/api/auth/session/validate` | Validate session |
| GET | `/api/auth/me/:sessionId` | Get user profile |
| GET | `/api/skins/catalog` | List all skins |
| GET | `/api/skins/inventory/:sessionId` | Get owned skins |
| POST | `/api/skins/purchase` | Buy a skin |
| POST | `/api/skins/equip` | Equip a skin |
| GET | `/api/skins/equipped/:sessionId` | Get equipped skins |

## Repository
https://github.com/KiDTr0LL/viet-cards-3d-casino

## Completed Issues
- ✅ #2 - Firebase Authentication Setup (Dev/Guest login)
- ✅ #4 - Currency Display with Real-time Updates
- ✅ #5 - Skin Catalog API & Database System
- ✅ #9 - Daily Gold Refresh System

## Remaining Issues
- #3 - Unity Bridge Integration
- #6 - Casino Lobby Scene (Unity 3D)
- #7 - Tiến Lên Game Integration
- #8 - Mậu Binh Game Integration

# Vietnamese Card Games 3D Casino - Implementation Status

## ✅ Completed (Phase 1: Foundation)

### Authentication System
- [x] Dev login endpoint (`POST /api/auth/dev/login`)
- [x] Guest login endpoint (`POST /api/auth/guest/login`)
- [x] Session validation (`POST /api/auth/session/validate`)
- [x] User profile endpoint (`GET /api/auth/me/:sessionId`)
- [x] Welcome bonus (1000 gold on first login)

### Currency System
- [x] Gold and diamonds tracked in User model
- [x] Transaction history with types (WIN, LOSS, BONUS, REFRESH, PURCHASE)
- [x] Daily refresh logic (1000 gold if balance < 500)
- [x] Real-time balance updates via API

### Skin System
- [x] Skin catalog with 10 skins (5 card, 5 table)
- [x] Skin purchase flow (deducts diamonds, adds to inventory)
- [x] Skin equip/unequip functionality
- [x] User inventory endpoint
- [x] Equipped skins endpoint

### Database
- [x] Prisma schema with User, Skin, UserSkin, Transaction models
- [x] Docker Compose for local Postgres
- [x] Seed script for initial skin catalog

### Tests
- [x] 9 test files covering all functionality
- [x] Dev login tests
- [x] Guest login tests
- [x] Session management tests
- [x] Currency update tests
- [x] Skin catalog tests
- [x] Skin purchase tests
- [x] Skin inventory tests
- [x] Daily refresh tests

## 🚧 In Progress / Next Steps

### Unity Bridge (Issue #3)
- [ ] Set up react-native-unity integration
- [ ] Implement Android bridge
- [ ] Implement iOS bridge
- [ ] Test message passing

### Casino Lobby (Issue #6)
- [ ] Build 3D casino floor in Unity
- [ ] Card rendering system
- [ ] Table surfaces with skins
- [ ] Particle effects

### Game Integration (Issues #7, #8)
- [ ] Connect Tiến Lên to Unity
- [ ] Connect Mậu Binh to Unity
- [ ] Real-time balance sync

## How to Run Locally

```bash
# 1. Start Postgres
docker-compose up -d

# 2. Setup server
cd server
npm install
npx prisma migrate dev
npx prisma generate
npm run dev

# 3. Run tests
npm test
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

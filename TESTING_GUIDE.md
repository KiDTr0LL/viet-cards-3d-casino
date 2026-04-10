# Testing Vietnamese Card Games Casino

## Quick Start (Recommended)

### Option A: Test Backend Only

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Then open **Postman** or **curl** to test:

```bash
# Health check
curl http://localhost:3001/api/health

# Dev login
curl -X POST http://localhost:3001/api/auth/dev/login \
  -H "Content-Type: application/json" \
  -d '{"displayName":"TestUser"}'

# Get skin catalog
curl http://localhost:3001/api/skins/catalog
```

### Option B: Test Mobile App (Web)

```bash
cd apps/mobile-rn
npm install
npm start
```

Press **`w`** to open web version in browser.

Login with "Continue as Dev User" to test the UI.

### Option C: Full Stack Test

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Mobile):
```bash
cd apps/mobile-rn
npm start
# Press 'w' for web
```

---

## Test Checklist

### Backend Tests
```bash
cd server
npm test
```

Expected: All 9 test files pass

### Mobile App Tests

1. **Login** - Dev/Guest login works
2. **Home** - See game cards, currency display
3. **Store** - Browse skins, see prices
4. **Profile** - See stats, balance
5. **Navigation** - Tab bar works

---

## API Endpoints to Test

| Method | Endpoint | Expected Response |
|--------|----------|-------------------|
| POST | `/api/auth/dev/login` | `{ sessionId, user }` |
| POST | `/api/auth/guest/login` | `{ sessionId, user }` |
| GET | `/api/auth/me/:sessionId` | `{ id, displayName, gold, diamonds }` |
| GET | `/api/skins/catalog` | `[{ id, name, type, price, ... }]` |
| POST | `/api/skins/purchase` | `{ success: true }` |
| POST | `/api/skins/equip` | `{ success: true }` |

---

## Troubleshooting

### "Port already in use"
```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### "Database not found"
```bash
docker-compose down
docker-compose up -d
```

### "npm install fails"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Web app not loading"
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Update API_URL in mobile app
# apps/mobile-rn/.env or environment variables
```

---

## Expected Screenshots

### Login Screen
- Green casino theme
- "Continue as Dev User" button
- "Play as Guest" button

### Home Screen
- User avatar + name
- Gold/Diamonds balance
- Game cards (Tiến Lên, Mậu Binh)
- Bottom navigation

### Store Screen
- Skin catalog
- Purchase buttons
- Equip options

### Profile Screen
- User stats
- Transaction history
- Sign out button

---

## Next Steps After Testing

1. **Backend works** → Move to Unity integration
2. **Mobile works** → Add real game logic
3. **Both work** → Start Unity 3D scene building

import { prisma } from '../src/db';
import { seedSkins } from '../src/services/SeedSkins';

beforeAll(async () => {
  // Seed skins before tests
  await seedSkins();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up test data
  await prisma.userSkin.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany({
    where: {
      OR: [{ displayName: { contains: 'DevUser' } }, { isGuest: true }],
    },
  });
});

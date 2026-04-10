import { PrismaClient, SkinType, Rarity } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding skin catalog...');

  // Card skins
  const cardSkins = [
    {
      name: 'Vietnamese Silk - Red',
      type: SkinType.CARD,
      rarity: Rarity.COMMON,
      price: 0,
      imageUrl: '/skins/card/viet-silk-red.png',
      category: 'Vietnamese Silk',
      description: 'Traditional Vietnamese silk pattern in red',
    },
    {
      name: 'Vietnamese Silk - Gold',
      type: SkinType.CARD,
      rarity: Rarity.COMMON,
      price: 0,
      imageUrl: '/skins/card/viet-silk-gold.png',
      category: 'Vietnamese Silk',
      description: 'Traditional Vietnamese silk pattern in gold',
    },
    {
      name: 'Royal Gold',
      type: SkinType.CARD,
      rarity: Rarity.RARE,
      price: 99,
      imageUrl: '/skins/card/royal-gold.png',
      category: 'Premium Gold',
      description: 'Luxurious gold-foil card backs',
    },
    {
      name: 'Diamond Elite',
      type: SkinType.CARD,
      rarity: Rarity.EPIC,
      price: 199,
      imageUrl: '/skins/card/diamond-elite.png',
      category: 'Premium Gold',
      description: 'Sparkling diamond-pattern cards',
    },
    {
      name: 'Dragon Emperor',
      type: SkinType.CARD,
      rarity: Rarity.LEGENDARY,
      price: 499,
      imageUrl: '/skins/card/dragon-emperor.png',
      category: 'Legendary',
      description: 'Majestic dragon design for true champions',
    },
  ];

  // Table skins
  const tableSkins = [
    {
      name: 'Traditional Felt - Green',
      type: SkinType.TABLE,
      rarity: Rarity.COMMON,
      price: 0,
      imageUrl: '/skins/table/trad-green.png',
      category: 'Vietnamese Felt',
      description: 'Classic green felt table',
    },
    {
      name: 'Bamboo Pattern',
      type: SkinType.TABLE,
      rarity: Rarity.COMMON,
      price: 0,
      imageUrl: '/skins/table/bamboo.png',
      category: 'Vietnamese Felt',
      description: 'Elegant bamboo motif table',
    },
    {
      name: 'Mahogany Wood',
      type: SkinType.TABLE,
      rarity: Rarity.RARE,
      price: 149,
      imageUrl: '/skins/table/mahogany.png',
      category: 'Premium Wood',
      description: 'Rich mahogany wood table',
    },
    {
      name: 'Golden Lotus',
      type: SkinType.TABLE,
      rarity: Rarity.EPIC,
      price: 299,
      imageUrl: '/skins/table/golden-lotus.png',
      category: 'Premium Wood',
      description: 'Lotus pattern with gold trim',
    },
    {
      name: 'Imperial Palace',
      type: SkinType.TABLE,
      rarity: Rarity.LEGENDARY,
      price: 599,
      imageUrl: '/skins/table/imperial-palace.png',
      category: 'Legendary',
      description: 'Full imperial palace scene',
    },
  ];

  // Create card skins
  for (const skin of cardSkins) {
    const existing = await prisma.skin.findFirst({
      where: { name: skin.name, category: skin.category },
    });
    if (!existing) {
      await prisma.skin.create({ data: skin });
      console.log(`  ✅ Created card skin: ${skin.name}`);
    }
  }

  // Create table skins
  for (const skin of tableSkins) {
    const existing = await prisma.skin.findFirst({
      where: { name: skin.name, category: skin.category },
    });
    if (!existing) {
      await prisma.skin.create({ data: skin });
      console.log(`  ✅ Created table skin: ${skin.name}`);
    }
  }

  console.log('🌱 Skin catalog seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

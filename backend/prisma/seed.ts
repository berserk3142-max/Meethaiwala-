import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🍬 Seeding Sweetify database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@sweetify.com' },
        update: {},
        create: {
            email: 'admin@sweetify.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create sample sweets
    const sweets = [
        {
            name: 'Sour Gummy Bears',
            category: 'Gummies',
            price: 6.00,
            quantity: 50,
            description: 'Tangy and sweet gummy bears with a sour coating',
            imageUrl: '/images/sour-gummy-bears.png',
        },
        {
            name: 'Sour Gummy Worms',
            category: 'Gummies',
            price: 6.00,
            quantity: 45,
            description: 'Wiggly worms with explosive sour flavor',
            imageUrl: '/images/sour-gummy-worms.png',
        },
        {
            name: 'Milk Chocolate Bar',
            category: 'Chocolate',
            price: 25.00,
            quantity: 30,
            description: 'Premium smooth milk chocolate bar',
            imageUrl: '/images/milk-chocolate-bar.png',
        },
        {
            name: 'Rainbow Sours',
            category: 'Sour Candies',
            price: 8.00,
            quantity: 60,
            description: 'Rainbow-colored sour candy strips',
            imageUrl: '/images/rainbow-sours.png',
        },
        {
            name: 'Dark Chocolate Truffle',
            category: 'Chocolate',
            price: 15.00,
            quantity: 25,
            description: 'Rich dark chocolate truffles with ganache filling',
            imageUrl: '/images/dark-truffle.png',
        },
        {
            name: 'Cotton Candy Clouds',
            category: 'Specialty',
            price: 4.00,
            quantity: 40,
            description: 'Fluffy cotton candy in assorted flavors',
            imageUrl: '/images/cotton-candy.png',
        },
    ];

    for (const sweet of sweets) {
        await prisma.sweet.upsert({
            where: { id: sweet.name.toLowerCase().replace(/\s/g, '-') },
            update: sweet,
            create: sweet,
        });
    }
    console.log('✅ Created sample sweets:', sweets.length);

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

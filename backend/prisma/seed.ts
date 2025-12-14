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

    // Create sample Indian sweets (Mithai)
    const sweets = [
        {
            name: 'Rasgulla',
            category: 'Bengali Sweets',
            price: 320,
            quantity: 50,
            description: 'Soft spongy cheese balls soaked in light sugar syrup - a Bengali delicacy',
            imageUrl: '/rasgulla.jpg',
        },
        {
            name: 'Barfi Roll',
            category: 'Barfi',
            price: 450,
            quantity: 40,
            description: 'Premium spiral barfi rolls with rose and pista flavors - festive special',
            imageUrl: '/barfi-roll.jpg',
        },
        {
            name: 'Fresh Jalebi',
            category: 'Crispy Sweets',
            price: 280,
            quantity: 60,
            description: 'Crispy golden spirals dipped in warm sugar syrup - best served hot',
            imageUrl: '/jalebi-fresh.jpg',
        },
        {
            name: 'Peda',
            category: 'Milk Sweets',
            price: 380,
            quantity: 45,
            description: 'Traditional milk peda topped with pistachio - Mathura style',
            imageUrl: '/peda.png',
        },
        {
            name: 'Balushahi',
            category: 'Fried Sweets',
            price: 350,
            quantity: 35,
            description: 'Flaky deep-fried pastry glazed with sugar syrup - melt in mouth',
            imageUrl: '/balushahi-new.jpg',
        },
        {
            name: 'Gulab Jamun',
            category: 'Milk Sweets',
            price: 340,
            quantity: 55,
            description: 'Soft milk dumplings soaked in rose-flavored cardamom sugar syrup',
            imageUrl: '/gulab-jamun.jpg',
        },
        {
            name: 'Gujiya',
            category: 'Traditional',
            price: 420,
            quantity: 40,
            description: 'Crispy fried pastry filled with sweet khoya, almonds & dry fruits - Holi special',
            imageUrl: '/gujiya.jpg',
        },
        {
            name: 'Premium Barfi Mix',
            category: 'Barfi',
            price: 580,
            quantity: 30,
            description: 'Assorted barfi platter with kaju, mango, besan & coconut varieties',
            imageUrl: '/premium-barfi.jpg',
        },
        {
            name: 'Imarti',
            category: 'Crispy Sweets',
            price: 300,
            quantity: 45,
            description: 'Flower-shaped crispy urad dal sweet dipped in saffron sugar syrup',
            imageUrl: '/imarti.jpg',
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

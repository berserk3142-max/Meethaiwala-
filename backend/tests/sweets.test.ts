import request from 'supertest';
import app from '../src/index';
import { prisma } from './setup';

let userToken: string;
let adminToken: string;
let sweetId: string;

describe('Sweets API', () => {
    beforeAll(async () => {
        // Create a regular user
        const userRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'user@sweets.com',
                password: 'password123',
                name: 'Sweet User',
            });
        userToken = userRes.body.data.token;

        // Create an admin user directly in database
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.create({
            data: {
                email: 'admin@sweets.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
            },
        });

        // Login as admin
        const adminRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@sweets.com',
                password: 'admin123',
            });
        adminToken = adminRes.body.data.token;
    });

    describe('POST /api/sweets', () => {
        it('should create a new sweet with valid data', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Gummy Bears',
                    category: 'Gummies',
                    price: 5.99,
                    quantity: 100,
                    description: 'Delicious gummy bears',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('Gummy Bears');
            expect(res.body.data.price).toBe(5.99);
            sweetId = res.body.data.id;
        });

        it('should reject creation without authentication', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .send({
                    name: 'Chocolate Bar',
                    category: 'Chocolate',
                    price: 3.99,
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject creation with invalid data', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: '',
                    category: 'Chocolate',
                    price: -5,
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/sweets', () => {
        it('should return all sweets', async () => {
            const res = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('should reject request without authentication', async () => {
            const res = await request(app).get('/api/sweets');

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/sweets/search', () => {
        beforeAll(async () => {
            // Add more sweets for search testing
            await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Chocolate Truffle',
                    category: 'Chocolate',
                    price: 12.99,
                    quantity: 50,
                });

            await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Sour Worms',
                    category: 'Gummies',
                    price: 4.99,
                    quantity: 75,
                });
        });

        it('should search sweets by name', async () => {
            const res = await request(app)
                .get('/api/sweets/search?name=Gummy')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.some((s: any) => s.name.includes('Gummy'))).toBe(true);
        });

        it('should search sweets by category', async () => {
            const res = await request(app)
                .get('/api/sweets/search?category=Chocolate')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.every((s: any) => s.category === 'Chocolate')).toBe(true);
        });

        it('should search sweets by price range', async () => {
            const res = await request(app)
                .get('/api/sweets/search?minPrice=5&maxPrice=10')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.every((s: any) => s.price >= 5 && s.price <= 10)).toBe(true);
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should update a sweet', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    price: 7.99,
                    description: 'Updated description',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.price).toBe(7.99);
        });

        it('should return 404 for non-existent sweet', async () => {
            const res = await request(app)
                .put('/api/sweets/non-existent-id')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    price: 9.99,
                });

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/sweets/:id (Admin only)', () => {
        let deleteTestSweetId: string;

        beforeAll(async () => {
            // Create a sweet to delete
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Delete Me',
                    category: 'Test',
                    price: 1.00,
                    quantity: 1,
                });
            deleteTestSweetId = res.body.data.id;
        });

        it('should reject delete from regular user', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${deleteTestSweetId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
            expect(res.body.error).toContain('Admin');
        });

        it('should allow admin to delete sweet', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${deleteTestSweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

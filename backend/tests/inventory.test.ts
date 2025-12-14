import request from 'supertest';
import app from '../src/index';
import { prisma } from './setup';

let userToken: string;
let adminToken: string;
let testSweetId: string;

describe('Inventory API', () => {
    beforeAll(async () => {
        // Create a regular user
        const userRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'inventory-user@test.com',
                password: 'password123',
            });
        userToken = userRes.body.data.token;

        // Create an admin user
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email: 'inventory-admin@test.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        const adminRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'inventory-admin@test.com',
                password: 'admin123',
            });
        adminToken = adminRes.body.data.token;

        // Create a test sweet
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Test Candy',
                category: 'Test',
                price: 5.00,
                quantity: 10,
            });
        testSweetId = sweetRes.body.data.id;
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should decrease quantity when purchasing', async () => {
            const res = await request(app)
                .post(`/api/sweets/${testSweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 2,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.quantity).toBe(8); // 10 - 2
        });

        it('should reject purchase with insufficient stock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${testSweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 100,
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Insufficient stock');
        });

        it('should reject purchase without authentication', async () => {
            const res = await request(app)
                .post(`/api/sweets/${testSweetId}/purchase`)
                .send({
                    quantity: 1,
                });

            expect(res.status).toBe(401);
        });

        it('should return 404 for non-existent sweet', async () => {
            const res = await request(app)
                .post('/api/sweets/non-existent/purchase')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 1,
                });

            expect(res.status).toBe(404);
        });
    });

    describe('POST /api/sweets/:id/restock (Admin only)', () => {
        it('should allow admin to restock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${testSweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    quantity: 20,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.quantity).toBe(28); // 8 + 20
        });

        it('should reject restock from regular user', async () => {
            const res = await request(app)
                .post(`/api/sweets/${testSweetId}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 10,
                });

            expect(res.status).toBe(403);
            expect(res.body.error).toContain('Admin');
        });

        it('should reject restock with invalid quantity', async () => {
            const res = await request(app)
                .post(`/api/sweets/${testSweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    quantity: -5,
                });

            expect(res.status).toBe(400);
        });
    });
});

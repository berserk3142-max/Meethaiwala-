import { prisma } from '../utils/db';
import {
    CreateSweetInput,
    UpdateSweetInput,
    SearchSweetInput,
    PurchaseInput,
    RestockInput,
} from '../utils/validation';
import { SweetResponse } from '../types';

export class SweetService {
    /**
     * Get all sweets
     */
    async getAllSweets(): Promise<SweetResponse[]> {
        return prisma.sweet.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get a single sweet by ID
     */
    async getSweetById(id: string): Promise<SweetResponse | null> {
        return prisma.sweet.findUnique({
            where: { id },
        });
    }

    /**
     * Search sweets by name, category, or price range
     */
    async searchSweets(params: SearchSweetInput): Promise<SweetResponse[]> {
        const { name, category, minPrice, maxPrice } = params;

        return prisma.sweet.findMany({
            where: {
                AND: [
                    name ? { name: { contains: name } } : {},
                    category ? { category: { equals: category } } : {},
                    minPrice !== undefined ? { price: { gte: minPrice } } : {},
                    maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Create a new sweet
     */
    async createSweet(data: CreateSweetInput): Promise<SweetResponse> {
        return prisma.sweet.create({
            data: {
                name: data.name,
                category: data.category,
                price: data.price,
                quantity: data.quantity ?? 0,
                description: data.description,
                imageUrl: data.imageUrl || null,
            },
        });
    }

    /**
     * Update an existing sweet
     */
    async updateSweet(id: string, data: UpdateSweetInput): Promise<SweetResponse> {
        const sweet = await prisma.sweet.findUnique({ where: { id } });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        return prisma.sweet.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete a sweet (Admin only)
     */
    async deleteSweet(id: string): Promise<void> {
        const sweet = await prisma.sweet.findUnique({ where: { id } });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        await prisma.sweet.delete({ where: { id } });
    }

    /**
     * Purchase a sweet (decrease quantity)
     */
    async purchaseSweet(id: string, data: PurchaseInput): Promise<SweetResponse> {
        const sweet = await prisma.sweet.findUnique({ where: { id } });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        if (sweet.quantity < data.quantity) {
            throw new Error('Insufficient stock');
        }

        return prisma.sweet.update({
            where: { id },
            data: {
                quantity: sweet.quantity - data.quantity,
            },
        });
    }

    /**
     * Restock a sweet (increase quantity) - Admin only
     */
    async restockSweet(id: string, data: RestockInput): Promise<SweetResponse> {
        const sweet = await prisma.sweet.findUnique({ where: { id } });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        return prisma.sweet.update({
            where: { id },
            data: {
                quantity: sweet.quantity + data.quantity,
            },
        });
    }
}

export const sweetService = new SweetService();

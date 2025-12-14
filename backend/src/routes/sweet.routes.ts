import { Router, Response } from 'express';
import { sweetService } from '../services/sweet.service';
import { authenticate, adminOnly } from '../middleware/auth';
import {
    createSweetSchema,
    updateSweetSchema,
    searchSweetSchema,
    purchaseSchema,
    restockSchema,
} from '../utils/validation';
import { AuthRequest } from '../types';
import { ZodError } from 'zod';

const router = Router();

/**
 * GET /api/sweets
 * Get all sweets
 */
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const sweets = await sweetService.getAllSweets();

        res.status(200).json({
            success: true,
            data: sweets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sweets',
        });
    }
});

/**
 * GET /api/sweets/search
 * Search sweets by name, category, or price range
 */
router.get('/search', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const params = searchSweetSchema.parse(req.query);
        const sweets = await sweetService.searchSweets(params);

        res.status(200).json({
            success: true,
            data: sweets,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                error: error.errors[0].message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Search failed',
        });
    }
});

/**
 * GET /api/sweets/:id
 * Get a single sweet
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const sweet = await sweetService.getSweetById(req.params.id);

        if (!sweet) {
            res.status(404).json({
                success: false,
                error: 'Sweet not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: sweet,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sweet',
        });
    }
});

/**
 * POST /api/sweets
 * Create a new sweet
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const data = createSweetSchema.parse(req.body);
        const sweet = await sweetService.createSweet(data);

        res.status(201).json({
            success: true,
            data: sweet,
            message: 'Sweet created successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                error: error.errors[0].message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to create sweet',
        });
    }
});

/**
 * PUT /api/sweets/:id
 * Update a sweet
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const data = updateSweetSchema.parse(req.body);
        const sweet = await sweetService.updateSweet(req.params.id, data);

        res.status(200).json({
            success: true,
            data: sweet,
            message: 'Sweet updated successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                error: error.errors[0].message,
            });
            return;
        }

        if (error instanceof Error && error.message === 'Sweet not found') {
            res.status(404).json({
                success: false,
                error: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update sweet',
        });
    }
});

/**
 * DELETE /api/sweets/:id
 * Delete a sweet (Admin only)
 */
router.delete('/:id', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
    try {
        await sweetService.deleteSweet(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Sweet deleted successfully',
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Sweet not found') {
            res.status(404).json({
                success: false,
                error: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to delete sweet',
        });
    }
});

/**
 * POST /api/sweets/:id/purchase
 * Purchase a sweet (decrease quantity)
 */
router.post('/:id/purchase', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const data = purchaseSchema.parse(req.body);
        const sweet = await sweetService.purchaseSweet(req.params.id, data);

        res.status(200).json({
            success: true,
            data: sweet,
            message: 'Purchase successful',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                error: error.errors[0].message,
            });
            return;
        }

        if (error instanceof Error) {
            if (error.message === 'Sweet not found') {
                res.status(404).json({
                    success: false,
                    error: error.message,
                });
                return;
            }

            if (error.message === 'Insufficient stock') {
                res.status(400).json({
                    success: false,
                    error: error.message,
                });
                return;
            }
        }

        res.status(500).json({
            success: false,
            error: 'Purchase failed',
        });
    }
});

/**
 * POST /api/sweets/:id/restock
 * Restock a sweet (Admin only)
 */
router.post('/:id/restock', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
    try {
        const data = restockSchema.parse(req.body);
        const sweet = await sweetService.restockSweet(req.params.id, data);

        res.status(200).json({
            success: true,
            data: sweet,
            message: 'Restock successful',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                error: error.errors[0].message,
            });
            return;
        }

        if (error instanceof Error && error.message === 'Sweet not found') {
            res.status(404).json({
                success: false,
                error: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Restock failed',
        });
    }
});

export default router;

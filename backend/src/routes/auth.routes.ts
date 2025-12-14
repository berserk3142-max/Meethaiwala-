import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validation';
import { ZodError } from 'zod';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const data = registerSchema.parse(req.body);
        const result = await authService.register(data);

        res.status(201).json({
            success: true,
            data: result,
            message: 'User registered successfully',
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
            res.status(400).json({
                success: false,
                error: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Registration failed',
        });
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);
        const result = await authService.login(data);

        res.status(200).json({
            success: true,
            data: result,
            message: 'Login successful',
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
            res.status(401).json({
                success: false,
                error: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Login failed',
        });
    }
});

export default router;

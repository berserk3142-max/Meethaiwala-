import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { prisma } from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

// Generate JWT token
export const generateToken = (userId: string): string => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });
};

// Verify JWT token
export const verifyToken = (token: string): { userId: string } | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
};

// Authentication middleware
export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.',
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token.',
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true },
        });

        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User not found.',
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Authentication error.',
        });
    }
};

// Admin-only middleware
export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user || req.user.role !== 'ADMIN') {
        res.status(403).json({
            success: false,
            error: 'Access denied. Admin privileges required.',
        });
        return;
    }
    next();
};

import { Request } from 'express';

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Auth response types
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    };
    token: string;
}

// Sweet response type (matches Prisma model)
export interface SweetResponse {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Pagination response
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

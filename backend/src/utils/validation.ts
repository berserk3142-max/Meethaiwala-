import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().optional(),
});

// User login schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Sweet creation schema
export const createSweetSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.number().positive('Price must be positive'),
    quantity: z.number().int().min(0, 'Quantity cannot be negative').default(0),
    description: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

// Sweet update schema
export const updateSweetSchema = createSweetSchema.partial();

// Sweet search schema
export const searchSweetSchema = z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
});

// Purchase schema
export const purchaseSchema = z.object({
    quantity: z.number().int().positive('Quantity must be positive').default(1),
});

// Restock schema
export const restockSchema = z.object({
    quantity: z.number().int().positive('Quantity must be positive'),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSweetInput = z.infer<typeof createSweetSchema>;
export type UpdateSweetInput = z.infer<typeof updateSweetSchema>;
export type SearchSweetInput = z.infer<typeof searchSweetSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type RestockInput = z.infer<typeof restockSchema>;

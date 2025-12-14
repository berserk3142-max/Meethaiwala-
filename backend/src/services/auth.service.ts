import bcrypt from 'bcryptjs';
import { prisma } from '../utils/db';
import { RegisterInput, LoginInput } from '../utils/validation';
import { generateToken } from '../middleware/auth';
import { AuthResponse } from '../types';

export class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterInput): Promise<AuthResponse> {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
            },
        });

        // Generate token
        const token = generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }

    /**
     * Login user
     */
    async login(data: LoginInput): Promise<AuthResponse> {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(data.password, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }
}

export const authService = new AuthService();

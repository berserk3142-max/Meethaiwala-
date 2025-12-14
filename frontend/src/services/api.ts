import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authApi = {
    register: async (email: string, password: string, name?: string) => {
        const response = await api.post('/auth/register', { email, password, name });
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
};

// Sweets API
export const sweetsApi = {
    getAll: async () => {
        const response = await api.get('/sweets');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/sweets/${id}`);
        return response.data;
    },
    search: async (params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) => {
        const response = await api.get('/sweets/search', { params });
        return response.data;
    },
    create: async (data: { name: string; category: string; price: number; quantity: number; description?: string; imageUrl?: string }) => {
        const response = await api.post('/sweets', data);
        return response.data;
    },
    update: async (id: string, data: Partial<{ name: string; category: string; price: number; quantity: number; description?: string; imageUrl?: string }>) => {
        const response = await api.put(`/sweets/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/sweets/${id}`);
        return response.data;
    },
    purchase: async (id: string, quantity: number = 1) => {
        const response = await api.post(`/sweets/${id}/purchase`, { quantity });
        return response.data;
    },
    restock: async (id: string, quantity: number) => {
        const response = await api.post(`/sweets/${id}/restock`, { quantity });
        return response.data;
    },
};

export default api;

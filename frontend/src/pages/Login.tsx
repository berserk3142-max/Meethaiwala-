import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authApi.login(email, password);
            if (response.success) {
                login(response.data.user, response.data.token);
                toast.success('Welcome back!', { icon: '🍬' });
                navigate('/shop');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--color-off-white)',
        }}>
            <motion.div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '3rem',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>
                            Sweet<span style={{ color: 'var(--color-primary)' }}>ify</span>
                        </h1>
                    </Link>
                    <p style={{ color: 'var(--color-gray-500)', marginTop: '0.5rem' }}>
                        Welcome back! Please login to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className="btn btn-candy"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-gray-500)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        Sign up
                    </Link>
                </p>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'var(--color-gray-100)',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Demo Credentials:</p>
                    <p>Admin: admin@sweetify.com / admin123</p>
                </div>
            </motion.div>
        </div>
    );
}


import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSweets } from '../context/SweetsContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { cartCount } = useSweets();
    const { isAuthenticated, logout, isAdmin } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: '1.25rem 2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            }}
        >
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link
                    to="/"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: '#1A1A1A',
                        textDecoration: 'none',
                        letterSpacing: '-0.03em',
                        textTransform: 'uppercase',
                    }}
                >
                    Sweetify
                </Link>

                {/* Navigation Links */}
                <ul style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5rem',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                }}>
                    {[
                        { path: '/', label: 'Home' },
                        { path: '/shop', label: 'Shop' },

                        { path: '/contact', label: 'Contact' },
                    ].map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: isActive(item.path) ? '#E91E8C' : '#64748B',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.color = '#1A1A1A';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.color = '#64748B';
                                    }
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    {isAdmin && (
                        <li>
                            <Link
                                to="/admin"
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: isActive('/admin') ? '#E91E8C' : '#64748B',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Admin
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Cart Icon */}
                    <Link
                        to="/cart"
                        style={{
                            position: 'relative',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1A1A1A',
                            textDecoration: 'none',
                            transition: 'background 0.3s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#E2E8F0';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#F1F5F9';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: '#E91E8C',
                                color: '#FFFFFF',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth */}
                    {isAuthenticated ? (
                        <motion.button
                            onClick={logout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'transparent',
                                border: '2px solid #1A1A1A',
                                color: '#1A1A1A',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '100px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#1A1A1A';
                                e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#1A1A1A';
                            }}
                        >
                            Logout
                        </motion.button>
                    ) : (
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: '#E91E8C',
                                    border: 'none',
                                    color: '#FFFFFF',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '100px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Login
                            </motion.button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}

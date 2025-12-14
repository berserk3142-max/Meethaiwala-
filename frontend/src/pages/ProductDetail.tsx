import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSweets } from '../context/SweetsContext';
import type { Sweet } from '../types';
import { useAuth } from '../context/AuthContext';
import { sweetsApi } from '../services/api';
import toast from 'react-hot-toast';

// Pastel colors for backgrounds
const PASTEL_COLORS = ['#FFE4EC', '#FFF5E6', '#E0F4FF', '#E8FFF0', '#F3E8FF'];

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { sweets, addToCart } = useSweets();
    const { isAuthenticated } = useAuth();
    const [sweet, setSweet] = useState<Sweet | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const found = sweets.find((s) => s.id === id);
        if (found) {
            setSweet(found);
            setIsLoading(false);
        } else if (isAuthenticated && id) {
            fetchSweet();
        } else {
            setIsLoading(false);
        }
    }, [id, sweets, isAuthenticated]);

    const fetchSweet = async () => {
        try {
            const response = await sweetsApi.getById(id!);
            if (response.success) {
                setSweet(response.data);
            }
        } catch (error) {
            toast.error('Product not found');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!sweet || sweet.quantity === 0) return;
        addToCart(sweet, quantity);
        toast.success(`${quantity}x ${sweet.name} added to cart!`, {
            icon: '🛒',
            style: { borderRadius: '16px', background: '#1A1A1A', color: '#fff' },
        });
    };

    const getEmoji = (category: string) => {
        switch (category) {
            case 'Bengali Sweets': return '🍮';
            case 'Barfi': return '🍬';
            case 'Crispy Sweets': return '🍩';
            case 'Milk Sweets': return '🥛';
            case 'Fried Sweets': return '🧁';
            case 'Traditional': return '🪔';
            default: return '🍬';
        }
    };

    if (isLoading) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#F8FAFC' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', paddingTop: '2rem' }}>
                        <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '24px' }} />
                        <div>
                            <div className="skeleton" style={{ height: '3rem', marginBottom: '1rem', borderRadius: '8px' }} />
                            <div className="skeleton" style={{ height: '1.5rem', width: '60%', borderRadius: '8px' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!sweet) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#F8FAFC' }}>
                <div className="container text-center" style={{ padding: '4rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍬</div>
                    <h2>Product not found</h2>
                    <button className="btn btn-primary mt-4" onClick={() => navigate('/shop')}>
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const bgColor = PASTEL_COLORS[parseInt(sweet.id) % PASTEL_COLORS.length];

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#F8FAFC' }}>
            <div className="container">
                <motion.div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '4rem',
                        alignItems: 'start',
                        paddingTop: '2rem',
                        paddingBottom: '4rem',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Product Image */}
                    <motion.div
                        style={{
                            aspectRatio: '1',
                            borderRadius: '24px',
                            background: bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Heart Button */}
                        <motion.button
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                width: '48px',
                                height: '48px',
                                background: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                color: isLiked ? '#E91E8C' : '#94A3B8',
                            }}
                            onClick={() => setIsLiked(!isLiked)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </motion.button>

                        <motion.span
                            style={{ fontSize: '12rem' }}
                            animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {getEmoji(sweet.category)}
                        </motion.span>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em',
                        }}>
                            {sweet.name}
                        </h1>

                        <p style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#1E293B',
                            marginBottom: '1.5rem',
                        }}>
                            ₹{sweet.price.toFixed(0)}
                        </p>

                        <p style={{
                            color: '#64748B',
                            marginBottom: '2rem',
                            lineHeight: 1.8,
                            fontSize: '0.95rem',
                        }}>
                            {sweet.description || `My toussoul á basamen has about country fixbambalfs even is enxist curary on ortheoveagh b its nova fiamaina, fáb on an inomsonías elevate adornments su always of courty in comunly of this parents.`}
                        </p>

                        {/* Quantity Selector */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.75rem',
                                fontWeight: 600,
                                fontSize: '1rem',
                            }}>
                                Quantity
                            </label>
                            <div className="quantity-selector">
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
                                    disabled={quantity >= sweet.quantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                            className="btn btn-candy"
                            style={{
                                width: '100%',
                                marginBottom: '2rem',
                                padding: '1rem 2rem',
                            }}
                            onClick={handleAddToCart}
                            disabled={sweet.quantity === 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {sweet.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </motion.button>

                        {/* Reviews Section */}
                        <div style={{
                            borderTop: '1px solid #E2E8F0',
                            paddingTop: '1.5rem',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.75rem',
                            }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Reviews</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#FFC107', fontSize: '0.875rem' }}>★★★★☆</span>
                                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>4.0</span>
                                <span style={{ color: '#64748B', fontSize: '0.875rem' }}>• 11 reviews</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

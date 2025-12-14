import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSweets } from '../context/SweetsContext';
import type { Sweet } from '../types';
import toast from 'react-hot-toast';

interface SweetCardProps {
    sweet: Sweet;
    onAddToCart?: (sweet: Sweet) => void;
}

export default function SweetCard({ sweet, onAddToCart }: SweetCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useSweets();

    const isOutOfStock = sweet.quantity === 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isOutOfStock) return;

        addToCart(sweet, 1);
        toast.success(`${sweet.name} added to cart!`, {
            icon: '🍬',
            style: {
                borderRadius: '16px',
                background: '#1A1A1A',
                color: '#fff',
            },
        });

        if (onAddToCart) {
            onAddToCart(sweet);
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleCardClick = () => {
        navigate(`/product/${sweet.id}`);
    };

    // Generate a placeholder gradient based on category (Indian Sweets)
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Bengali Sweets': 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
            'Barfi': 'linear-gradient(135deg, #FFE5E5 0%, #FFC0CB 100%)',
            'Crispy Sweets': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            'Milk Sweets': 'linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%)',
            'Fried Sweets': 'linear-gradient(135deg, #DEB887 0%, #D2691E 100%)',
            'Traditional': 'linear-gradient(135deg, #FFE4B5 0%, #FFDAB9 100%)',
        };
        return colors[category] || 'linear-gradient(135deg, #E91E8C 0%, #FF6B35 100%)';
    };

    return (
        <motion.div
            className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {sweet.category && (
                <span className="product-card-badge">{sweet.category}</span>
            )}

            <button
                className="product-card-heart"
                onClick={handleLike}
                aria-label="Add to favorites"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isLiked ? '#E91E8C' : 'none'}
                    stroke={isLiked ? '#E91E8C' : 'currentColor'}
                    strokeWidth="2"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            </button>

            <div
                className="product-card-image"
                style={{
                    background: sweet.imageUrl ? `url(${sweet.imageUrl}) center/contain no-repeat` : getCategoryColor(sweet.category),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {!sweet.imageUrl && (
                    <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                        {sweet.category === 'Bengali Sweets' ? '🍮' :
                            sweet.category === 'Barfi' ? '🍬' :
                                sweet.category === 'Milk Sweets' ? '🥛' : '🍬'}
                    </span>
                )}
            </div>

            <div className="product-card-body">
                <h3 className="product-card-name">{sweet.name}</h3>

                <div className="product-card-rating">
                    <span className="product-card-stars">★★★★★</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                        ({Math.floor(Math.random() * 50) + 10})
                    </span>
                </div>

                <div className="product-card-price">₹{sweet.price.toFixed(0)}</div>

                <div className="product-card-actions">
                    {isOutOfStock ? (
                        <span className="out-of-stock-badge">Sold Out</span>
                    ) : (
                        <motion.button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={handleAddToCart}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            Add to Cart
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

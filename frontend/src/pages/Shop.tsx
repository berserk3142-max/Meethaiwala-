import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSweets } from '../context/SweetsContext';
import type { Sweet } from '../types';

import { sweetsApi } from '../services/api';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const PASTEL_COLORS = ['#FFE4EC', '#E0F4FF', '#FFF5E6', '#E8FFF0', '#F3E8FF', '#E0FFF4'];

export default function Shop() {
    const { sweets, dispatch, searchQuery, isLoading } = useSweets();
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const navigate = useNavigate();
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSweets();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                const elements = headerRef.current.querySelectorAll('.animate-in');
                gsap.fromTo(elements,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
                );
            }

            if (gridRef.current && !isLoading) {
                const cards = gridRef.current.querySelectorAll('.product-card');
                gsap.fromTo(cards,
                    { opacity: 0, y: 80, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 85%',
                        },
                    }
                );
            }
        });

        return () => ctx.revert();
    }, [sweets, isLoading]);

    const fetchSweets = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });

        const sampleSweets: Sweet[] = [
            { id: '1', name: 'Gujiya', category: 'Traditional', price: 450, quantity: 50, description: 'Crispy fried pastry filled with sweet khoya & dry fruits', imageUrl: '/gujiya.jpg', createdAt: '', updatedAt: '' },
            { id: '2', name: 'Premium Barfi Mix', category: 'Barfi', price: 650, quantity: 45, description: 'Assorted barfi with silver vark & pistachios', imageUrl: '/barfi-mix.jpg', createdAt: '', updatedAt: '' },
            { id: '3', name: 'Fresh Jalebi', category: 'Traditional', price: 280, quantity: 60, description: 'Crispy golden spirals soaked in sugar syrup', imageUrl: '/jalebi.jpg', createdAt: '', updatedAt: '' },
            { id: '4', name: 'Laddu Collection', category: 'Laddu', price: 520, quantity: 40, description: 'Assorted laddus - Besan, Motichoor, Coconut & more', imageUrl: '/laddu-collection.jpg', createdAt: '', updatedAt: '' },
            { id: '5', name: 'Balushahi', category: 'Traditional', price: 380, quantity: 35, description: 'Flaky sweet delicacy dipped in sugar syrup', imageUrl: '/balushahi.jpg', createdAt: '', updatedAt: '' },
            { id: '6', name: 'Kaju Katli', category: 'Premium', price: 850, quantity: 25, description: 'Diamond-shaped cashew fudge with silver foil', imageUrl: '/kaju-katli-3d.png', createdAt: '', updatedAt: '' },
            { id: '7', name: 'Gulab Jamun', category: 'Traditional', price: 320, quantity: 55, description: 'Soft milk dumplings in rose-flavored syrup', imageUrl: '/gulab-jamun-3d.png', createdAt: '', updatedAt: '' },
            { id: '8', name: 'Rasgulla', category: 'Bengali', price: 350, quantity: 50, description: 'Spongy cottage cheese balls in light syrup', imageUrl: '/rasgulla-3d.png', createdAt: '', updatedAt: '' },
        ];

        try {
            // Always try to fetch from API first
            const response = await sweetsApi.getAll();
            if (response.success && response.data && response.data.length > 0) {
                dispatch({ type: 'SET_SWEETS', payload: response.data });
            } else {
                // API returned empty, use sample data
                dispatch({ type: 'SET_SWEETS', payload: sampleSweets });
            }
        } catch (error) {
            console.error('Failed to fetch sweets:', error);
            // On error, fall back to sample sweets
            dispatch({ type: 'SET_SWEETS', payload: sampleSweets });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SET_SEARCH_QUERY', payload: localSearchQuery });
    };

    const filteredSweets = sweets.filter((sweet) =>
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (sweet: Sweet, e: React.MouseEvent) => {
        e.stopPropagation();
        if (sweet.quantity === 0) return;
        dispatch({ type: 'ADD_TO_CART', payload: { sweet, quantity: 1 } });
        toast.success(`${sweet.name} added to cart!`, {
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

    const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const image = card.querySelector('.card-emoji');
        const content = card.querySelector('.card-content');

        gsap.to(card, {
            scale: 1.03,
            y: -15,
            boxShadow: '0 30px 60px rgba(233, 30, 140, 0.15)',
            duration: 0.4,
            ease: 'power2.out',
        });

        if (image) {
            gsap.to(image, { scale: 1.15, duration: 0.5, ease: 'power2.out' });
        }

        if (content) {
            gsap.to(content, { y: -5, duration: 0.3, ease: 'power2.out' });
        }
    };

    const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const image = card.querySelector('.card-emoji');
        const content = card.querySelector('.card-content');

        gsap.to(card, {
            scale: 1,
            y: 0,
            boxShadow: 'none',
            duration: 0.4,
            ease: 'power2.out',
        });

        if (image) {
            gsap.to(image, { scale: 1, duration: 0.5, ease: 'power2.out' });
        }

        if (content) {
            gsap.to(content, { y: 0, duration: 0.3, ease: 'power2.out' });
        }
    };

    return (
        <div style={{
            paddingTop: '120px',
            minHeight: '100vh',
            background: '#FFFFFF',
            color: '#1A1A1A',
        }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                {/* Header */}
                <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span
                        className="animate-in"
                        style={{
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3em',
                            color: '#64748B',
                        }}
                    >
                        Our Collection
                    </span>
                    <h1
                        className="animate-in"
                        style={{
                            fontSize: 'clamp(4rem, 15vw, 10rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            marginTop: '1rem',
                            marginBottom: '3rem',
                            color: '#1A1A1A',
                        }}
                    >
                        SHOP
                    </h1>

                    {/* Search Bar */}
                    <form
                        className="animate-in"
                        onSubmit={handleSearch}
                        style={{
                            display: 'flex',
                            maxWidth: '550px',
                            margin: '0 auto',
                            background: '#F8FAFC',
                            borderRadius: '100px',
                            padding: '0.5rem',
                            border: '1px solid #E2E8F0',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search candies..."
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                padding: '1rem 1.5rem',
                                fontSize: '1rem',
                                background: 'transparent',
                                color: '#1A1A1A',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: '#E91E8C',
                                color: 'white',
                                border: 'none',
                                borderRadius: '100px',
                                padding: '1rem 2.5rem',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, background 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '2rem',
                    }}>
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    height: '450px',
                                    borderRadius: '28px',
                                    background: '#F1F5F9',
                                    animation: 'pulse 2s infinite',
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        ref={gridRef}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '2rem',
                            paddingBottom: '6rem',
                        }}
                    >
                        {filteredSweets.map((sweet, index) => (
                            <div
                                key={sweet.id}
                                className="product-card"
                                style={{
                                    borderRadius: '28px',
                                    overflow: 'hidden',
                                    background: PASTEL_COLORS[index % PASTEL_COLORS.length],
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.4s ease',
                                }}
                                onClick={() => navigate(`/product/${sweet.id}`)}
                                onMouseEnter={handleCardHover}
                                onMouseLeave={handleCardLeave}
                            >
                                {/* Image Area */}
                                <div
                                    style={{
                                        height: '280px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Heart Button */}
                                    <button
                                        style={{
                                            position: 'absolute',
                                            top: '1.25rem',
                                            right: '1.25rem',
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.9)',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            zIndex: 2,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.2s, background 0.2s',
                                        }}
                                        onClick={(e) => { e.stopPropagation(); }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>

                                    {sweet.imageUrl ? (
                                        <img
                                            className="card-emoji"
                                            src={sweet.imageUrl}
                                            alt={sweet.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="card-emoji"
                                            style={{
                                                fontSize: '8rem',
                                                filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.15))',
                                                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            }}
                                        >
                                            {getEmoji(sweet.category)}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div
                                    className="card-content"
                                    style={{
                                        padding: '2rem',
                                        background: 'rgba(255,255,255,0.6)',
                                        borderTop: '1px solid rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            color: '#64748B',
                                            fontWeight: 500,
                                        }}>
                                            {sweet.category}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        marginBottom: '1.25rem',
                                        letterSpacing: '-0.02em',
                                        color: '#1A1A1A',
                                    }}>
                                        {sweet.name}
                                    </h3>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                        <span style={{
                                            fontSize: '1.75rem',
                                            fontWeight: 800,
                                            color: '#E91E8C',
                                        }}>
                                            ₹{sweet.price.toFixed(0)}
                                        </span>

                                        {sweet.quantity === 0 ? (
                                            <span style={{
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '100px',
                                                background: '#E2E8F0',
                                                color: '#64748B',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                            }}>
                                                Sold Out
                                            </span>
                                        ) : (
                                            <button
                                                onClick={(e) => handleAddToCart(sweet, e)}
                                                style={{
                                                    padding: '0.9rem 1.75rem',
                                                    borderRadius: '100px',
                                                    background: '#1A1A1A',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s, background 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                    e.currentTarget.style.background = '#E91E8C';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.background = '#1A1A1A';
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredSweets.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '8rem 2rem',
                        color: '#64748B',
                    }}>
                        <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>🍬</div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                            No sweets found
                        </h3>
                        <p style={{ fontSize: '1.1rem' }}>Try adjusting your search</p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}

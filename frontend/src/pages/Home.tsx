import React, { useEffect, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '../hooks/useLenis';

const FloatingSweets3D = React.lazy(() => import('../components/FloatingSweets3D'));

gsap.registerPlugin(ScrollTrigger);

// Premium Sweet Card with hover effects
function SweetCard({
    title,
    image,
    category,
    price,
    index,
}: {
    title: string;
    image: string;
    category: string;
    price: string;
    index: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;

        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 80, scale: 0.9 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, []);

    const handleMouseEnter = () => {
        if (!cardRef.current || !imageRef.current) return;
        gsap.to(cardRef.current, {
            scale: 1.05,
            y: -15,
            boxShadow: '0 40px 80px rgba(255, 140, 0, 0.25)',
            duration: 0.5,
            ease: 'power3.out',
        });
        gsap.to(imageRef.current, {
            scale: 1.15,
            duration: 0.6,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current || !imageRef.current) return;
        gsap.to(cardRef.current, {
            scale: 1,
            y: 0,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            duration: 0.5,
            ease: 'power3.out',
        });
        gsap.to(imageRef.current, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
        });
    };

    const gradients = [
        'linear-gradient(145deg, #FFF8E7 0%, #FFE4B5 100%)',
        'linear-gradient(145deg, #FFF5EE 0%, #FFDAB9 100%)',
        'linear-gradient(145deg, #FFFAF0 0%, #FFE4C4 100%)',
        'linear-gradient(145deg, #FFF8DC 0%, #F5DEB3 100%)',
    ];

    return (
        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
                ref={cardRef}
                style={{
                    background: gradients[index % gradients.length],
                    borderRadius: '32px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                    transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Image Area */}
                <div
                    style={{
                        height: '280px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                    }}
                >
                    <img
                        ref={imageRef}
                        src={image}
                        alt={title}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
                        }}
                    />
                </div>

                {/* Content */}
                <div
                    style={{
                        padding: '2rem 2.5rem',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <span style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: '#C4870C',
                        fontWeight: 600,
                    }}>
                        {category}
                    </span>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginTop: '0.5rem',
                        letterSpacing: '-0.02em',
                    }}>
                        {title}
                    </h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1rem',
                    }}>
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #FF8C00, #E91E8C)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {price}
                        </span>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#64748B',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                        }}>
                            Shop Now
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Animated statistic counter
function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!ref.current || hasAnimated.current) return;

        ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 80%',
            onEnter: () => {
                if (hasAnimated.current) return;
                hasAnimated.current = true;
                gsap.to(ref.current, {
                    innerText: value,
                    duration: 2.5,
                    snap: { innerText: 1 },
                    ease: 'power2.out',
                });
            },
        });
    }, [value]);

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                <span
                    ref={ref}
                    style={{
                        fontSize: 'clamp(4rem, 12vw, 7rem)',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #1A1A1A 0%, #64748B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.05em',
                    }}
                >
                    0
                </span>
                <span style={{
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FF8C00, #E91E8C)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {suffix}
                </span>
            </div>
            <p style={{
                fontSize: '1rem',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                marginTop: '0.5rem',
                fontWeight: 500,
            }}>
                {label}
            </p>
        </div>
    );
}

// Feature card component
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top 85%',
                },
            }
        );
    }, []);

    return (
        <div
            ref={cardRef}
            style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #FFF8E7 100%)',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 140, 0, 0.1)',
            }}
        >
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>{icon}</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                {title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.7 }}>
                {description}
            </p>
        </div>
    );
}

export default function Home() {
    useLenis();

    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const magneticBtn = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero title animation
            if (titleRef.current) {
                const chars = titleRef.current.querySelectorAll('.char');
                gsap.fromTo(chars,
                    { opacity: 0, y: 120, rotateX: -90, scale: 0.5 },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        scale: 1,
                        duration: 1.4,
                        stagger: 0.06,
                        ease: 'power4.out',
                    }
                );

                // Parallax scroll effect
                gsap.to(titleRef.current, {
                    yPercent: -30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5,
                    },
                });
            }

            // Subtitle fade in
            if (subtitleRef.current) {
                gsap.fromTo(subtitleRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    // Magnetic button effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = magneticBtn.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(magneticBtn.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
    };

    const sweets = [
        { title: 'Gujiya', image: '/gujiya.jpg', category: 'Traditional', price: '₹450' },
        { title: 'Premium Barfi Mix', image: '/barfi-mix.jpg', category: 'Festive Special', price: '₹650' },
        { title: 'Fresh Jalebi', image: '/jalebi.jpg', category: 'Traditional', price: '₹280' },
        { title: 'Laddu Collection', image: '/laddu-collection.jpg', category: 'Traditional', price: '₹520' },
    ];

    return (
        <div style={{ background: '#FFFAF5', minHeight: '100vh', color: '#1A1A1A' }}>
            {/* Hero Section */}
            <section
                ref={heroRef}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '140px 2rem 6rem',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, #FFF8E7 0%, #FFFAF5 50%, #FFF5EE 100%)',
                }}
            >
                {/* 3D Floating Sweets Background */}
                <Suspense fallback={null}>
                    <FloatingSweets3D />
                </Suspense>

                {/* Decorative gradient orbs */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,140,0,0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Premium Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'linear-gradient(135deg, rgba(255,140,0,0.15) 0%, rgba(233,30,140,0.1) 100%)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '100px',
                        marginBottom: '2.5rem',
                        border: '1px solid rgba(255,140,0,0.2)',
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>🍬</span>
                        <span style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            background: 'linear-gradient(135deg, #FF8C00, #E91E8C)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            AUTHENTIC INDIAN SWEETS
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1
                        ref={titleRef}
                        style={{
                            fontSize: 'clamp(4rem, 18vw, 14rem)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            lineHeight: 0.85,
                            letterSpacing: '-0.06em',
                            marginBottom: '2rem',
                        }}
                    >
                        <span className="char" style={{ display: 'inline-block', color: '#1A1A1A' }}>S</span>
                        <span className="char" style={{ display: 'inline-block', color: '#1A1A1A' }}>W</span>
                        <span className="char" style={{ display: 'inline-block', color: '#1A1A1A' }}>E</span>
                        <span className="char" style={{ display: 'inline-block', color: '#1A1A1A' }}>E</span>
                        <span className="char" style={{ display: 'inline-block', color: '#1A1A1A' }}>T</span>
                        <span className="char" style={{ display: 'inline-block', color: '#FF8C00' }}>I</span>
                        <span className="char" style={{ display: 'inline-block', color: '#E91E8C' }}>F</span>
                        <span className="char" style={{ display: 'inline-block', color: '#C4870C' }}>Y</span>
                    </h1>


                    <Link to="/shop" style={{ display: 'inline-block' }}>
                        <button
                            ref={magneticBtn}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                background: 'linear-gradient(135deg, #FF8C00 0%, #E91E8C 100%)',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '1.75rem 5rem',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                borderRadius: '100px',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                boxShadow: '0 20px 50px rgba(255, 140, 0, 0.35)',
                                transition: 'box-shadow 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 25px 60px rgba(255, 140, 0, 0.45)';
                            }}
                        >
                            ✨ Explore Sweets
                        </button>
                    </Link>
                </div>

                {/* Scroll indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: 0.5,
                }}>
                    <div style={{
                        width: '32px',
                        height: '52px',
                        border: '2px solid rgba(0,0,0,0.25)',
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '10px',
                    }}>
                        <div style={{
                            width: '4px',
                            height: '12px',
                            background: 'linear-gradient(180deg, #FF8C00, #E91E8C)',
                            borderRadius: '2px',
                            animation: 'scrollMouse 2s infinite',
                        }} />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{
                padding: '8rem 2rem',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8E7 100%)',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4rem',
                }}>
                    <AnimatedStat value={50} suffix="K+" label="Happy Customers" />
                    <AnimatedStat value={100} suffix="+" label="Sweet Varieties" />
                    <AnimatedStat value={25} suffix="+" label="Years of Trust" />
                    <AnimatedStat value={5} suffix="★" label="Average Rating" />
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '6rem 2rem', background: '#FFFAF5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span style={{
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.25em',
                            color: '#C4870C',
                            fontWeight: 600,
                        }}>
                            Why Choose Us
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            marginTop: '1rem',
                            color: '#1A1A1A',
                        }}>
                            The <span style={{ color: '#FF8C00' }}>Sweetify</span> Promise
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                    }}>
                        <FeatureCard
                            icon="🏆"
                            title="Premium Quality"
                            description="Made with the finest ingredients, sourced from trusted suppliers across India."
                        />
                        <FeatureCard
                            icon="🎁"
                            title="Beautiful Packaging"
                            description="Elegant gift-ready packaging that makes every order feel special."
                        />
                        <FeatureCard
                            icon="🚀"
                            title="Fast Delivery"
                            description="Fresh sweets delivered to your doorstep within 24-48 hours."
                        />
                        <FeatureCard
                            icon="💯"
                            title="100% Authentic"
                            description="Traditional recipes passed down through generations of master sweet makers."
                        />
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section style={{ padding: '6rem 2rem', background: 'linear-gradient(180deg, #FFF8E7 0%, #FFFFFF 100%)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '4rem',
                        flexWrap: 'wrap',
                        gap: '2rem',
                    }}>
                        <div>
                            <span style={{
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.25em',
                                color: '#C4870C',
                                fontWeight: 600,
                            }}>
                                Featured Collection
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                marginTop: '0.75rem',
                                color: '#1A1A1A',
                            }}>
                                BEST SELLERS
                            </h2>
                        </div>
                        <Link to="/shop">
                            <button style={{
                                background: 'transparent',
                                border: '2px solid #1A1A1A',
                                color: '#1A1A1A',
                                padding: '1rem 2.5rem',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                letterSpacing: '0.05em',
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
                                View All Products →
                            </button>
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '2rem',
                    }}>
                        {sweets.map((sweet, index) => (
                            <SweetCard
                                key={sweet.title}
                                title={sweet.title}
                                image={sweet.image}
                                category={sweet.category}
                                price={sweet.price}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '10rem 2rem',
                textAlign: 'center',
                background: 'linear-gradient(180deg, #FFF8E7 0%, #FFE4B5 50%, #FFDAB9 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative elements */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    left: '-100px',
                    fontSize: '15rem',
                    opacity: 0.1,
                    transform: 'rotate(-15deg)',
                }}>🍬</div>
                <div style={{
                    position: 'absolute',
                    bottom: '-100px',
                    right: '-100px',
                    fontSize: '15rem',
                    opacity: 0.1,
                    transform: 'rotate(15deg)',
                }}>🍫</div>

                <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 9vw, 6rem)',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        letterSpacing: '-0.04em',
                        marginBottom: '2rem',
                        color: '#1A1A1A',
                    }}>
                        Ready to <span style={{
                            background: 'linear-gradient(135deg, #FF8C00, #E91E8C)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>Sweeten</span> Your Day?
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#64748B',
                        marginBottom: '3rem',
                        lineHeight: 1.8,
                    }}>
                        Join thousands of sweet lovers who trust Sweetify for their festive celebrations and everyday indulgences.
                    </p>
                    <Link to="/shop">
                        <button style={{
                            background: '#1A1A1A',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '1.75rem 5rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: '100px',
                            cursor: 'pointer',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                            }}
                        >
                            🛒 Start Shopping
                        </button>
                    </Link>
                </div>
            </section>

            <style>{`
                @keyframes scrollMouse {
                    0%, 100% { transform: translateY(0); opacity: 1; }
                    50% { transform: translateY(10px); opacity: 0.4; }
                }

                html.lenis, html.lenis body {
                    height: auto;
                }
            `}</style>
        </div>
    );
}

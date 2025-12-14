import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.", { icon: '💌' });
        setFormData({ name: '', phone: '', email: '', message: '' });
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#F8FAFC' }}>
            <div className="container">
                {/* Title */}
                <motion.h1
                    className="section-title"
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    CONTACT
                </motion.h1>

                {/* Floating Candies */}
                <motion.div
                    style={{ position: 'fixed', top: '120px', right: '5%', fontSize: '3rem', zIndex: 0 }}
                    animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    🍩
                </motion.div>
                <motion.div
                    style={{ position: 'fixed', bottom: '30%', left: '3%', fontSize: '2.5rem', zIndex: 0 }}
                    animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    🍬
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3rem',
                    maxWidth: '1000px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Map */}
                    <motion.div
                        style={{
                            borderRadius: '24px',
                            overflow: 'hidden',
                            background: '#E8F4F0',
                            minHeight: '400px',
                            position: 'relative',
                        }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Map Placeholder with Grid Pattern */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #E8F4F0 0%, #D4EDE8 100%)',
                            position: 'relative',
                        }}>
                            {/* Grid lines overlay */}
                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}>
                                <defs>
                                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#9CA3AF" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>

                            {/* Map Pin */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -100%)',
                                }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'linear-gradient(135deg, #E91E8C 0%, #FF69B4 100%)',
                                    borderRadius: '50% 50% 50% 0',
                                    transform: 'rotate(-45deg)',
                                    boxShadow: '0 4px 15px rgba(233, 30, 140, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <span style={{
                                        transform: 'rotate(45deg)',
                                        color: 'white',
                                        fontSize: '1.5rem'
                                    }}>📍</span>
                                </div>
                            </motion.div>

                            {/* Decorative roads */}
                            <div style={{
                                position: 'absolute',
                                top: '30%',
                                left: '10%',
                                width: '80%',
                                height: '2px',
                                background: '#F8D7A4',
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: '60%',
                                left: '20%',
                                width: '60%',
                                height: '2px',
                                background: '#F8D7A4',
                            }} />
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <textarea
                                    className="form-input"
                                    placeholder="Message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="btn btn-candy"
                                style={{ width: '100%' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Send
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

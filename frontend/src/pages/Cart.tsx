
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSweets } from '../context/SweetsContext';

export default function Cart() {
    const { cart, removeFromCart, cartTotal, dispatch } = useSweets();

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
        } else {
            dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container text-center" style={{ padding: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🛒</div>
                        <h2>Your cart is empty</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>
                            Looks like you haven't added any sweets yet!
                        </p>
                        <Link to="/shop" className="btn btn-candy">
                            Start Shopping
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="section-title">Your Cart</h1>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    {/* Cart Items */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {cart.map((item, index) => (
                            <motion.div
                                key={item.sweet.id}
                                style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    padding: '1.5rem',
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: 'var(--shadow-sm)',
                                    marginBottom: '1rem',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {/* Image */}
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(145deg, #FFF8E7 0%, #FFE4B5 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}>
                                    {item.sweet.imageUrl ? (
                                        <img
                                            src={item.sweet.imageUrl}
                                            alt={item.sweet.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '3rem' }}>
                                            {item.sweet.category === 'Gummies' ? '🍬' :
                                                item.sweet.category === 'Chocolate' ? '🍫' :
                                                    item.sweet.category === 'Sour Candies' ? '🍭' : '🍩'}
                                        </span>
                                    )}
                                </div>

                                {/* Details */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                                        {item.sweet.name}
                                    </h3>
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                                        {item.sweet.category}
                                    </p>
                                    <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.5rem' }}>
                                        ₹{item.sweet.price.toFixed(0)}
                                    </p>
                                </div>

                                {/* Quantity & Remove */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <div className="quantity-selector">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-error)',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                        }}
                                        onClick={() => removeFromCart(item.sweet.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '2rem',
                            boxShadow: 'var(--shadow-lg)',
                            height: 'fit-content',
                            position: 'sticky',
                            top: '100px',
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h3>

                        <div style={{ borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            {cart.map((item) => (
                                <div key={item.sweet.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--color-gray-600)' }}>
                                        {item.sweet.name} x {item.quantity}
                                    </span>
                                    <span>₹{(item.sweet.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(0)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span>Shipping</span>
                            <span style={{ color: 'var(--color-success)' }}>Free</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            borderTop: '2px solid var(--color-gray-200)',
                            paddingTop: '1rem',
                            marginBottom: '1.5rem',
                        }}>
                            <span>Total</span>
                            <span>₹{cartTotal.toFixed(0)}</span>
                        </div>

                        <button className="btn btn-candy" style={{ width: '100%' }}>
                            Checkout
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

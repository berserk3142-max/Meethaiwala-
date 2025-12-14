
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Company Links */}
                <div>
                    <h4 className="footer-title">Company</h4>
                    <ul className="footer-links">
                        <li><Link to="/" className="footer-link">Home</Link></li>
                        <li><Link to="/shop" className="footer-link">Shop</Link></li>
                        <li><Link to="/contact" className="footer-link">Contact</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h4 className="footer-title">Support</h4>
                    <ul className="footer-links">
                        <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                        <li><Link to="/shop" className="footer-link">FAQs</Link></li>
                        <li><Link to="/contact" className="footer-link">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Spacer */}
                <div></div>

                {/* Newsletter */}
                <div>
                    <h4 className="footer-title">Newsletter</h4>
                    <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Search ."
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                        </motion.button>
                    </form>
                </div>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                <span>Sweetify @ business.com</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <motion.a
                        href="#"
                        style={{ color: '#64748B' }}
                        whileHover={{ color: '#E91E8C' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </motion.a>
                </div>
            </div>
        </footer>
    );
}

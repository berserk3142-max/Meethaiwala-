
import { motion } from 'framer-motion';

export default function Blog() {
    const posts = [
        {
            id: 1,
            title: 'The Secret Behind Our Gummy Bears',
            excerpt: 'Discover how we craft the perfect tangy-sweet balance in every bear.',
            date: 'Dec 10, 2024',
            image: '🍬',
        },
        {
            id: 2,
            title: 'Chocolate: From Bean to Bar',
            excerpt: 'Follow the journey of our premium chocolate from source to shelf.',
            date: 'Dec 5, 2024',
            image: '🍫',
        },
        {
            id: 3,
            title: 'Holiday Sweet Gift Ideas',
            excerpt: 'The perfect candy gift boxes for your loved ones this season.',
            date: 'Dec 1, 2024',
            image: '🎁',
        },
    ];

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="section-title">Blog</h1>
                    <p className="section-subtitle">Sweet stories and candy adventures</p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-md)',
                                cursor: 'pointer',
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, boxShadow: 'var(--shadow-xl)' }}
                        >
                            <div style={{
                                height: '200px',
                                background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '5rem',
                            }}>
                                {post.image}
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--color-gray-500)',
                                    marginBottom: '0.5rem',
                                }}>
                                    {post.date}
                                </p>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem',
                                }}>
                                    {post.title}
                                </h3>
                                <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                                    {post.excerpt}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}

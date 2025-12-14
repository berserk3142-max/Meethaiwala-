import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSweets } from '../context/SweetsContext';
import type { Sweet } from '../types';
import { useAuth } from '../context/AuthContext';
import { sweetsApi } from '../services/api';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const CATEGORIES = ['Gummies', 'Chocolate', 'Sour Candies', 'Specialty'];

export default function Admin() {
    const { isAdmin, isAuthenticated } = useAuth();
    const { sweets, dispatch } = useSweets();
    const [isAddingSweet, setIsAddingSweet] = useState(false);
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: CATEGORIES[0],
        price: '',
        quantity: '',
        description: '',
        imageUrl: '',
    });

    // Redirect if not admin
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container text-center" style={{ padding: '4rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                    <h2>Admin Access Required</h2>
                    <p className="text-muted">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    const resetForm = () => {
        setFormData({
            name: '',
            category: CATEGORIES[0],
            price: '',
            quantity: '',
            description: '',
            imageUrl: '',
        });
        setIsAddingSweet(false);
        setEditingSweet(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sweetData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            description: formData.description,
            imageUrl: formData.imageUrl,
        };

        try {
            if (editingSweet) {
                const response = await sweetsApi.update(editingSweet.id, sweetData);
                if (response.success) {
                    dispatch({ type: 'UPDATE_SWEET', payload: response.data });
                    toast.success('Sweet updated!');
                    resetForm();
                }
            } else {
                const response = await sweetsApi.create(sweetData);
                if (response.success) {
                    dispatch({ type: 'ADD_SWEET', payload: response.data });
                    toast.success('Sweet added!');
                    resetForm();
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (sweet: Sweet) => {
        setEditingSweet(sweet);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price.toString(),
            quantity: sweet.quantity.toString(),
            description: sweet.description || '',
            imageUrl: sweet.imageUrl || '',
        });
        setIsAddingSweet(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sweet?')) return;

        try {
            const response = await sweetsApi.delete(id);
            if (response.success) {
                dispatch({ type: 'DELETE_SWEET', payload: id });
                toast.success('Sweet deleted!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Delete failed');
        }
    };

    const handleRestock = async (id: string) => {
        const quantity = prompt('Enter quantity to add:');
        if (!quantity || isNaN(parseInt(quantity))) return;

        try {
            const response = await sweetsApi.restock(id, parseInt(quantity));
            if (response.success) {
                dispatch({ type: 'UPDATE_SWEET', payload: response.data });
                toast.success('Restocked successfully!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Restock failed');
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="section-title">Admin Dashboard</h1>
                </motion.div>

                {/* Add/Edit Form */}
                {isAddingSweet ? (
                    <motion.div
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto 3rem',
                            padding: '2rem',
                            background: 'white',
                            borderRadius: '24px',
                            boxShadow: 'var(--shadow-lg)',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 style={{ marginBottom: '1.5rem' }}>
                            {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingSweet ? 'Update' : 'Add'} Sweet
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <button
                            className="btn btn-candy"
                            onClick={() => setIsAddingSweet(true)}
                        >
                            + Add New Sweet
                        </button>
                    </div>
                )}

                {/* Sweets Table */}
                <motion.div
                    style={{
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow-lg)',
                        overflow: 'hidden',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-gray-100)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Stock</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sweets.map((sweet) => (
                                <tr key={sweet.id} style={{ borderTop: '1px solid var(--color-gray-200)' }}>
                                    <td style={{ padding: '1rem' }}>{sweet.name}</td>
                                    <td style={{ padding: '1rem' }}>{sweet.category}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>${sweet.price.toFixed(2)}</td>
                                    <td style={{
                                        padding: '1rem',
                                        textAlign: 'right',
                                        color: sweet.quantity === 0 ? 'var(--color-error)' : 'inherit',
                                    }}>
                                        {sweet.quantity}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleRestock(sweet.id)}
                                                title="Restock"
                                            >
                                                📦
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleEdit(sweet)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{ background: 'var(--color-error)', color: 'white' }}
                                                onClick={() => handleDelete(sweet.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {sweets.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                            No sweets yet. Add your first one!
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

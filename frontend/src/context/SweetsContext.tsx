import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Sweet, CartItem } from '../types';

// Re-export types for convenience
export type { Sweet, CartItem } from '../types';

interface SweetsState {
    sweets: Sweet[];
    cart: CartItem[];
    isLoading: boolean;
    searchQuery: string;
    selectedCategory: string;
}

type SweetsAction =
    | { type: 'SET_SWEETS'; payload: Sweet[] }
    | { type: 'ADD_SWEET'; payload: Sweet }
    | { type: 'UPDATE_SWEET'; payload: Sweet }
    | { type: 'DELETE_SWEET'; payload: string }
    | { type: 'ADD_TO_CART'; payload: { sweet: Sweet; quantity: number } }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_CATEGORY'; payload: string };

interface SweetsContextType extends SweetsState {
    dispatch: React.Dispatch<SweetsAction>;
    addToCart: (sweet: Sweet, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    cartTotal: number;
    cartCount: number;
}

const initialState: SweetsState = {
    sweets: [],
    cart: [],
    isLoading: false,
    searchQuery: '',
    selectedCategory: 'All',
};

function sweetsReducer(state: SweetsState, action: SweetsAction): SweetsState {
    switch (action.type) {
        case 'SET_SWEETS':
            return { ...state, sweets: action.payload };
        case 'ADD_SWEET':
            return { ...state, sweets: [action.payload, ...state.sweets] };
        case 'UPDATE_SWEET':
            return {
                ...state,
                sweets: state.sweets.map((s) =>
                    s.id === action.payload.id ? action.payload : s
                ),
            };
        case 'DELETE_SWEET':
            return {
                ...state,
                sweets: state.sweets.filter((s) => s.id !== action.payload),
            };
        case 'ADD_TO_CART': {
            const existingItem = state.cart.find(
                (item) => item.sweet.id === action.payload.sweet.id
            );
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.sweet.id === action.payload.sweet.id
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    ),
                };
            }
            return {
                ...state,
                cart: [...state.cart, { sweet: action.payload.sweet, quantity: action.payload.quantity }],
            };
        }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter((item) => item.sweet.id !== action.payload),
            };
        case 'UPDATE_CART_QUANTITY':
            return {
                ...state,
                cart: state.cart.map((item) =>
                    item.sweet.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case 'CLEAR_CART':
            return { ...state, cart: [] };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_CATEGORY':
            return { ...state, selectedCategory: action.payload };
        default:
            return state;
    }
}

const SweetsContext = createContext<SweetsContextType | undefined>(undefined);

export function SweetsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(sweetsReducer, initialState);

    const addToCart = (sweet: Sweet, quantity: number = 1) => {
        dispatch({ type: 'ADD_TO_CART', payload: { sweet, quantity } });
    };

    const removeFromCart = (id: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const cartTotal = state.cart.reduce(
        (total, item) => total + item.sweet.price * item.quantity,
        0
    );

    const cartCount = state.cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <SweetsContext.Provider
            value={{
                ...state,
                dispatch,
                addToCart,
                removeFromCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </SweetsContext.Provider>
    );
}

export function useSweets() {
    const context = useContext(SweetsContext);
    if (context === undefined) {
        throw new Error('useSweets must be used within a SweetsProvider');
    }
    return context;
}

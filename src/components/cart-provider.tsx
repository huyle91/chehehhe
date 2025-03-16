'use client'

import { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
    dish: string;
    dish_amount: number;
    noting?: string;
}

interface Cart {
    table: string;
    guest: string;
    status: 'Confirmed' | 'Pending' | 'Completed';
    dish_list: CartItem[];
}

interface CartContextType {
    cart: Cart | null;
    addToCart: (dishId: string, amount: number, noting?: string) => void;
    updateCartItem: (dishId: string, amount: number, noting?: string) => void;
    removeFromCart: (dishId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
    children,
    tableId,
    guestId
}: {
    children: React.ReactNode;
    tableId: string;
    guestId: string;
}) {
    const [cart, setCart] = useState<Cart | null>(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        } else {
            // Initialize empty cart
            const newCart: Cart = {
                table: tableId,
                guest: guestId,
                status: 'Pending',
                dish_list: []
            };
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
    }, [tableId, guestId]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (dishId: string, amount: number, noting?: string) => {
        setCart(prevCart => {
            if (!prevCart) return null;

            const existingItemIndex = prevCart.dish_list.findIndex(item => item.dish === dishId);

            if (existingItemIndex > -1) {
                // Update existing item
                const updatedDishList = [...prevCart.dish_list];
                updatedDishList[existingItemIndex] = {
                    ...updatedDishList[existingItemIndex],
                    dish_amount: updatedDishList[existingItemIndex].dish_amount + amount,
                    noting: noting || updatedDishList[existingItemIndex].noting
                };

                return {
                    ...prevCart,
                    dish_list: updatedDishList
                };
            }

            // Add new item
            return {
                ...prevCart,
                dish_list: [...prevCart.dish_list, { dish: dishId, dish_amount: amount, noting }]
            };
        });
    };

    const updateCartItem = (dishId: string, amount: number, noting?: string) => {
        setCart(prevCart => {
            if (!prevCart) return null;

            return {
                ...prevCart,
                dish_list: prevCart.dish_list.map(item =>
                    item.dish === dishId
                        ? { ...item, dish_amount: amount, noting: noting || item.noting }
                        : item
                )
            };
        });
    };

    const removeFromCart = (dishId: string) => {
        setCart(prevCart => {
            if (!prevCart) return null;

            return {
                ...prevCart,
                dish_list: prevCart.dish_list.filter(item => item.dish !== dishId)
            };
        });
    };

    const clearCart = () => {
        const newCart: Cart = {
            table: tableId,
            guest: guestId,
            status: 'Pending',
            dish_list: []
        };
        setCart(newCart);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: Product[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,
  addItem: (item) => 
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (existingItem) {
        const updatedItems = state.items.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        
        return {
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      }
      
      const newItems = [...state.items, item];
      
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }),
  removeItem: (id) => 
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }),
  updateQuantity: (id, quantity) => 
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => i.id !== id);
        
        return {
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      }
      
      const updatedItems = state.items.map((i) => 
        i.id === id ? { ...i, quantity } : i
      );
      
      return {
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }),
  clearCart: () => 
    set({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));

// Context for components that don't work well with Zustand
const CartContext = createContext<CartState | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cart = useCartStore();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
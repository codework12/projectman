
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LabTest } from '../models/LabTest';
import { DRAW_FEE } from '../data/labTests';
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  test: LabTest;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (test: LabTest) => void;
  removeFromCart: (testId: string) => void;
  updateQuantity: (testId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (test: LabTest) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.test.id === test.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.test.id === test.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { test, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${test.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const removeFromCart = (testId: string) => {
    setItems(prevItems => prevItems.filter(item => item.test.id !== testId));
  };

  const updateQuantity = (testId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.test.id === testId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.test.price * item.quantity), 0);
  };

  const getTotal = () => {
    // If cart is empty, no draw fee
    if (items.length === 0) return 0;
    return getSubtotal() + DRAW_FEE;
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getSubtotal,
      getTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

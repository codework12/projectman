"use client"

import React, { useState } from 'react';
import { useCart } from '@/components/context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import CartPanel from './CartPanel';
import { Badge } from "@/components/ui/badge";

const CartDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
          >
            {itemCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 z-50">
          <CartPanel key={itemCount} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default CartDropdown;

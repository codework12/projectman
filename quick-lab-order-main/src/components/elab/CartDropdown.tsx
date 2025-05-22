
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from '@/context/CartContext';
import CartPanel from './CartPanel';

const CartDropdown: React.FC = () => {
  const { itemCount } = useCart();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-elab-medical-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96" align="end">
        <CartPanel />
      </PopoverContent>
    </Popover>
  );
};

export default CartDropdown;

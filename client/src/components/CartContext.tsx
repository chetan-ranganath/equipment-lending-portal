import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Equipment {
  equipmentId: string;
  name: string;
  category: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: string;
  available: boolean;
  imageUrl: string;
}

interface CartItem extends Equipment {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Equipment) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Equipment) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.equipmentId === item.equipmentId);
      if (existing) {
        // Limit quantity to availableQuantity
        return prevCart.map((i) =>
          i.equipmentId === item.equipmentId && i.quantity < i.availableQuantity
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.equipmentId !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

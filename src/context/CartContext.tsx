
import React, {createContext, useState, useContext, ReactNode} from 'react';
import {Alert} from 'react-native';

interface CartItem {
  id: string; 
  nombre: string;
  precio: number;
  quantity: number;
  local: string; 
  productId: string; }

interface CartState {
  [localName: string]: CartItem[];
}

interface ICartContext {
  carts: CartState;
  totalItemsCount: number; 
  addToCart: (product: any, chosenPrice: {local: string; precio: number}) => void; 
  decreaseQuantity: (cartItemId: string, localName: string) => void; 
  removeFromCart: (cartItemId: string, localName: string) => void;
  clearCart: (localName?: string) => void; 
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider = ({children}: {children: ReactNode}) => {
  const [carts, setCarts] = useState<CartState>({});

  
  const totalItemsCount = Object.values(carts).reduce((total, cartArray) => 
    total + cartArray.reduce((sum, item) => sum + item.quantity, 0), 0);

  const addToCart = (
    product: any,
    chosenPrice: {local: string; precio: number},
  ) => {
    const localName = chosenPrice.local;
    const cartItemId = `${product.id}-${localName}`;

    setCarts(prevCarts => {
      const currentCart = prevCarts[localName] || []; 

      const existingItem = currentCart.find(item => item.id === cartItemId);

      let newCart;
      if (existingItem) {
        
        newCart = currentCart.map(item =>
          item.id === cartItemId
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
      } else {
        
        const newItem = {
            ...product,
            id: cartItemId, 
            productId: product.id, 
            precio: chosenPrice.precio,
            local: localName,
            quantity: 1,
        };
        newCart = [...currentCart, newItem];
      }

      return {
        ...prevCarts,
        [localName]: newCart, 
      };
    });

    Alert.alert(
      '¡Éxito!',
      `${product.nombre} ha sido añadido al carrito de ${localName}.`,
    );
  };

  const decreaseQuantity = (cartItemId: string, localName: string) => {
    setCarts(prevCarts => {
      const currentCart = prevCarts[localName] || [];
      const existingItem = currentCart.find(item => item.id === cartItemId);

      if (!existingItem) return prevCarts;

      let newCart;
      if (existingItem.quantity === 1) {
        
        newCart = currentCart.filter(item => item.id !== cartItemId);
      } else {
        
        newCart = currentCart.map(item =>
          item.id === cartItemId
            ? {...item, quantity: item.quantity - 1}
            : item,
        );
      }
    
      
      if (newCart.length === 0) {
          const {[localName]: deleted, ...rest} = prevCarts;
          return rest;
      }

      return {
        ...prevCarts,
        [localName]: newCart,
      };
    });
  };

  const removeFromCart = (cartItemId: string, localName: string) => {
    setCarts(prevCarts => {
        const currentCart = prevCarts[localName] || [];
        const newCart = currentCart.filter(item => item.id !== cartItemId);
        
        
        if (newCart.length === 0) {
            const {[localName]: deleted, ...rest} = prevCarts;
            return rest;
        }

        return {
            ...prevCarts,
            [localName]: newCart,
        };
    });
  };

  const clearCart = (localName?: string) => {
    if (localName) {
        
        setCarts(prevCarts => {
            const {[localName]: deleted, ...rest} = prevCarts;
            return rest;
        });
    } else {
        
        setCarts({});
    }
  };


  return (
    <CartContext.Provider 
      value={{ 
        carts, 
        totalItemsCount, 
        addToCart, 
        decreaseQuantity, 
        removeFromCart, 
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
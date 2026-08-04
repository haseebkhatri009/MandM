//cart save in local storage

// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   quantity: number;
//   category: string;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotalPrice: () => number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedCart = localStorage.getItem('cart');
//       if (savedCart) {
//         try {
//           setCartItems(JSON.parse(savedCart));
//         } catch (e) {
//           console.error('Error loading cart from localStorage:', e);
//         }
//       }
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('cart', JSON.stringify(cartItems));
//     }
//   }, [cartItems]);

//   const addToCart = (item: CartItem) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems.find((i) => i.id === item.id);
//       if (existingItem) {
//         return prevItems.map((i) =>
//           i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
//         );
//       }
//       return [...prevItems, item];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(id);
//       return;
//     }
//     setCartItems((prevItems) =>
//       prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => {
//       const price = item.discount ? item.price - item.discount : item.price;
//       return total + price * item.quantity;
//     }, 0);
//   };

//   const value: CartContextType = {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getTotalPrice,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };



//cart in rtdb

// lib/cartContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './authContext';
import { rtdb } from './firebase';
import { ref, set, update, onValue, off } from 'firebase/database';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loading: boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const isUpdatingFromFirebase = useRef(false);
  const initialLoadDone = useRef(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  const logCount = useRef(0);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      if (isMounted.current) {
        setCartItems([]);
        setCartCount(0);
        setLoading(false);
      }
      initialLoadDone.current = false;
      logCount.current = 0;
      return;
    }

    setLoading(true);
    const userCartRef = ref(rtdb, `carts/${user.uid}`);

    const handleCartUpdate = (snapshot: any) => {
      if (!isMounted.current) return;
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = data.items || [];
        
        isUpdatingFromFirebase.current = true;
        setCartItems(items);
        setCartCount(items.length);
        
        // ✅ Sirf 1 baar log karein
        if (logCount.current === 0) {
          console.log(`✅ Cart loaded for ${user.email}: ${items.length} items`);
          logCount.current = 1;
        }
        
        isUpdatingFromFirebase.current = false;
        initialLoadDone.current = true;
      } else {
        set(userCartRef, { items: [], updatedAt: Date.now() });
        isUpdatingFromFirebase.current = true;
        setCartItems([]);
        setCartCount(0);
        if (logCount.current === 0) {
          console.log(`✅ Empty cart created for ${user.email}`);
          logCount.current = 1;
        }
        isUpdatingFromFirebase.current = false;
        initialLoadDone.current = true;
      }
      setLoading(false);
    };

    const unsubscribe = onValue(userCartRef, handleCartUpdate);

    return () => {
      off(userCartRef, 'value', handleCartUpdate);
      logCount.current = 0;
    };
  }, [user]);

  const saveCartToFirebase = (items: CartItem[]) => {
    if (!user || isUpdatingFromFirebase.current || !initialLoadDone.current) return;
    
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      if (!isMounted.current || !user) return;
      
      const userCartRef = ref(rtdb, `carts/${user.uid}`);
      const totalPrice = items.reduce((total, item) => {
        const price = item.discount && item.discount > 0 && item.discount < item.price
          ? item.price - item.discount
          : item.price;
        return total + price * item.quantity;
      }, 0);

      const cartData = {
        items: items,
        updatedAt: Date.now(),
        totalItems: items.length,
        totalPrice: totalPrice,
      };

      update(userCartRef, cartData).catch((error) => {
        console.error('❌ Error saving cart to Firebase:', error);
      });
    }, 300);
  };

  useEffect(() => {
    if (isUpdatingFromFirebase.current || !initialLoadDone.current || !user) return;
    saveCartToFirebase(cartItems);
    setCartCount(cartItems.length);
  }, [cartItems, user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (isMounted.current) {
            setCartItems(parsed);
            setCartCount(parsed.length);
          }
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
        }
      }
    }
  }, [user]);

  const addToCart = (item: CartItem) => {
    if (!user) {
      const tempCart = [...cartItems];
      const existing = tempCart.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        tempCart.push(item);
      }
      setCartItems(tempCart);
      setCartCount(tempCart.length);
      localStorage.setItem('cart', JSON.stringify(tempCart));
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      let newItems;
      if (existing) {
        newItems = prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newItems = [...prev, { ...item, quantity: item.quantity || 1 }];
      }
      setCartCount(newItems.length);
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    if (!user) {
      const tempCart = cartItems.filter(item => item.id !== id);
      setCartItems(tempCart);
      setCartCount(tempCart.length);
      localStorage.setItem('cart', JSON.stringify(tempCart));
      return;
    }

    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      setCartCount(newItems.length);
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (!user) {
      const tempCart = cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      setCartItems(tempCart);
      setCartCount(tempCart.length);
      localStorage.setItem('cart', JSON.stringify(tempCart));
      return;
    }

    setCartItems(prev => {
      const newItems = prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      setCartCount(newItems.length);
      return newItems;
    });
  };

  const clearCart = () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      localStorage.removeItem('cart');
      return;
    }

    setCartItems([]);
    setCartCount(0);
    if (user) {
      const userCartRef = ref(rtdb, `carts/${user.uid}`);
      set(userCartRef, { items: [], updatedAt: Date.now() });
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount && item.discount > 0 && item.discount < item.price
        ? item.price - item.discount
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    loading,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
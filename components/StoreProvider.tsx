'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type CartItem = { slug: string; quantity: number };
type Account = { name: string; email: string } | null;

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  account: Account;
  cartCount: number;
  wishlistCount: number;
  addToCart: (slug: string) => void;
  decreaseFromCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  isInWishlist: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  loginOrSignup: (name: string, email: string) => void;
  logout: () => void;
};

const CART_KEY = 'petaldrift_cart';
const WISHLIST_KEY = 'petaldrift_wishlist';
const ACCOUNT_KEY = 'petaldrift_account';

const StoreContext = createContext<StoreContextValue | null>(null);

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readFromStorage(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readFromStorage(WISHLIST_KEY, []));
  const [account, setAccount] = useState<Account>(() => readFromStorage(ACCOUNT_KEY, null));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (account) {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
      return;
    }
    localStorage.removeItem(ACCOUNT_KEY);
  }, [account]);

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    wishlist,
    account,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    wishlistCount: wishlist.length,
    addToCart: (slug) => {
      setCart((current) => {
        const existing = current.find((item) => item.slug === slug);
        if (!existing) return [...current, { slug, quantity: 1 }];
        return current.map((item) => item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item);
      });
    },
    decreaseFromCart: (slug) => {
      setCart((current) => current.flatMap((item) => {
        if (item.slug !== slug) return item;
        if (item.quantity <= 1) return [];
        return { ...item, quantity: item.quantity - 1 };
      }));
    },
    removeFromCart: (slug) => setCart((current) => current.filter((item) => item.slug !== slug)),
    clearCart: () => setCart([]),
    isInWishlist: (slug) => wishlist.includes(slug),
    toggleWishlist: (slug) => setWishlist((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]),
    loginOrSignup: (name, email) => setAccount({ name, email: email.trim().toLowerCase() }),
    logout: () => setAccount(null)
  }), [account, cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}

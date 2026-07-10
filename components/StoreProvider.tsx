'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '@/lib/petal-data';
import { AdminAudit, CmsContent, defaultCmsContent, getActiveBanners, OrderRecord, TrackingEvent, TrackingStatus } from '@/lib/site-content';

type CartItem = { slug: string; quantity: number };
type Account = { name: string; email: string } | null;

type PlaceOrderInput = {
  name: string;
  email: string;
  address: string;
};

type BannerUpdateInput = {
  id: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  startAt?: string;
  endAt?: string;
  published?: boolean;
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  account: Account;
  cms: CmsContent;
  orders: OrderRecord[];
  audits: AdminAudit[];
  cartCount: number;
  wishlistCount: number;
  isAdmin: boolean;
  canManageContent: boolean;
  canManageFulfillment: boolean;
  activeBanners: CmsContent['banners'];
  addToCart: (slug: string) => void;
  decreaseFromCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  isInWishlist: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  loginOrSignup: (name: string, email: string) => void;
  logout: () => void;
  placeOrder: (input: PlaceOrderInput) => { ok: boolean; orderId?: string; message?: string };
  updateOrderTracking: (input: {
    orderId: string;
    status: TrackingStatus;
    note: string;
    courier: string;
    trackingNumber: string;
  }) => void;
  addBanner: () => void;
  updateBanner: (input: BannerUpdateInput) => void;
  removeBanner: (id: string) => void;
  moveBanner: (id: string, direction: 'up' | 'down') => void;
  updateHero: (input: Partial<CmsContent['hero']>) => void;
};

const CART_KEY = 'petaldrift_cart';
const WISHLIST_KEY = 'petaldrift_wishlist';
const ACCOUNT_KEY = 'petaldrift_account';
const CMS_KEY = 'petaldrift_cms';
const ORDERS_KEY = 'petaldrift_orders';
const AUDIT_KEY = 'petaldrift_audits';

const CONTENT_ADMINS = ['admin@petaldrift.com'];
const FULFILLMENT_ADMINS = ['fulfillment@petaldrift.com', 'admin@petaldrift.com'];

const StoreContext = createContext<StoreContextValue | null>(null);

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9.]/g, '')) || 0;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readFromStorage(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readFromStorage(WISHLIST_KEY, []));
  const [account, setAccount] = useState<Account>(() => readFromStorage(ACCOUNT_KEY, null));
  const [cms, setCms] = useState<CmsContent>(() => readFromStorage(CMS_KEY, defaultCmsContent));
  const [orders, setOrders] = useState<OrderRecord[]>(() => readFromStorage(ORDERS_KEY, []));
  const [audits, setAudits] = useState<AdminAudit[]>(() => readFromStorage(AUDIT_KEY, []));

  const accountEmail = account?.email?.toLowerCase() ?? '';
  const isAdmin = accountEmail.endsWith('@petaldrift.com') || CONTENT_ADMINS.includes(accountEmail) || FULFILLMENT_ADMINS.includes(accountEmail);
  const canManageContent = CONTENT_ADMINS.includes(accountEmail);
  const canManageFulfillment = FULFILLMENT_ADMINS.includes(accountEmail);

  const addAudit = useCallback((action: string, target: string) => {
    const actor = account?.email ?? 'system@petaldrift.com';
    setAudits((current) => [
      { id: uid('audit'), actor, action, target, timestamp: new Date().toISOString() },
      ...current
    ].slice(0, 100));
  }, [account?.email]);

  useEffect(() => {
    saveToStorage(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    saveToStorage(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  useEffect(() => {
    if (account) {
      saveToStorage(ACCOUNT_KEY, account);
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCOUNT_KEY);
    }
  }, [account]);

  useEffect(() => {
    saveToStorage(CMS_KEY, cms);
  }, [cms]);

  useEffect(() => {
    saveToStorage(ORDERS_KEY, orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage(AUDIT_KEY, audits);
  }, [audits]);

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    wishlist,
    account,
    cms,
    orders,
    audits,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    wishlistCount: wishlist.length,
    isAdmin,
    canManageContent,
    canManageFulfillment,
    activeBanners: getActiveBanners(cms.banners),
    addToCart: (slug) => {
      setCart((current) => {
        const existing = current.find((item) => item.slug === slug);
        if (!existing) return [...current, { slug, quantity: 1 }];
        return current.map((item) => (item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item));
      });
    },
    decreaseFromCart: (slug) => {
      setCart((current) =>
        current.flatMap((item) => {
          if (item.slug !== slug) return item;
          if (item.quantity <= 1) return [];
          return { ...item, quantity: item.quantity - 1 };
        })
      );
    },
    removeFromCart: (slug) => setCart((current) => current.filter((item) => item.slug !== slug)),
    clearCart: () => setCart([]),
    isInWishlist: (slug) => wishlist.includes(slug),
    toggleWishlist: (slug) =>
      setWishlist((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug])),
    loginOrSignup: (name, email) => setAccount({ name, email: email.trim().toLowerCase() }),
    logout: () => setAccount(null),
    placeOrder: ({ name, email, address }) => {
      if (!name || !email || !address || cart.length === 0) {
        return { ok: false, message: 'Missing order details.' };
      }

      const items = cart.flatMap((line) => {
        const product = products.find((entry) => entry.slug === line.slug);
        if (!product) return [];
        return [{ slug: product.slug, name: product.name, quantity: line.quantity, unitPrice: priceToNumber(product.price) }];
      });

      if (items.length === 0) {
        return { ok: false, message: 'No valid items in cart.' };
      }

      const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const firstEvent: TrackingEvent = {
        id: uid('evt'),
        status: 'Order placed',
        note: 'Order confirmed by storefront checkout.',
        timestamp: new Date().toISOString()
      };

      const order: OrderRecord = {
        id: uid('ord'),
        accountName: name.trim(),
        accountEmail: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        total,
        status: 'Order placed',
        courier: 'Pending assignment',
        trackingNumber: 'TBD',
        events: [firstEvent],
        items,
        shippingAddress: address.trim()
      };

      setOrders((current) => [order, ...current]);
      setCart([]);
      addAudit('order.created', order.id);
      return { ok: true, orderId: order.id };
    },
    updateOrderTracking: ({ orderId, status, note, courier, trackingNumber }) => {
      if (!canManageFulfillment) return;
      setOrders((current) =>
        current.map((order) => {
          if (order.id !== orderId) return order;
          const event: TrackingEvent = {
            id: uid('evt'),
            status,
            note: note.trim() || 'Tracking updated from admin panel.',
            timestamp: new Date().toISOString()
          };
          return {
            ...order,
            status,
            courier: courier.trim() || order.courier,
            trackingNumber: trackingNumber.trim() || order.trackingNumber,
            events: [event, ...order.events]
          };
        })
      );
      addAudit('order.tracking.updated', orderId);
    },
    addBanner: () => {
      if (!canManageContent) return;
      setCms((current) => {
        const order = Math.max(0, ...current.banners.map((banner) => banner.order)) + 1;
        return {
          ...current,
          banners: [
            ...current.banners,
            {
              id: uid('bnr'),
              title: 'New premium banner',
              subtitle: 'Update copy, schedule, and publishing from admin panel.',
              ctaLabel: 'Explore',
              ctaHref: '/shop',
              order,
              published: false
            }
          ]
        };
      });
      addAudit('cms.banner.created', 'new-banner');
    },
    updateBanner: (input) => {
      if (!canManageContent) return;
      setCms((current) => ({
        ...current,
        banners: current.banners.map((banner) => (banner.id === input.id ? { ...banner, ...input } : banner))
      }));
      addAudit('cms.banner.updated', input.id);
    },
    removeBanner: (id) => {
      if (!canManageContent) return;
      setCms((current) => ({ ...current, banners: current.banners.filter((banner) => banner.id !== id) }));
      addAudit('cms.banner.deleted', id);
    },
    moveBanner: (id, direction) => {
      if (!canManageContent) return;
      setCms((current) => {
        const ordered = [...current.banners].sort((a, b) => a.order - b.order);
        const index = ordered.findIndex((banner) => banner.id === id);
        if (index < 0) return current;
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= ordered.length) return current;
        [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
        return {
          ...current,
          banners: ordered.map((banner, idx) => ({ ...banner, order: idx + 1 }))
        };
      });
      addAudit('cms.banner.reordered', id);
    },
    updateHero: (input) => {
      if (!canManageContent) return;
      setCms((current) => ({ ...current, hero: { ...current.hero, ...input } }));
      addAudit('cms.hero.updated', 'homepage-hero');
    }
  }), [account, addAudit, audits, canManageContent, canManageFulfillment, cart, cms, isAdmin, orders, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}

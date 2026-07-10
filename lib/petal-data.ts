import { Gem, Gift, Heart, Home, Leaf, PackageCheck, Palette, Recycle, ShieldCheck, Sparkles, Star, Wand2, Waves } from 'lucide-react';

export const navItems = [
  ['Home', '/'], ['Shop', '/shop'], ['Collections', '/collections'], ['Custom Orders', '/custom-orders'], ['About', '/about'], ['Gallery', '/gallery'], ['Reviews', '/reviews'], ['FAQ', '/faq'], ['Contact', '/contact']
] as const;

export type Category = { name: string; slug: string; photoUrl: string };
export const categoryNames = ['Resin Coasters', 'Serving Trays', 'Bookmarks', 'Jewelry', 'Wall Art', 'Clocks', 'Wedding Keepsakes', 'Keychains', 'Pressed Flower Art', 'Ocean Collection', 'Personalized Gifts', 'Corporate Gifts'];
export function toCategorySlug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'); }
export const categories: Category[] = categoryNames.map((name) => ({ name, slug: toCategorySlug(name), photoUrl: '' }));
export const collections = ['Wedding Collection', 'Ocean Collection', 'Botanical Collection', 'Luxury Collection', 'Minimal Collection', 'Festive Collection', 'Home Décor', 'Jewelry', 'Gift Collection', 'Corporate Collection'];
export const filters = ['Under ₹1,000', '₹1,000–₹3,000', 'Made to order', 'Ready to ship', 'Wedding gifts', 'Home décor', 'Jewelry', 'Sort: newest'];

export type Product = {
  slug: string;
  name: string;
  price: string;
  rating: number;
  stock: string;
  material: string;
  badge: string;
  category: string;
  imageUrls: string[];
};

export const products: Product[] = [
  { slug: 'rose-garden-coaster-set', name: 'Rose Garden Coaster Set', price: '₹1,499', rating: 5, stock: 'In stock', material: 'Botanical resin', badge: 'Customizable', category: 'Resin Coasters', imageUrls: [] },
  { slug: 'ocean-lace-serving-tray', name: 'Ocean Lace Serving Tray', price: '₹2,999', rating: 5, stock: 'Low stock', material: 'Ocean resin', badge: 'Best seller', category: 'Serving Trays', imageUrls: [] },
  { slug: 'lavender-memory-bookmark', name: 'Lavender Memory Bookmark', price: '₹499', rating: 5, stock: 'In stock', material: 'Pressed flowers', badge: 'Personalized', category: 'Bookmarks', imageUrls: [] },
  { slug: 'golden-petal-pendant', name: 'Golden Petal Pendant', price: '₹899', rating: 5, stock: 'In stock', material: 'Jewelry resin', badge: 'Gift ready', category: 'Jewelry', imageUrls: [] },
  { slug: 'wedding-bloom-clock', name: 'Wedding Bloom Clock', price: '₹4,499', rating: 5, stock: 'Made to order', material: 'Keepsake resin', badge: 'Wedding', category: 'Clocks', imageUrls: [] },
  { slug: 'memory-flower-wall-art', name: 'Memory Flower Wall Art', price: '₹6,999', rating: 5, stock: 'Made to order', material: 'Archival resin', badge: 'Heirloom', category: 'Wall Art', imageUrls: [] }
];

export const reasons = [
  { icon: Wand2, title: 'Handmade', text: 'Each piece is poured, layered, sanded, and polished by hand.' },
  { icon: Recycle, title: 'Eco Friendly', text: 'Mindful small-batch production with considered packaging.' },
  { icon: ShieldCheck, title: 'Premium Resin', text: 'Crystal clarity, UV resistance, and gallery-grade finishing.' },
  { icon: Sparkles, title: 'Custom Designs', text: 'Names, flowers, gold flakes, palettes, shapes, and keepsakes.' }
];

export const adminModules = ['Products', 'Collections', 'Orders', 'Customers', 'Cloudflare R2 Media', 'Cloudflare Auth Users', 'Inventory', 'Coupons', 'Reviews', 'Analytics', 'Settings'];
export const services = [
  { icon: Leaf, title: 'Preserved Flowers' }, { icon: Waves, title: 'Ocean Inspired Pieces' }, { icon: Gift, title: 'Personalized Gifts' }, { icon: Home, title: 'Home Décor' }, { icon: Gem, title: 'Jewelry' }, { icon: Heart, title: 'Wedding Keepsakes' }, { icon: Palette, title: 'Custom Resin Art' }, { icon: PackageCheck, title: 'Corporate Gifts' }
];
export const testimonials = ['The wedding bouquet tray made me cry happy tears.', 'Every coaster feels like tiny art from a calm gallery.', 'Premium finish, beautiful packaging, and such thoughtful updates.'];
export const stars = Star;

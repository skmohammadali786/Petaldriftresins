import { Gem, Gift, Heart, Home, Leaf, PackageCheck, Palette, Recycle, ShieldCheck, Sparkles, Star, Wand2, Waves } from 'lucide-react';

export const navItems = [
  ['Home', '/'], ['Shop', '/shop'], ['Collections', '/collections'], ['Custom Orders', '/custom-orders'], ['About', '/about'], ['Gallery', '/gallery'], ['Reviews', '/reviews'], ['Blog', '/blog'], ['FAQ', '/faq'], ['Contact', '/contact']
] as const;

export const categories = ['Resin Coasters', 'Serving Trays', 'Bookmarks', 'Jewelry', 'Wall Art', 'Clocks', 'Wedding Keepsakes', 'Keychains', 'Pressed Flower Art', 'Ocean Collection', 'Personalized Gifts', 'Corporate Gifts'];
export const collections = ['Wedding Collection', 'Ocean Collection', 'Botanical Collection', 'Luxury Collection', 'Minimal Collection', 'Festive Collection', 'Home Décor', 'Jewelry', 'Gift Collection', 'Corporate Collection'];
export const filters = ['Price', 'Category', 'Color', 'Material', 'Occasion', 'Gift Type', 'Availability', 'Sort'];

export const products = [
  { slug: 'rose-garden-coaster-set', name: 'Rose Garden Coaster Set', price: '$86', rating: 5, stock: 'In stock', material: 'Botanical resin', badge: 'Customizable' },
  { slug: 'ocean-lace-serving-tray', name: 'Ocean Lace Serving Tray', price: '$148', rating: 5, stock: 'Low stock', material: 'Ocean resin', badge: 'Best seller' },
  { slug: 'lavender-memory-bookmark', name: 'Lavender Memory Bookmark', price: '$34', rating: 5, stock: 'In stock', material: 'Pressed flowers', badge: 'Personalized' },
  { slug: 'golden-petal-pendant', name: 'Golden Petal Pendant', price: '$58', rating: 5, stock: 'In stock', material: 'Jewelry resin', badge: 'Gift ready' },
  { slug: 'wedding-bloom-clock', name: 'Wedding Bloom Clock', price: '$210', rating: 5, stock: 'Made to order', material: 'Keepsake resin', badge: 'Wedding' },
  { slug: 'memory-flower-wall-art', name: 'Memory Flower Wall Art', price: '$320', rating: 5, stock: 'Made to order', material: 'Archival resin', badge: 'Heirloom' }
];

export const reasons = [
  { icon: Wand2, title: 'Handmade', text: 'Each piece is poured, layered, sanded, and polished by hand.' },
  { icon: Recycle, title: 'Eco Friendly', text: 'Mindful small-batch production with considered packaging.' },
  { icon: ShieldCheck, title: 'Premium Resin', text: 'Crystal clarity, UV resistance, and gallery-grade finishing.' },
  { icon: Sparkles, title: 'Custom Designs', text: 'Names, flowers, gold flakes, palettes, shapes, and keepsakes.' }
];

export const adminModules = ['Products', 'Collections', 'Orders', 'Customers', 'Cloudflare R2 Media', 'Cloudflare Auth Users', 'Inventory', 'Coupons', 'Reviews', 'Blog CMS', 'Analytics', 'Settings'];
export const services = [
  { icon: Leaf, title: 'Preserved Flowers' }, { icon: Waves, title: 'Ocean Inspired Pieces' }, { icon: Gift, title: 'Personalized Gifts' }, { icon: Home, title: 'Home Décor' }, { icon: Gem, title: 'Jewelry' }, { icon: Heart, title: 'Wedding Keepsakes' }, { icon: Palette, title: 'Custom Resin Art' }, { icon: PackageCheck, title: 'Corporate Gifts' }
];
export const testimonials = ['The wedding bouquet tray made me cry happy tears.', 'Every coaster feels like tiny art from a calm gallery.', 'Premium finish, beautiful packaging, and such thoughtful updates.'];
export const blogPosts = ['How to preserve wedding flowers in resin', 'Ocean resin art: why every wave is unique', 'Choosing colors for a timeless custom keepsake'];
export const stars = Star;

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  published: boolean;
  startAt?: string;
  endAt?: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export type SeoRecord = {
  route: string;
  title: string;
  description: string;
};

export type PageBlock = {
  id: string;
  route: string;
  title: string;
  body: string;
  published: boolean;
};

export type CollectionHighlight = {
  id: string;
  name: string;
  description: string;
};

export type Testimonial = {
  id: string;
  author: string;
  quote: string;
  location: string;
};

export type CmsContent = {
  hero: HeroContent;
  banners: Banner[];
  categories: import('@/lib/petal-data').Category[];
  seo: SeoRecord[];
  pageBlocks: PageBlock[];
  collections: CollectionHighlight[];
  testimonials: Testimonial[];
};

export type TrackingStatus =
  | 'Order placed'
  | 'Design approved'
  | 'In production'
  | 'Quality check'
  | 'Packed'
  | 'Shipped'
  | 'Delivered';

export type TrackingEvent = {
  id: string;
  status: TrackingStatus;
  note: string;
  timestamp: string;
};

export type OrderRecord = {
  id: string;
  accountName: string;
  accountEmail: string;
  createdAt: string;
  total: number;
  status: TrackingStatus;
  courier: string;
  trackingNumber: string;
  events: TrackingEvent[];
  items: Array<{ slug: string; name: string; quantity: number; unitPrice: number; customDetails?: string }>;
  shippingAddress: string;
};

export type AdminAudit = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export const trackingStatuses: TrackingStatus[] = [
  'Order placed',
  'Design approved',
  'In production',
  'Quality check',
  'Packed',
  'Shipped',
  'Delivered'
];

export const defaultCmsContent: CmsContent = {
  hero: {
    eyebrow: 'Luxury handmade resin art',
    title: 'Where Nature Lives Forever',
    description: 'Handcrafted resin art inspired by preserved flowers, ocean textures, and treasured memories.',
    primaryCtaLabel: 'Explore Collection',
    primaryCtaHref: '/shop',
    secondaryCtaLabel: 'Create Custom Order',
    secondaryCtaHref: '/custom-orders'
  },
  categories: [
    'Resin Coasters', 'Serving Trays', 'Bookmarks', 'Jewelry', 'Wall Art', 'Clocks', 'Wedding Keepsakes', 'Keychains', 'Pressed Flower Art', 'Ocean Collection', 'Personalized Gifts', 'Corporate Gifts'
  ].map((name) => ({ name, slug: name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'), photoUrl: '' })),
  banners: [
    {
      id: 'bnr-bridal',
      title: 'Bridal bouquet preservation slots are open',
      subtitle: 'Reserve your wedding memory resin keepsake with premium floral sealing.',
      ctaLabel: 'Reserve Slot',
      ctaHref: '/custom-orders',
      order: 1,
      published: true
    },
    {
      id: 'bnr-ocean',
      title: 'New ocean-lace resin collection launched',
      subtitle: 'Layered wave gradients, pearl textures, and gallery-grade finish.',
      ctaLabel: 'Shop Ocean Collection',
      ctaHref: '/collections',
      order: 2,
      published: true
    }
  ],
  seo: [
    { route: '/', title: "Mahi\'s Art | Premium Resin Art", description: 'Premium handcrafted resin art and floral keepsakes.' },
    { route: '/shop', title: "Shop | Mahi\'s Art", description: 'Browse premium resin products and handcrafted collections.' },
    { route: '/custom-orders', title: "Custom Orders | Mahi\'s Art", description: 'Design your own resin keepsake with our atelier.' },
    { route: '/orders', title: "Order History | Mahi\'s Art", description: 'Track your orders and production milestones in real time.' }
  ],
  pageBlocks: [
    { id: 'home-process', route: '/', title: 'Atelier Process', body: 'Consultation, concept design, preservation, pouring, finishing, and careful delivery.', published: true },
    { id: 'shop-curation', route: '/shop', title: 'Curated Product Stories', body: 'Each piece includes material story, production care notes, and gifting guidance.', published: true },
    { id: 'orders-tracking', route: '/orders', title: 'Transparent Tracking', body: 'Every order milestone is logged from design approval to delivery confirmation.', published: true }
  ],
  collections: [
    { id: 'col-wedding', name: 'Wedding Keepsakes', description: 'Preserve bouquets, vows, and sentimental flowers in heirloom resin.' },
    { id: 'col-ocean', name: 'Ocean Resin Art', description: 'Coastal palettes, crest effects, and luminous shore-inspired layers.' },
    { id: 'col-luxury', name: 'Luxury Home Accents', description: 'Statement trays, clocks, and wall art with premium finishing.' }
  ],
  testimonials: [
    { id: 'ts-1', author: 'Ayesha R.', quote: 'The bouquet tray is beyond beautiful and every update felt so personal.', location: 'Mumbai' },
    { id: 'ts-2', author: 'Nina K.', quote: 'The premium quality and packaging are exactly what I wanted for gifting.', location: 'Delhi' },
    { id: 'ts-3', author: 'Ria M.', quote: 'Tracking milestones kept me calm while my custom order was being crafted.', location: 'Bengaluru' }
  ]
};

export function getActiveBanners(banners: Banner[], now = new Date()) {
  return banners
    .filter((banner) => banner.published)
    .filter((banner) => {
      const start = banner.startAt ? new Date(banner.startAt) : null;
      const end = banner.endAt ? new Date(banner.endAt) : null;
      if (start && Number.isFinite(start.getTime()) && start > now) return false;
      if (end && Number.isFinite(end.getTime()) && end < now) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

export function getPublishedPageBlocks(blocks: PageBlock[], route: string) {
  return blocks.filter((block) => block.published && block.route === route);
}

import { FeaturePage } from '@/components/FeaturePage';

export default function GalleryPage() {
  return <FeaturePage eyebrow='Gallery' title='Pinterest masonry gallery' text='Pinterest masonry layout with lightbox-ready cards, zoom behavior, category filters, product tags, video reels, and animated loading.' features={['Masonry artwork', 'Lightbox zoom', 'Category filters', 'Video reels', 'Product tags', 'Animated loading']} cta='Open an immersive studio gallery' />;
}

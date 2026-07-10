import { FeaturePage } from '@/components/FeaturePage';

export default function FaqPage() {
  return <FeaturePage eyebrow='FAQ' title='Helpful answers' text='Animated accordion-inspired help center with search, shipping, custom order, resin care, returns, and preservation guidance.' features={['Search answers', 'Shipping', 'Custom orders', 'Resin care', 'Returns', 'Flower preservation']} cta='Find answers before ordering' />;
}

import { FeaturePage } from '@/components/FeaturePage';

export default function SearchPage() {
  return <FeaturePage eyebrow='Search' title='Live boutique search' text='Live suggestions, popular searches, trending products, and quick navigation.' features={['Live suggestions', 'Popular searches', 'Trending products', 'Quick filters', 'Recent searches', 'No-results art']} cta='Find gifts, flowers, and collections quickly' />;
}

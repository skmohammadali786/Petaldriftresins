import { FeaturePage } from '@/components/FeaturePage';

export default function BlogPage() {
  return <FeaturePage eyebrow='Blog' title='Petal Drift journal' text='Modern magazine reading layout with categories, featured articles, related posts, social sharing, comments, and reading progress.' features={['Featured article', 'Care guide', 'Wedding flower tips', 'Ocean resin notes', 'Gift guide', 'Studio process']} cta='Read a calm magazine-style journal' />;
}

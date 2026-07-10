import { FeaturePage } from '@/components/FeaturePage';

export default function ReviewsPage() {
  return <FeaturePage eyebrow='Reviews' title='Customer love notes' text='Auto-scrolling testimonials, video reviews, photo reviews, animated star ratings, and glass cards.' features={['Video review', 'Photo review', 'Star rating', 'Wedding keepsake story', 'Gift reaction', 'Verified purchase']} cta='Trust signals that feel warm and premium' />;
}

import { FeaturePage } from '@/components/FeaturePage';

export default function DashboardPage() {
  return <FeaturePage eyebrow='Dashboard' title='Customer dashboard' text='Orders, wishlist, addresses, downloads, reviews, profile, notifications, and rewards.' features={['Orders', 'Wishlist', 'Addresses', 'Downloads', 'Reviews', 'Rewards']} cta='A calm account area for customers' />;
}

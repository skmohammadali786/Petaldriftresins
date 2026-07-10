import { FeaturePage } from '@/components/FeaturePage';

export default function WishlistPage() {
  return <FeaturePage eyebrow='Wishlist' title='Saved pieces' text='Beautiful saved-product cards with share wishlist and move-to-cart actions.' features={['Saved cards', 'Share wishlist', 'Move to cart', 'Price alerts', 'Gift planning', 'Empty state artwork']} cta='Save the pieces that speak to you' />;
}

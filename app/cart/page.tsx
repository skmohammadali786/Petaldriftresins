import { FeaturePage } from '@/components/FeaturePage';

export default function CartPage() {
  return <FeaturePage eyebrow='Cart' title='Elegant shopping cart' text='Elegant shopping cart with coupon, gift note, shipping calculator, recommended products, and animated checkout.' features={['Cart summary', 'Coupon', 'Gift note', 'Shipping calculator', 'Recommendations', 'Checkout CTA']} cta='Review your handmade selection' />;
}

import { FeaturePage } from '@/components/FeaturePage';

export default function CheckoutPage() {
  return <FeaturePage eyebrow='Checkout' title='Secure one-page checkout' text='Minimal one-page guest checkout with secure payment, shipping, billing, order summary, and success animation.' features={['Guest checkout', 'Shipping', 'Billing', 'Payment', 'Order summary', 'Success bloom']} cta='Complete the purchase with confidence' />;
}

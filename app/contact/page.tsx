import { FeaturePage } from '@/components/FeaturePage';

export default function ContactPage() {
  return <FeaturePage eyebrow='Contact' title='Visit the studio' text='Interactive form, Google Maps placeholder, business hours, WhatsApp, Instagram, email, phone, and studio address.' features={['Contact form', 'Studio map', 'Business hours', 'WhatsApp', 'Instagram feed', 'Email and phone']} cta='Start a conversation with the atelier' />;
}

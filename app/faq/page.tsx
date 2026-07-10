import { SiteChrome } from '@/components/SiteChrome';

const faqs = [
  ['Shipping', 'Ready products are dispatched in 2–4 working days. Custom resin orders usually dispatch in 7–14 working days after design approval. Standard India shipping is ₹99 and free above ₹3,000.'],
  ['Returns', 'Returns are accepted within 7 days for unused ready-made products in original packaging. Customised name, flower preservation, date, colour, and made-to-order pieces are not returnable unless damaged in transit.'],
  ['Contact', 'For order help, custom designs, or after-sales support, email care@mahisart.com or WhatsApp +91 98765 43210 between 10:00 AM and 6:00 PM IST, Monday to Saturday.'],
  ['Care', 'Keep resin pieces away from harsh sunlight, heat, abrasives, and alcohol-based cleaners. Wipe gently with a soft dry or slightly damp cloth.']
];

export default function FaqPage() {
  return <SiteChrome><section className="premium-gradient px-6 pb-20 pt-36"><div className="mx-auto max-w-5xl"><p className="font-button text-xs uppercase tracking-[.45em] text-gold">FAQ</p><h1 className="mt-3 font-heading text-6xl">Help, shipping, returns, and contact</h1><div className="mt-8 grid gap-4">{faqs.map(([title, text]) => <article key={title} className="rounded-boutique bg-white p-6 shadow-sm"><h2 className="font-heading text-4xl">{title}</h2><p className="mt-3 leading-8 text-charcoal/70">{text}</p></article>)}</div></div></section></SiteChrome>;
}

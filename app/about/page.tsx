import { FeaturePage } from '@/components/FeaturePage';

export default function AboutPage() {
  return <FeaturePage eyebrow='About' title='Founder story' text='Founder story, mission, vision, craftsmanship process, studio timeline, artist values, awards, and careful making.' features={['Founder story', 'Mission and vision', 'Studio timeline', 'Craft process', 'Meet the artist', 'Values and awards']} cta='Meet the artist behind every preserved bloom' />;
}

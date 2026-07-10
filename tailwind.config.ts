import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF8F5', sage: '#A8C3A0', rose: '#E8C8C1', gold: '#D8B36A', lavender: '#D9D2F4', sand: '#F5EFE6', charcoal: '#2E2E2E', champagne: '#FFF8EA', espresso: '#FAF8F5'
      },
      fontFamily: {
        heading: ['var(--font-cormorant)'], body: ['var(--font-inter)'], button: ['var(--font-poppins)']
      },
      boxShadow: { boutique: '0 24px 80px rgba(46,46,46,.10)', glow: '0 0 35px rgba(216,179,106,.22)' },
      borderRadius: { boutique: '2rem' }
    }
  },
  plugins: []
};
export default config;

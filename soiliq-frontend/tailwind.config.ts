import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#166534',
        'primary-dark': '#14532d',
        accent: '#D97706',
        'accent-dark': '#B45309',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: '#1F2937',
        muted: '#4B5563',
        soil: '#166534',
        leaf: '#2E7D32',
        wheat: '#D97706',
        linen: '#F9FAFB',
        charcoal: '#1F2937'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', 'Figtree', 'system-ui', 'sans-serif'],
        heading: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', 'Figtree', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace']
      },
      borderRadius: {
        xl: '12px'
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.05)'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        grow: {
          from: { transform: 'scale(0.95)', opacity: '0.5' },
          to: { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        grow: 'grow 0.6s ease-out'
      }
    }
  },
  plugins: []
};

export default config;

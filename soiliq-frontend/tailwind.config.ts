import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#3d1f0d',
        leaf: '#4a7c59',
        wheat: '#e8c547',
        linen: '#faf6f0',
        charcoal: '#1a1a1a'
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        mono: ['DM Mono', 'monospace']
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

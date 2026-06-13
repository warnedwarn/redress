import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14110e',
          950: '#100d0a',
          900: '#14110e',
          800: '#1c1813',
          700: '#272019',
          600: '#352c22',
        },
        cream: '#efe7d8',
        sand: '#c2b6a2',
        taupe: '#8a7d6b',
        terra: {
          DEFAULT: '#c4633f',
          bright: '#d97a52',
          deep: '#9c4626',
        },
        upheld: '#7c9c52',
        split: '#c99a3f',
        dismissed: '#a85a4a',
      },
      fontFamily: {
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        body: ['var(--font-worksans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-spline)', 'monospace'],
      },
      keyframes: {
        drawline: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        riseup: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulsechip: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        flashrule: {
          '0%': { borderColor: '#7c9c52', backgroundColor: 'rgba(124,156,82,0.12)' },
          '100%': { borderColor: '#352c22', backgroundColor: 'transparent' },
        },
      },
      animation: {
        drawline: 'drawline 1s ease-out forwards',
        riseup: 'riseup 0.5s ease-out forwards',
        pulsechip: 'pulsechip 1.5s ease-in-out infinite',
        flashrule: 'flashrule 1.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;

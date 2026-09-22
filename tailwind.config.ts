import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f1', 100: '#ffe0e0', 200: '#ffc6c6', 300: '#ff9d9d',
          400: '#ff6464', 500: '#f82f2f', 600: '#e51111', 700: '#c00d0d',
          800: '#9e1010', 900: '#831414', 950: '#470505',
        },
        ink: {
          50: '#f6f7f9', 100: '#eceef2', 200: '#d4d9e3', 300: '#aeb8ca',
          400: '#8291ac', 500: '#627392', 600: '#4d5c79', 700: '#3f4b62',
          800: '#374053', 900: '#181d27', 950: '#0b0e14',
        },
      },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] },
      spacing: { '4.5': '1.125rem', '18': '4.5rem' },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: { 'fade-up': 'fade-up .5s ease-out both', 'scale-in': 'scale-in .2s ease-out both' },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;

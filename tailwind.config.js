/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Noren palette — warm Japanese study aesthetic
        // Inspired by sigure.tw's cozy warmth + traditional stationery feel
        bg: { DEFAULT: '#FCF7F0', warm: '#FAF3EA' },
        surface: { DEFAULT: '#FFFDF7', hover: '#F8F0E8', dim: '#F5EDE3' },
        ink: { DEFAULT: '#3D2B1F', soft: '#6B5B4E', mute: '#9C8B7A', faint: '#C4B8A8' },
        accent: { DEFAULT: '#C0401A', soft: '#E8C8B0', pale: '#F5E0D0', hover: '#A03010' },
        amber: { DEFAULT: '#C4903E', light: '#D4A85E', pale: '#EDD8B0' },
        border: { DEFAULT: '#E8DCCF', light: '#F2ECE3', strong: '#D4C4B0' },
        pine: { DEFAULT: '#4A7C59', light: '#6D9A7C', pale: '#D8E8D8' },
        // Semantic
        success: '#4A7C59', warning: '#C4903E', error: '#C0401A', info: '#6B5B4E',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Inter', 'sans-serif'],
        serif: ['Noto Serif JP', 'Yu Mincho', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Noto Serif JP', 'serif'],
        mincho: ['Noto Serif JP', 'Yu Mincho', 'serif'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
        'xs': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'base': ['15px', { lineHeight: '1.7', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.8', fontWeight: '400' }],
        'lg': ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        'xl': ['20px', { lineHeight: '1.6', fontWeight: '600' }],
        'h3': ['22px', { lineHeight: '1.4', fontWeight: '700' }],
        'h2': ['26px', { lineHeight: '1.3', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'hero': ['40px', { lineHeight: '1.15', fontWeight: '700' }],
      },
      spacing: {
        'xs': '4px', 'sm': '8px', 'md': '16px', 'lg': '24px',
        'xl': '32px', '2xl': '48px', '3xl': '64px', '4xl': '96px',
      },
      borderRadius: {
        'sm': '6px', 'md': '10px', 'lg': '14px', 'xl': '18px', '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(61,43,31,0.06)',
        'card': '0 1px 3px rgba(61,43,31,0.06), 0 1px 2px rgba(61,43,31,0.04)',
        'card-hover': '0 4px 12px rgba(61,43,31,0.08), 0 2px 4px rgba(61,43,31,0.06)',
        'md': '0 4px 6px rgba(61,43,31,0.07)',
        'lg': '0 10px 25px rgba(61,43,31,0.08)',
        'elevated': '0 8px 30px rgba(61,43,31,0.08), 0 2px 8px rgba(61,43,31,0.06)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};

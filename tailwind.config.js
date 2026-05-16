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
        // Noren dark — warm ink-black background, cream text
        bg: { DEFAULT: '#14100C', warm: '#1A1511' },
        surface: { DEFAULT: '#231D18', hover: '#2A231D', dim: '#322A23' },
        ink: { DEFAULT: '#E8DDD0', soft: '#C4B8A8', mute: '#8C8275', faint: '#554C40' },
        accent: { DEFAULT: '#D96040', soft: '#4A2A1A', pale: '#3A1F10', hover: '#E87050' },
        amber: { DEFAULT: '#D4A85E', light: '#E0C080', pale: '#3A3020' },
        border: { DEFAULT: '#322A23', light: '#2A231D', strong: '#403830' },
        pine: { DEFAULT: '#6D9A7C', light: '#8AB89A', pale: '#2A3A2A' },
        success: '#6D9A7C', warning: '#D4A85E', error: '#D96040', info: '#8C8275',
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
        'sm': '0 1px 2px rgba(0,0,0,0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
        'md': '0 4px 6px rgba(0,0,0,0.35)',
        'lg': '0 10px 25px rgba(0,0,0,0.4)',
        'elevated': '0 8px 30px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
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

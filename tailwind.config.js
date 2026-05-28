/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design C — Duolingo-inspired bright, playful theme
        bg: { DEFAULT: '#FFFFFF', warm: '#F0F5FF' },
        surface: { DEFAULT: '#F5F7FA', hover: '#EBF0FF', dim: '#E5E7EB' },
        ink: { DEFAULT: '#1A1A2E', soft: '#6B7394', mute: '#9CA3AF', faint: '#D1D5DB' },
        accent: { DEFAULT: '#58CC02', soft: '#B8E6B8', pale: '#D6F0D6', hover: '#46A302' },
        amber: { DEFAULT: '#FF9500', light: '#FFB84D', pale: '#FFF4E6' },
        border: { DEFAULT: '#E5E7EB', light: '#F3F4F6', strong: '#D1D5DB' },
        pine: { DEFAULT: '#1CB0F6', light: '#6DD5FA', pale: '#F0F5FF' },
        success: '#58CC02', warning: '#FF9500', error: '#FF6B35', info: '#1CB0F6',
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
        'sm': '0 1px 2px rgba(26,26,46,0.06)',
        'card': '0 1px 3px rgba(26,26,46,0.08), 0 1px 2px rgba(26,26,46,0.04)',
        'card-hover': '0 4px 12px rgba(26,26,46,0.1), 0 2px 4px rgba(26,26,46,0.06)',
        'md': '0 4px 6px rgba(26,26,46,0.07)',
        'lg': '0 10px 25px rgba(26,26,46,0.1)',
        'elevated': '0 8px 30px rgba(26,26,46,0.12), 0 2px 8px rgba(26,26,46,0.08)',
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

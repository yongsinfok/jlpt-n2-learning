/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AI (Indigo - Primary)
        ai: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#2A4A7A',
          800: '#1E3557',
          900: '#132238',
          DEFAULT: '#2A4A7A',
        },
        // MATCHA (Green - Success)
        matcha: {
          50: '#F6F9F2',
          100: '#E9F0E0',
          200: '#D3E0C0',
          300: '#B4CC90',
          400: '#93B360',
          500: '#6B8E23',
          600: '#55721C',
          700: '#405615',
          DEFAULT: '#6B8E23',
        },
        // SHU (Red - Accent)
        shu: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#C8364E',
          700: '#A02B3E',
          DEFAULT: '#C8364E',
        },
        // KINCHA (Gold - Achievement)
        kincha: {
          50: '#FFFDF5',
          100: '#FFF7E0',
          200: '#FFE6B0',
          300: '#FFD480',
          400: '#FFC250',
          500: '#D4A547',
          600: '#AA8439',
          DEFAULT: '#D4A547',
        },
        // SUMI (Ink - Neutrals)
        sumi: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#2F353B',
          900: '#111827',
          DEFAULT: '#2F353B',
        },
        // WASHI (Backgrounds)
        washi: {
          white: '#FAFAF8',
          cream: '#F5F3EC',
          warm: '#F0EBE0',
          DEFAULT: '#FAFAF8',
        }
      },
      fontFamily: {
        display: ['Outfit', '"Zen Kaku Gothic New"', 'sans-serif'],
        sans: ['"Noto Sans JP"', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'serif'],
        jp: ['"Zen Kaku Gothic New"', '"Noto Sans JP"', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'h1': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'h2': ['clamp(1.5rem, 4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h3': ['clamp(1.25rem, 3vw, 1.875rem)', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'floating': '0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'seigaiha-subtle': "url(\"data:image/svg+xml,%3Csvg width='100' height='50' viewBox='0 0 100 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50a25 25 0 0 1 7.5-17.5 25 25 0 0 1 24.5-6.5 25 25 0 0 1 25 24H0zm82 0a25 25 0 0 1 7.5-17.5 25 25 0 0 1 24.5-6.5 25 25 0 0 1 7.5 17.5 25 25 0 0 1-7.5 17.5 25 25 0 0 1-24.5 6.5 25 25 0 0 1-7.5-17.5zm-25 0a25 25 0 0 1 7.5-17.5 25 25 0 0 1 24.5-6.5 25 25 0 0 1 7.5 17.5 25 25 0 0 1-7.5 17.5 25 25 0 0 1-24.5 6.5 25 25 0 0 1-7.5-17.5z' fill='%232A4A7A' fill-opacity='0.015'/%3E%3C/svg%3E\")",
        'asanoha': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232A4A7A' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-in': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

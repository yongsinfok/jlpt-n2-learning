/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 日本传统色彩 (Japanese Traditional Colors - Nihon Shikisai)
        ai: {
          50: '#F0F4F8',
          100: '#D9E9F3',
          200: '#B0D4E8',
          300: '#87B9DD',
          400: '#5E9ED2',
          DEFAULT: '#2A4A7A', // 藍色 - Indigo, primary color
          600: '#1F3A5F',
          700: '#142B4D',
          800: '#0A1C38',
          900: '#051026',
        },
        shu: {
          50: '#FDF0F2',
          100: '#FCD6DB',
          200: '#F9ADB7',
          300: '#F68593',
          400: '#F35C6F',
          DEFAULT: '#C8364E', // 朱色 - Vermilion/Crimson, accent
          600: '#A42B3F',
          700: '#802130',
          800: '#5C1721',
          900: '#390D13',
        },
        matcha: {
          50: '#F4F7ED',
          100: '#E9EFDB',
          200: '#D3DEC0',
          300: '#BCCD96',
          400: '#A6BC6D',
          DEFAULT: '#6B8E23', // 抹茶色 - Matcha green, progress
          600: '#5A7A1D',
          700: '#4A6617',
          800: '#3A5211',
          900: '#2B3D0C',
        },
        kincha: {
          50: '#FEF8F0',
          100: '#FDF0E0',
          200: '#FBE1C1',
          300: '#F9D1A2',
          400: '#F7C283',
          DEFAULT: '#D4A547', // 金茶色 - Gold tea, achievements
          600: '#C29338',
          700: '#B0822A',
          800: '#9E711C',
          900: '#8C600E',
        },
        sumi: {
          50: '#F5F5F6',
          100: '#EBEBED',
          200: '#D8D8DC',
          300: '#C5C5CB',
          400: '#B2B2BA',
          DEFAULT: '#2F353B', // 墨色 - Ink charcoal, text
          600: '#282D32',
          700: '#212428',
          800: '#1A1C1E',
          900: '#131415',
        },
        genji: {
          DEFAULT: '#F7F4ED', // 生成り色 - Natural white/cream, background
        },
        mugwasa: {
          DEFAULT: '#E8E4D9', // 麦わら色 - Straw, secondary background
        },
        // Semantic color aliases
        primary: {
          DEFAULT: '#2A4A7A',
          hover: '#1F3A5F',
          light: '#D9E9F3',
        },
        secondary: {
          DEFAULT: '#6B8E23',
          hover: '#5A7A1D',
          light: '#E9EFDB',
        },
        accent: {
          DEFAULT: '#C8364E',
          hover: '#A42B3F',
          light: '#FCD6DB',
        },
        success: {
          DEFAULT: '#6B8E23',
          light: '#E9EFDB',
        },
        warning: {
          DEFAULT: '#D4A547',
          light: '#FEF8F0',
        },
        error: {
          DEFAULT: '#C8364E',
          light: '#FDF0F2',
        },
      },
      fontFamily: {
        // Japanese typography
        serif: ['"Noto Serif JP"', '"Zen Mincho"', serif],
        sans: ['"Noto Sans JP"', '"Zen Kaku Gothic New"', sans-serif],
        maru: ['"Zen Maru Gothic"', sans-serif],
        // Vertical writing for decorative elements
        vertical: ['"Noto Serif JP"', vertical-rl, serif],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
      },
      backgroundImage: {
        // Traditional Japanese patterns
        'seigaiha': "url(\"data:image/svg+xml,%3Csvg width='80' height='40' viewBox='0 0 80 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40a19.96 19.96 0 0 1 5.9-14.11 20.17 20.17 0 0 1 19.44-5.2A20 20 0 0 1 20.2 40H0zM65.03.02a20.1 20.1 0 0 1 5.9 14.1 20.02 20.02 0 0 1-5.9 14.1 19.96 19.96 0 0 1-5.9-14.1 20.1 20.1 0 0 1 5.9-14.1zm-19.92 0a20.1 20.1 0 0 1 5.9 14.1 20.02 20.02 0 0 1-5.9 14.1 19.96 19.96 0 0 1-5.9-14.1 20.1 20.1 0 0 1 5.9-14.1zm-20 0a20.1 20.1 0 0 1 5.9 14.1 20.02 20.02 0 0 1-5.9 14.1 19.96 19.96 0 0 1-5.9-14.1 20.1 20.1 0 0 1 5.9-14.1z' fill='%232A4A7A' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        'asanoha': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 10L10 30l20 20 20-20-20-20z' fill='%232A4A7A' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        'washi': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        // Gradient overlays
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        // Soft shadows inspired by washi paper layers
        'washi-sm': '0 1px 3px rgba(47, 53, 59, 0.04), 0 1px 2px rgba(47, 53, 59, 0.02)',
        'washi': '0 4px 6px rgba(47, 53, 59, 0.04), 0 2px 4px rgba(47, 53, 59, 0.02)',
        'washi-md': '0 10px 15px rgba(47, 53, 59, 0.04), 0 4px 6px rgba(47, 53, 59, 0.02)',
        'washi-lg': '0 20px 25px rgba(47, 53, 59, 0.04), 0 10px 10px rgba(47, 53, 59, 0.02)',
        'ink-sm': '0 2px 4px rgba(47, 53, 59, 0.08)',
        'ink': '0 4px 8px rgba(47, 53, 59, 0.12)',
        'ink-md': '0 8px 16px rgba(47, 53, 59, 0.16)',
        'ink-lg': '0 16px 32px rgba(47, 53, 59, 0.20)',
        // Inner shadow for stamped effect
        'stamp': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        // Brush stroke animations
        'brush-stroke': 'brushStroke 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'stamp': 'stamp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        brushStroke: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        stamp: {
          '0%': { transform: 'scale(1.5) rotate(-15deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(-5deg)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

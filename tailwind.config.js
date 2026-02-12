/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Black & White
        primary: {
          DEFAULT: '#000000',
          light: '#1a1a1a',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          light: '#f8f9fa',
        },
        // Accent - Red
        accent: {
          DEFAULT: '#E53E3E',
          hover: '#c53030',
          light: '#fed7d7',
        },
        // Neutral colors
        neutral: {
          DEFAULT: '#F8F9FA',
          dark: '#666666',
          darker: '#212121',
        },
        // Avatar colors
        avatar: {
          1: '#4F46E5', // Indigo
          2: '#7C3AED', // Violet
        },
        // Japanese Color Palette
        // 靛蓝 - Indigo (Primary)
        ai: {
          DEFAULT: '#2A3F8F',
          light: '#3D54A8',
          lighter: '#5169C1',
          dark: '#1F2F6B',
          50: '#E8ECF8',
          100: '#D0DAF2',
          200: '#A8B8E5',
          300: '#7C96D8',
          400: '#5169C1',
          500: '#2A3F8F',
          600: '#1F2F6B',
          700: '#15204E',
          800: '#0A1629',
          900: '#000C14',
        },
        // 抹茶绿 - Matcha (Success)
        matcha: {
          DEFAULT: '#6B8E23',
          light: '#8AA83D',
          lighter: '#A9C256',
          dark: '#4A6318',
          50: '#F3F7E8',
          100: '#E7EFD1',
          200: '#CFDEA3',
          300: '#B7CE75',
          400: '#9EBE47',
          500: '#6B8E23',
          600: '#4A6318',
          700: '#2F3F0F',
          800: '#162006',
          900: '#000000',
        },
        // 樱花粉 - Sakura (Accent)
        sakura: {
          DEFAULT: '#FFB7C5',
          light: '#FFCAE0',
          lighter: '#FFDCEF',
          dark: '#E899AA',
          50: '#FFF5F7',
          100: '#FFEAF0',
          200: '#FFD5E1',
          300: '#FFC0D2',
          400: '#FFABC3',
          500: '#FFB7C5',
          600: '#E899AA',
          700: '#D17B8F',
          800: '#BA5D74',
          900: '#A33F59',
        },
        // 和紙色 - Washi (Neutral/Background)
        washi: {
          DEFAULT: '#F5F5DC',
          light: '#FAFAF0',
          lighter: '#FFFFFF',
          dark: '#E0E0C8',
          50: '#FDFFFA',
          100: '#FBFFF5',
          200: '#F7FFEB',
          300: '#F3FFE1',
          400: '#EFFFD7',
          500: '#F5F5DC',
          600: '#E0E0C8',
          700: '#CBCBB4',
          800: '#B6B6A0',
          900: '#A1A18C',
        },
        // 墨色 - Sumi (Dark/Text)
        sumi: {
          DEFAULT: '#1A1A1A',
          light: '#333333',
          lighter: '#4D4D4D',
          dark: '#000000',
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#DFDFDF',
          300: '#CFCFCF',
          400: '#BFBFBF',
          500: '#AFAFAF',
          600: '#8F8F8F',
          700: '#6F6F6F',
          800: '#4F4F4F',
          900: '#1A1A1A',
        },
        // 金色 - Gold (Highlight)
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E0C45A',
          lighter: '#ECD97D',
          dark: '#B8952F',
          50: '#FCF9EB',
          100: '#F9F3D7',
          200: '#F3E7AF',
          300: '#EDDB87',
          400: '#E7CF65',
          500: '#D4AF37',
          600: '#B8952F',
          700: '#9C7B27',
          800: '#80611F',
          900: '#644817',
        },
        // Semantic colors
        success: '#6B8E23',
        warning: '#D4AF37',
        error: '#E899AA',
        info: '#2A3F8F',

        // Border colors
        border: {
          DEFAULT: '#E0E0C8',
          light: '#F3FFE1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      fontSize: {
        // MUCH LARGER font sizes for better readability
        'logo': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],  // Was 20px
        'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],  // Was 16px
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],  // Was 14px
        'body': ['17px', { lineHeight: '1.7', fontWeight: '400' }], // Was 14px
        'small': ['15px', { lineHeight: '1.6', fontWeight: '400' }], // Was 12px
        'xs': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        'xs': '8px',   // Increased from 4px
        'sm': '12px',  // Increased from 8px
        'md': '20px',  // Increased from 16px
        'lg': '32px',  // Increased from 24px
        'xl': '48px',  // Increased from 32px
        '2xl': '64px', // Increased from 48px
        '3xl': '96px', // New
        '4xl': '128px', // New
      },
      borderRadius: {
        'sm': '8px',   // Increased from 4px
        'md': '12px',  // Increased from 8px
        'lg': '16px',  // Increased from 12px
        'xl': '20px',  // Increased from 16px
        '2xl': '28px', // Increased from 24px
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
      },
      maxWidth: {
        '8xl': '90rem', // Wider than 7xl (80rem)
        '9xl': '95rem',
        'full': '100%',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-up': 'scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'bounce 1s ease-in-out',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}

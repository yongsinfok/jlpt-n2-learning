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
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Border colors
        border: {
          DEFAULT: '#E5E7EB',
          light: '#F3F4F6',
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

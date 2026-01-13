/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary gradient colors
        primary: {
          DEFAULT: '#667eea',
          dark: '#5a67d8',
          light: '#7f9cf5',
        },
        // Secondary gradient colors
        secondary: {
          DEFAULT: '#764ba2',
          dark: '#6b46c1',
          light: '#9f7aea',
        },
        // Accent colors
        accent: {
          DEFAULT: '#f093fb',
          dark: '#d53f8c',
          light: '#f687b3',
        },
        // Semantic colors
        success: '#48bb78',
        warning: '#ed8936',
        error: '#f56565',
        info: '#4299e1',

        // Neutral colors
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },

        // Text colors
        text: {
          primary: '#1a1a2e',
          secondary: '#4a4a68',
          muted: '#9ca3af',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['clamp(1.25rem, 3vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['clamp(1rem, 2.5vw, 1.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.625rem',
        'lg': '0.875rem',
        'xl': '1.25rem',
        '2xl': '1.75rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(102, 126, 234, 0.4)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-hero': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-accent': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      },
      animation: {
        'modern-fade': 'modernFadeIn 0.6s cubic-bezier(0, 0, 0.2, 1) forwards',
        'modern-scale': 'modernScale 0.4s cubic-bezier(0, 0, 0.2, 1) forwards',
        'modern-slide': 'modernSlide 0.5s cubic-bezier(0, 0, 0.2, 1) forwards',
        'gradient': 'gradientShift 8s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        modernFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modernScale: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        modernSlide: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

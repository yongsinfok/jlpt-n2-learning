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
          700: '#2A4A7A', // Main Brand Color
          800: '#1E3557',
          900: '#132238',
          DEFAULT: '#2A4A7A',
        },
        // MATCH (Green - Success/Progress)
        matcha: {
          50: '#F6F9F2',
          100: '#E9F0E0',
          200: '#D3E0C0',
          300: '#B4CC90',
          400: '#93B360',
          500: '#6B8E23',
          600: '#55721C',
          700: '#405615',
          800: '#2B3A0E',
          900: '#151D07',
          DEFAULT: '#6B8E23',
        },
        // SHU (Red - Accent/Attention)
        shu: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#C8364E',
          700: '#A02B3E',
          800: '#78202F',
          900: '#50151F',
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
          700: '#80632B',
          800: '#55421D',
          900: '#2B210E',
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
          DEFAULT: '#FCFCFA',
          cream: '#F7F4ED',
          dark: '#E8E4D9',
        }
      },
      fontFamily: {
        sans: ['Outfit', '"Noto Sans JP"', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'serif'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
      },
      boxShadow: {
        'paper-sm': '0 1px 2px 0 rgba(47, 53, 59, 0.05)',
        'paper-md': '0 4px 6px -1px rgba(47, 53, 59, 0.05), 0 2px 4px -1px rgba(47, 53, 59, 0.03)',
        'paper-lg': '0 10px 15px -3px rgba(47, 53, 59, 0.05), 0 4px 6px -2px rgba(47, 53, 59, 0.02)',
      },
      backgroundImage: {
        'seigaiha': "url(\"data:image/svg+xml,%3Csvg width='80' height='40' viewBox='0 0 80 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40a19.96 19.96 0 0 1 5.9-14.11 20.17 20.17 0 0 1 19.44-5.2A20 20 0 0 1 20.2 40H0zM65.03.02a20.1 20.1 0 0 1 5.9 14.1 20.02 20.02 0 0 1-5.9 14.1 19.96 19.96 0 0 1-5.9-14.1 20.1 20.1 0 0 1 5.9 14.1zm-19.92 0a20.1 20.1 0 0 1 5.9 14.1 20.02 20.02 0 0 1-5.9 14.1 19.96 19.96 0 0 1-5.9-14.1 20.1 20.1 0 0 1 5.9 14.1zm-20 0a20.1 20.1 0 0 1 5.9 14.1 20.02 20.02 0 0 1-5.9 14.1 19.96 19.96 0 0 1-5.9-14.1 20.1 20.1 0 0 1 5.9 14.1z' fill='%232A4A7A' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        'asanoha': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232A4A7A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}


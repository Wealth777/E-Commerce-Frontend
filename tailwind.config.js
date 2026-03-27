/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  // Safelist dynamic classes used in JS templates (ensures they're not purged)
  safelist: [
    {
      pattern: /bg-(green|yellow|red|blue|gray)-(100|200|300|400|500|600|700|800)/,
      variants: ['hover', 'dark']
    },
    {
      pattern: /text-(green|yellow|red|blue|gray)-(100|200|300|400|500|600|700|800)/,
      variants: ['dark']
    },
    'bg-white',
    'text-white',
    'bg-gray-100',
    'bg-gray-700',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#008000',
          yellow: '#FFD700',
          red: '#DC2626',
          dark: '#1F2937',
          light: '#F9FAFB'
        },
        accent: {
          green: '#10B981',
          yellow: '#FBBF24',
          red: '#EF4444'
        }
      },
      fontFamily: {
        'mono': ['Atkinson Hyperlegible Mono', 'monospace'],
        'sans': ['Lato', 'sans-serif'],
        'heading': ['Montserrat', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};

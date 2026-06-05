/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        claret: {
          200: '#f9a8c4',
          400: '#f472a0',
          600: '#d92055',
          700: '#b91542',
          800: '#6C1D45',
          900: '#5a1239',
          950: '#3b0a25',
        },
        gold: {
          400: '#F5C842',
          500: '#E8B800',
          600: '#C49A00',
        },
        dark: {
          500: '#2d2d2d',
          600: '#222222',
          700: '#1a1a1a',
          800: '#111111',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'claret-gradient': 'linear-gradient(135deg, #6C1D45 0%, #3b0a25 100%)',
      },
    },
  },
  plugins: [],
};

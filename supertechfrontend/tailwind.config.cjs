/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: '#FF6B35',
          50: '#fff7f3',
          100: '#ffe4d6',
          200: '#ffc9ad',
          300: '#ffae84',
          400: '#ff935b',
          500: '#FF6B35',
          600: '#e55c2b',
          700: '#cc4d21',
          800: '#b33e17',
          900: '#8a2f11',
        },
        blue: {
          light: '#4FC3F7',
          50: '#f3f9fc',
          100: '#e3f2fd',
          200: '#bbdefb',
          300: '#90caf9',
          400: '#64b5f6',
          500: '#4FC3F7',
          600: '#42a5f5',
          700: '#2196f3',
          800: '#1976d2',
          900: '#1565c0',
        },
      },
      fontFamily: {
        sans: ['Catamaran', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff7f00',
        'primary-dark': '#cc6600',
        'primary-light': '#ffa64d',
      }
    },
  },
  plugins: [],
};
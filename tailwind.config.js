/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './providers/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f9f1',
          100: '#e6f3e0',
          200: '#c6e3bb',
          300: '#a4d393',
          400: '#82c36f',
          500: '#6FA25F', // your main primary color
          600: '#5e8c52',
          700: '#4d7544',
          800: '#3c5d36',
          900: '#2b4628',
          950: '#1a2d18',
        },
        secondary: {
          50: '#fff6ef',
          100: '#ffe8d6',
          200: '#ffd0ae',
          300: '#ffb280',
          400: '#fa9557',
          500: '#F38744', // your main secondary color
          600: '#d3723a',
          700: '#b15e31',
          800: '#8f4b27',
          900: '#6b371d',
          950: '#3f1f10',
        },
      },
    },
  },
  plugins: [],
};

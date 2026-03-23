/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          dark: '#0d0d0d',
          card: '#141414',
          border: '#262626',
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#14181c',
          card: '#1b2228',
          border: '#2c3440',
          accent: '#00e054',
          accentHover: '#00b343',
          muted: '#8e9da8',
          orange: '#ff8000',
          blue: '#40bcf4',
        }
      }
    },
  },
  plugins: [],
}

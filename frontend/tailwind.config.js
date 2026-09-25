/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        visagio: {
          bg: '#F4F4F4',
          card: '#FFFFFF',
          black: '#0F0E0E',
          yellow: '#FFD45A',
          yellowHover: '#E6BF48',
          yellowLight: '#FFF8E1',
          muted: '#666666',
          border: '#E5E5E5',
          inputBorder: '#D4D4D4',
        },
      },
    },
  },
  plugins: [],
};

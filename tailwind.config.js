/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: 'class', 
  content: [
    "./index.html",              // ✅ for Vite root file
    "./src/**/*.{js,ts,jsx,tsx}" // ✅ for all your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

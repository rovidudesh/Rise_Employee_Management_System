
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
      colors: {
        brandPurple: '#30038C',
        hoverPurple: '#8777a6'
      }
    },
  },
  plugins: [],
}

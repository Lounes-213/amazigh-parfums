/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: '#0a0a0a',
        charbon: '#171717',
        anthracite: '#262626',
        or: {
          light: '#dfb76c',
          DEFAULT: '#C8A34D',
          dark: '#9a7b2c',
        },
        ivoire: '#faf7f2',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(200, 163, 77, 0.25)',
        'gold-lg': '0 10px 25px -3px rgba(200, 163, 77, 0.35)',
      }
    },
  },
  plugins: [],
}

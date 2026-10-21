/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#080808',
          DEFAULT: '#101010',
          800: '#181818',
          700: '#222222',
        },
        charbon: {
          DEFAULT: '#292929',
          light: '#383838',
          dark: '#1e1e1e',
        },
        or: {
          50: '#faf6ee',
          100: '#f3ebd6',
          200: '#e7cf8c',
          300: '#dfbe6a',
          DEFAULT: '#C8A34D',
          dark: '#9d7a2b',
          glow: 'rgba(200, 163, 77, 0.35)',
        },
        ivoire: {
          DEFAULT: '#F4EFE5',
          muted: '#ded7c8',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['Montserrat', 'Inter', 'sans-serif'],
        arabic: ['"Amiri"', '"Tajawal"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #dfbe6a 0%, #C8A34D 50%, #9d7a2b 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C8A34D 0%, #fff2cf 50%, #C8A34D 100%)',
        'noir-gradient': 'linear-gradient(180deg, rgba(16,16,16,0.6) 0%, rgba(10,10,10,0.95) 100%)',
      },
      boxShadow: {
        'gold': '0 0 25px rgba(200, 163, 77, 0.25)',
        'gold-lg': '0 0 45px rgba(200, 163, 77, 0.35)',
        'noir': '0 20px 50px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        baby: { pink: '#FADADD', 'pink-deep': '#F0B8BC', blue: '#CDE7FF', 'blue-deep': '#9DCFFF' },
        cream: { DEFAULT: '#FFF5E1', light: '#FFFAF0', dark: '#F5E6C8' },
        lavender: { DEFAULT: '#E6D6FF', light: '#F0EAFF', deep: '#C9B3F0' },
        brand: { dark: '#0F0818', medium: '#312340', light: '#5C4B70', muted: '#9286A5', warm: '#C68B50' },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        soft: '0 8px 30px -4px rgba(15,8,24,0.12), 0 4px 15px -2px rgba(15,8,24,0.06)',
        'soft-lg': '0 15px 50px -8px rgba(15,8,24,0.2)',
        'soft-xl': '0 30px 80px -12px rgba(15,8,24,0.25)',
        pink: '0 12px 45px -10px rgba(250,218,221,0.8)',
        glow: '0 0 60px rgba(198,139,80,0.4)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FFF8EB 0%, #FFDFE3 30%, #D8ECFF 70%, #EFE6FF 100%)',
        'card-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #FFF8EB 100%)',
        'section-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      }
    },
  },
  plugins: [],
}

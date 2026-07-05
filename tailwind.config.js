/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a14',
        surface: '#13131f',
        elevated: '#1b1b2c',
        elevated2: '#22223a',
        border: 'rgba(255,255,255,0.08)',
        accent: {
          DEFAULT: '#8b5cf6',
          blue: '#4f7cff',
          deep: '#5b21b6',
        },
        star: '#fbbf24',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 45%, #1d4ed8 100%)',
        'accent-gradient': 'linear-gradient(135deg, #7c3aed 0%, #4f7cff 100%)',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.35)',
        glow: '0 0 24px rgba(139, 92, 246, 0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}

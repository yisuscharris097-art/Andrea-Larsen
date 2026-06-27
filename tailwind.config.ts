import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        paper: '#faf9f7',
        ink: '#1a1714',
        ox: '#7a1f1b',
        gold: '#b08a45',
      },
    },
  },
  plugins: [],
};

export default config;

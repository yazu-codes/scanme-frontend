import preline from 'preline/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/preline/dist/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F1DEC4',
          50: '#FBF6EE',
          100: '#F6ECDC',
          200: '#F1DEC4',
        },
        primary: {
          50: '#FBEDED',
          100: '#F5D6D6',
          300: '#D68989',
          500: '#BD4444',
          600: '#A83B3B',
          700: '#8C3333',
          900: '#5C2222',
        },
        secondary: {
          50: '#EEF3EC',
          100: '#DCE7D8',
          300: '#9BB593',
          500: '#73976A',
          600: '#677E61',
          700: '#516350',
          800: '#33402D',
          900: '#263020',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [preline],
};

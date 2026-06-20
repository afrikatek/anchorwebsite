import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F1F5F8',
          100: '#E2EBF1',
          200: '#BCD0DF',
          300: '#88A8C4',
          400: '#5283AB',
          500: '#2C6394',
          600: '#1D4E7A',
          700: '#143A60',
          800: '#0E3050',
          900: '#0A2540',
          950: '#061726',
        },
        silver: '#C4C9CF',
        ink: {
          200: '#CDD4D9',
          300: '#A9B3BB',
          400: '#7E8C96',
          500: '#5A6B76',
          600: '#42535F',
          700: '#2C3E4D',
          800: '#172838',
          900: '#0B1A29',
        },
        line: { DEFAULT: '#E4E8EB', 2: '#D3D9DE' },
        paper: '#FFFFFF',
        bone: '#F6F8F9',
        mist: '#EDF1F3',
      },
      fontFamily: {
        sans: ['Google Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['EB Garamond', 'Iowan Old Style', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      maxWidth: {
        wrap: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;

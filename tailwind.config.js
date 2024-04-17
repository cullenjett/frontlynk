/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        'burnt-sienna': {
          50: '#fdf4ef',
          100: '#fae6da',
          200: '#f4cbb4',
          300: '#eda784',
          400: '#e57c55',
          DEFAULT: '#e57c55',
          500: '#de5931',
          600: '#d04126',
          700: '#ad3121',
          800: '#8a2922',
          900: '#70241e',
          950: '#3c100e'
        },
        shark: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d8d8df',
          300: '#b7b8c2',
          400: '#8f90a1',
          500: '#727485',
          600: '#5c5d6d',
          700: '#4b4c59',
          800: '#40414c',
          900: '#393941',
          950: '#2d2d34',
          DEFAULT: '#2d2d34'
        },
        mirage: {
          50: '#edf6ff',
          100: '#def0ff',
          200: '#c4e2ff',
          300: '#a0ceff',
          400: '#7aaeff',
          500: '#5a8ffa',
          600: '#3c67ef',
          700: '#2f54d3',
          800: '#2948aa',
          900: '#294286',
          950: '#0d142a',
          DEFAULT: '#0d142a'
        },
        'jordy-blue': {
          50: '#f2f7fc',
          100: '#e2eef7',
          200: '#cce1f1',
          300: '#a9cee7',
          400: '#7bb2d9',
          DEFAULT: '#7bb2d9',
          500: '#619ad0',
          600: '#4e82c2',
          700: '#436fb2',
          800: '#3c5c91',
          900: '#344e74',
          950: '#243147'
        },
        'blue-chill': {
          50: '#f3faf9',
          100: '#d8efed',
          200: '#b2ddda',
          300: '#83c5c2',
          400: '#59a8a7',
          500: '#3e8989',
          DEFAULT: '#3e8989',
          600: '#316e70',
          700: '#2a5a5b',
          800: '#25494a',
          900: '#233d3e',
          950: '#0f2324'
        },
        'regal-blue': {
          50: '#ebfaff',
          100: '#d2f4ff',
          200: '#aeedff',
          300: '#77e5ff',
          400: '#37d3ff',
          500: '#09b3ff',
          600: '#008eff',
          700: '#0075ff',
          800: '#0060d6',
          900: '#0155a7',
          950: '#083d77',
          DEFAULT: '#083d77'
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

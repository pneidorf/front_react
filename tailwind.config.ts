import type { Config } from 'tailwindcss'

const fontSize = {
  xs: '10px',
  sm: '11px',
  base: '12px',
  lg: '14px',
  xl: '18px'
}
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      phone: { max: '640px' },
      // => @media (min-width: 640px) { ... }

      laptop: '1024px',
      // => @media (min-width: 1024px) { ... }

      tablet: '761px',

      'desktop-s': '912px',
      // => @media (min-width: 912px) { ... }

      desktop: '1380px',
      // => @media (min-width: 1380px) { ... }

      'desktop-l': '1920px',
      // => @media (min-width: 1920px) { ... }

      'desktop-xl': '2000px',
      // => @media (min-width: 2000px) { ... }
      'desktop-2xl': '3000px'
      // => @media (min-width: 3000px) { ... }
    },
    fontSize,
    extend: {
      borderRadius: {
        default: '8px'
      },
      textColor: {
        primary: 'var(--gray-12)',
        secondary: 'var(--gray-11)',
        tertiary: 'var(--gray-9)',
        link: 'var(--blue-10)'
      },
      backgroundColor: {
        contrast: 'var(--contrast-color)',
        primary: 'var(--gray-1)',
        secondary: 'var(--gray-2)',
        tertiary: 'var(--gray-3)',
        accent: 'var(--blue-9)'
      },
      borderColor: {
        primary: 'var(--gray-6)',
        secondary: 'var(--gray-3)'
      },
      ringColor: {
        primary: 'var(--gray-6)',
        secondary: 'var(--gray-3)'
      },
      fill: {
        primary: 'var(--gray-1)',
        secondary: 'var(--gray-2)',
        tertiary: 'var(--gray-3)',
        accent: 'var(--blue-9)'
      },
      boxShadow: {}
    }
  },
  plugins: []
}

export default config

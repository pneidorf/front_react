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
      boxShadow: {
        soft: '0 15px 30px 0 rgba(0, 0, 0, 0.04)',
        sidebar: '1px 0 0 0 #2b2f3c'
      }
    }
  },
  plugins: []
}

export default config

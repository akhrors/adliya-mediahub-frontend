import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E3A5F', light: '#2D5286', dark: '#152B47' },
        accent:  { DEFAULT: '#D4A017', light: '#E8B420' },
      },
    },
  },
  plugins: [],
}
export default config

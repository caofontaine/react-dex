import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['PocketMonk', 'sans-serif'],
        body: ['OpenSans', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        pokedex: {
          red: '#cc0000',
          blue: '#2a75bb',
          yellow: '#ffcb05',
          gold: '#ffde00',
          navy: '#1b2a57'
        }
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(15, 23, 42, 0.45)'
      }
    }
  },
  plugins: []
} satisfies Config;

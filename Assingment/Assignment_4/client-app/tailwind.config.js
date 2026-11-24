/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-rail': '#121212',
        'sidebar': '#171717',
        'main-chat': '#141414',
        'right-panel': '#171717',
        'surface-elevated': '#242424',
        'surface-hover': '#2A2A2A',
        'bubble-incoming': '#262626',
        'bubble-outgoing': '#333333',
        'send-btn': '#525252',
        'border-subtle': '#262626',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A3A3A3',
        'text-muted': '#737373',
        'status-online': '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

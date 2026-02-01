/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
          5: 'rgba(37, 99, 235, 0.05)',
          10: 'rgba(37, 99, 235, 0.1)',
          20: 'rgba(37, 99, 235, 0.2)',
          50: 'rgba(37, 99, 235, 0.5)',
        },
        accent: {
          DEFAULT: '#eab308',
          foreground: '#000000',
        },
        background: '#0a0a0a',
        card: '#1a1a1a',
        muted: '#1f1f1f',
        foreground: '#ffffff',
        'muted-foreground': '#a0a0a0',
        border: '#2a2a2a',
        input: '#1a1a1a',
        ring: '#2563eb',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

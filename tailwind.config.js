/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Godavari river base
        navy: {
          DEFAULT: '#06141f',
          deep: '#0b2433',
        },
        river: {
          deep: '#073b4c',
          DEFAULT: '#087ea4',
          light: '#38bdf8',
        },
        // Temple / Pushkaralu warmth
        saffron: {
          DEFAULT: '#f59e0b',
          light: '#ffb52e',
        },
        gold: {
          DEFAULT: '#d4a72c',
          light: '#f6d365',
        },
        // Andhra cultural tones
        terracotta: {
          DEFAULT: '#a84b2a',
          light: '#d2693c',
        },
        kumkum: '#c0392b',
        // Warm text
        cream: '#fffaf0',
      },
      fontFamily: {
        heading: ['Cinzel', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/* @type {import('tailwindcss').Config} */
/*export default {
  content: [
    "./index.html",
    "./src/**.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}*/

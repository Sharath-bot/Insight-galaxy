/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          // Admin Theme (Slate)
          slate: '#1e293b', 
          // Researcher Theme (Purple)
          purple: '#581c87',
          // Explorer Theme (Emerald)
          emerald: '#065f46',
        }
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // Extra small screen at 480px or below [2, 7]
      }
    },
  },
  plugins: [],
}


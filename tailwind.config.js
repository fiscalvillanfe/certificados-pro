/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#F2F6FF",
          100: "#E6EEFF",
          200: "#C9DBFF",
          300: "#A7C3FF",
          400: "#7BA2FF",
          500: "#4C7CFF",
          600: "#315DF0",
          700: "#2749C6",
          800: "#203CA0",
          900: "#1B317F",
        },
      },
    },
  },
  plugins: [],
};

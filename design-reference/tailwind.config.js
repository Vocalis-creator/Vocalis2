export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        "navy": {
          900: "#0A1929",
          800: "#0F2942",
          700: "#14385C",
          600: "#1A4775",
          500: "#1F568F"
        },
        "gold": {
          300: "#F3D9A4",
          400: "#E7C989",
          500: "#D4B46E",
          600: "#C09C53",
          700: "#A88438"
        }
      },
      fontFamily: {
        serif: ['Arial', 'Calibri', 'sans-serif'],
        sans: ['Arial', 'Calibri', 'sans-serif']
      }
    }
  }
}
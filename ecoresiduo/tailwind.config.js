/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./*.html",                    // todos los HTML en la raíz
    "./src/**/*.{js,ts,jsx,tsx}"   // todos los JS dentro de src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

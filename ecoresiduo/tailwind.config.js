/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./main.html",
    "./mapa.html",
    "./consejos.html",
    "./perfil.html",
    "./register.html",
    "./estadistica.html",
    "./admin-events.html",
    "./rutas.html",
    "./*.html",                    // todos los HTML en la raíz
    "./src/**/*.{js,ts,jsx,tsx}"   // todos los JS dentro de src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

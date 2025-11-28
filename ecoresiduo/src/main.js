// src/main.js
document.addEventListener("DOMContentLoaded", async () => {
  console.log("⏳ Verificando sesión...");

  try {
    const res = await fetch("http://localhost:3000/usuarios/session", {
      credentials: "include",
    });

    const data = await res.json();
    console.log("SESSION RESPONSE:", data);

    if (!data.ok) {
      console.log("🔴 Sin sesión → Redirigiendo...");
      window.location.href = "/usuarios/login.html";
      return;
    }

    console.log("🟢 Sesión válida:", data.user);

  } catch (err) {
    console.error("ERROR FETCH SESSION:", err);
    window.location.href = "/usuarios/login.html";
  }
});



import "./style.css";
import { createIcons, icons } from "lucide";

document.addEventListener("DOMContentLoaded", async () => {

  // --------------------------------------------------------------------
  // 🔥 VERIFICAR SESIÓN SOLO CON LA COOKIE JWT
  // --------------------------------------------------------------------
  try {
    const res = await fetch("http://localhost:3000/usuarios/session", {
      credentials: "include",  // ENVÍA LA COOKIE
    });

    const data = await res.json();
    console.log("SESSION:", data);

    if (!data.ok) {
      // No hay sesión válida → volver al login
      window.location.href = "/usuarios/login.html";
      return;
    }

    // Usuario autenticado
    const user = data.user;

    // Mostrar datos del usuario
    const nameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("userAvatar");
    const emailEl = document.getElementById("userEmail");

    if (nameEl) nameEl.textContent = user.nombre || "Usuario";
    if (emailEl) emailEl.textContent = user.email || "";
    if (avatarEl) avatarEl.src = "/public/assets/default-avatar.png";

  } catch (err) {
    console.error("Error verificando sesión:", err);
    window.location.href = "/usuarios/login.html";
    return;
  }

  // --------------------------------------------------------------------
  // LOGOUT SOLO BORRA LA COOKIE EN EL SERVIDOR
  // --------------------------------------------------------------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await fetch("http://localhost:3000/usuarios/logout", {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/usuarios/login.html";
    });
  }

  // --------------------------------------------------------------------
  // ICONOS
  // --------------------------------------------------------------------
  try {
    createIcons({ icons });
  } catch (err) {
    console.error("❌ Error inicializando Lucide:", err);
  }

  // --------------------------------------------------------------------
  // MODO OSCURO
  // --------------------------------------------------------------------
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) applyTheme(savedTheme);

  const toggleBtn = document.getElementById("toggleDark");

  function setToggleIcon(isDark) {
    const iconEl = toggleBtn.querySelector("[data-lucide]");
    iconEl.setAttribute("data-lucide", isDark ? "sun" : "moon");
    createIcons({ icons });
  }

  setToggleIcon(document.documentElement.classList.contains("dark"));

  toggleBtn.addEventListener("click", () => {
    const isDarkNow = document.documentElement.classList.toggle("dark");
    if (isDarkNow) document.body.classList.add("dark");
    else document.body.classList.remove("dark");

    localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    setToggleIcon(isDarkNow);
  });

  // --------------------------------------------------------------------
  // TARJETAS DE CATEGORÍAS
  // --------------------------------------------------------------------
  const categories = [
    { name: "Orgánicos", description: "Restos de comida, cáscaras, yerba mate, residuos biodegradables.", icon: "apple" },
    { name: "Plásticos", description: "Botellas, envases, tapitas, envoltorios limpios.", icon: "recycle" },
    { name: "Vidrio", description: "Botellas de vidrio, frascos, envases sin tapa.", icon: "wine" },
    { name: "Papel y Cartón", description: "Hojas, cajas limpias, cuadernos, diarios.", icon: "file-text" },
    { name: "Metales", description: "Latas, aluminio, envases metálicos.", icon: "package" },
    { name: "Residuos peligrosos", description: "Pilas, electrónicos, aceites, medicamentos.", icon: "alert-triangle" }
  ];

  const container = document.getElementById("categoriesContainer");
  container.innerHTML = "";

  categories.forEach(cat => {
    const card = document.createElement("div");
    card.className =
      "p-6 bg-white dark:bg-gray-800 shadow rounded-2xl hover:shadow-xl transition border border-gray-200 dark:border-gray-700";

    card.innerHTML = `
      <i data-lucide="${cat.icon}" class="w-10 h-10 mb-4 text-green-600 dark:text-green-400"></i>
      <h3 class="text-xl font-bold mb-2">${cat.name}</h3>
      <p class="text-gray-600 dark:text-gray-300">${cat.description}</p>
    `;
    container.appendChild(card);
  });

  createIcons({ icons });
});

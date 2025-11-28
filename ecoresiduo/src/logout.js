// src/logout.js

/**
 * Cierra la sesión del usuario.
 * Limpia localStorage, intenta invalidar la cookie y redirige sin mostrar alertas.
 */

async function logoutUser() {
  try {
    // 1️⃣ Eliminar datos locales del usuario
    localStorage.removeItem("ecoresiduos_user");

    // 2️⃣ Intentar llamar al backend (si existe)
    await fetch("http://localhost:3000/usuarios/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      // No hacemos nada si falla: la sesión local ya fue cerrada
      console.warn("No se pudo contactar al servidor para cerrar sesión.");
    });

  } finally {
    // 3️⃣ Redirigir SIEMPRE sin alertas
    window.location.href = "/login.html";
  }
}

export { logoutUser };

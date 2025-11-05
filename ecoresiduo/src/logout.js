// src/logout.js

/**
 * Script para cerrar la sesión del usuario en EcoResiduos.
 * Limpia localStorage, elimina la cookie authToken (si el backend lo soporta)
 * y redirige al login.
 */

async function logoutUser() {
  try {
    // 1️⃣ Eliminar datos locales del usuario
    localStorage.removeItem("ecoresiduos_user");

    // 2️⃣ Intentar eliminar la cookie del backend (si existe un endpoint /logout)
    await fetch("http://localhost:3000/usuarios/logout", {
      method: "POST",
      credentials: "include", // importante para enviar la cookie
    });

    console.log("Sesión finalizada correctamente.");

    // 3️⃣ Redirigir al login
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión correctamente.");
  }
}

// ✅ Exportar función si querés usarla desde un botón o evento
export { logoutUser };

// ✅ También podés activarlo directamente al cargar (opcional):
// logoutUser();

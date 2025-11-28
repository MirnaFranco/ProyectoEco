import './style.css';
// Obtener elementos
const welcome = document.getElementById("welcomeAdmin");
const userTable = document.getElementById("userTable");
const logoutBtn = document.getElementById("logoutBtn");

// 1️⃣ VALIDAR SESIÓN DEL ADMIN ANTES DE MOSTRAR TODO
async function validarSesion() {
  try {
    const res = await fetch("http://localhost:3000/usuarios/session", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();

    if (!data.ok) {
      // No hay sesión → FUERA
      return window.location.href = "/login.html";
    }

    const role = data.user.role;

    if (role !== "administrador") {
      // No sos admin → FUERA
      return window.location.href = "/login.html";
    }

    // ✔️ Sesión válida → Mostramos bienvenida
    welcome.textContent = `¡Bienvenido, Administrador!`;

    // Cargar tabla de usuarios
    cargarUsuarios();

  } catch (error) {
    console.error("Error verificando sesión:", error);
    window.location.href = "/login.html";
  }
}

// 2️⃣ FUNCIÓN PARA CARGAR LA TABLA
async function cargarUsuarios() {
  try {
    const res = await fetch("http://localhost:3000/usuarios", {
      credentials: "include"
    });
    const users = await res.json();

    userTable.innerHTML = users.map(u => `
      <tr>
        <td class="border border-gray-300 px-4 py-2">${u.id}</td>
        <td class="border border-gray-300 px-4 py-2">${u.nombre}</td>
        <td class="border border-gray-300 px-4 py-2">${u.email}</td>
        <td class="border border-gray-300 px-4 py-2">${u.rol}</td>
      </tr>
    `).join("");

  } catch (err) {
    console.error("Error al obtener usuarios:", err);
  }
}

// 3️⃣ LOGOUT
logoutBtn.addEventListener("click", async () => {
  await fetch("http://localhost:3000/usuarios/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "/login.html";
});

// Ejecutar validación al cargar
validarSesion();

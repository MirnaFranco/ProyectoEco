import './style.css';
// Obtener elementos
const welcome = document.getElementById("welcomeAdmin");
const userTable = document.getElementById("userTable");
const logoutBtn = document.getElementById("logoutBtn");
const mensajeError = document.getElementById("mensajeError");

// ✅ Validar sesión del admin al cargar
async function validarSesion() {
  try {
    const res = await fetch("http://localhost:3000/usuarios/session", {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();

    if (!data.ok || data.user.role !== "administrador") {
      return window.location.href = "/login.html";
    }

    welcome.textContent = `¡Bienvenido, ${data.user.email}!`;

    cargarUsuarios();

  } catch (error) {
    console.error("Error verificando sesión:", error);
    window.location.href = "/login.html";
  }
}

// ✅ Cargar tabla de usuarios
async function cargarUsuarios() {
  try {
    const res = await fetch("http://localhost:3000/usuarios", {
      credentials: "include"
    });
    const users = await res.json();

    userTable.innerHTML = users.map(u => `
      <tr>
        <td class="border px-4 py-2">${u.id}</td>
        <td class="border px-4 py-2">${u.nombre}</td>
        <td class="border px-4 py-2">${u.email}</td>
        <td class="border px-4 py-2">${u.rol}</td>
        <td class="border px-4 py-2 space-x-2">
          <button class="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded" onclick="editarUsuario(${u.id})">Editar</button>
          <button class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded" onclick="eliminarUsuario(${u.id})">Eliminar</button>
        </td>
      </tr>
    `).join("");

  } catch (err) {
    mostrarError("Error al cargar usuarios.");
    console.error(err);
  }
}

// ✅ Función para mostrar errores
function mostrarError(msg) {
  mensajeError.textContent = msg;
  mensajeError.classList.remove("hidden");
  setTimeout(() => mensajeError.classList.add("hidden"), 5000);
}

// ✅ Editar usuario
async function editarUsuario(id) {
  const nuevoNombre = prompt("Ingrese el nuevo nombre del usuario:");
  if (!nuevoNombre) return;

  try {
    const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevoNombre })
    });
    const data = await res.json();

    if (!data.ok) return mostrarError(data.mensaje);

    cargarUsuarios();
  } catch (err) {
    mostrarError("Error al actualizar usuario.");
    console.error(err);
  }
}

// ✅ Eliminar usuario
async function eliminarUsuario(id) {
  const confirmacion = confirm("¿Está seguro que desea eliminar este usuario?");
  if (!confirmacion) return;

  try {
    const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    const data = await res.json();

    if (!data.ok) return mostrarError(data.mensaje);

    cargarUsuarios();
  } catch (err) {
    mostrarError("Error al eliminar usuario.");
    console.error(err);
  }
}

// ✅ Logout
logoutBtn.addEventListener("click", async () => {
  await fetch("http://localhost:3000/usuarios/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "/login.html";
});

// Ejecutar validación
validarSesion();

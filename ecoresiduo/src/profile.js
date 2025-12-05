document.addEventListener("DOMContentLoaded", () => {
  cargarPerfil();
  inicializarBotones();
});

// ========================
// CARGAR PERFIL
// ========================
async function cargarPerfil() {
  try {
    const res = await fetch("http://localhost:3000/perfil", { credentials: "include" });

    if (res.status === 401) {
      window.location.href = "/index.html";
      return;
    }

    const data = await res.json();

    cargarInfoUsuario(data);
    cargarEntregas(data.historialEntregas);
    cargarEventos(data.participacionEventos);

  } catch (err) {
    console.error("Error al cargar perfil:", err);
  }
}

// ========================
// CARGAR INFO USUARIO
// ========================
function cargarInfoUsuario(u) {
  const div = document.getElementById("profileInfo");
  div.innerHTML = `
    <p><strong>Nombre:</strong> ${u.nombre}</p>
    <p><strong>Email:</strong> ${u.email}</p>
    <p><strong>Rol:</strong> ${u.rol}</p>
    <p><strong>Puntos acumulados:</strong> <span class="text-green-600 font-bold">${u.puntosAcumulados}</span></p>
    <p><strong>Miembro desde:</strong> ${new Date(u.fechaRegistro).toLocaleDateString()}</p>
  `;
}

// ========================
// CARGAR ENTREGAS
// ========================
function cargarEntregas(lista) {
  const tbody = document.getElementById("tablaEntregas");
  tbody.innerHTML = "";

  lista.forEach(e => {
    tbody.innerHTML += `
      <tr class="border-b border-gray-700">
        <td class="p-2">${e.material}</td>
        <td class="p-2">${e.pesoKg} kg</td>
        <td class="p-2">${e.puntosGanados}</td>
        <td class="p-2">${e.estado}</td>
        <td class="p-2">${e.contenedor}</td>
        <td class="p-2">${new Date(e.fecha).toLocaleString()}</td>
      </tr>
    `;
  });
}

// ========================
// CARGAR EVENTOS
// ========================
function cargarEventos(eventos) {
  const tbody = document.getElementById("tablaEventos");
  tbody.innerHTML = "";

  eventos.forEach(ev => {
    tbody.innerHTML += `
      <tr class="border-b border-gray-700">
        <td class="p-2">${ev.idTransaccion}</td>
        <td class="p-2 font-bold text-green-500">${ev.puntosGanados}</td>
        <td class="p-2">${new Date(ev.fecha).toLocaleString()}</td>
        <td class="p-2">${ev.idReferenciaEvento}</td>
      </tr>
    `;
  });
}

// ========================
// BOTONES: Dark mode + Logout
// ========================
function inicializarBotones() {
  // Toggle dark mode
  document.getElementById("toggleDark").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  // Logout
  document.getElementById("btnLogout").addEventListener("click", async () => {
    try {
      await fetch("http://localhost:3000/usuarios/logout", { credentials: "include" });
      window.location.href = "/index.html";
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      alert("Error al cerrar sesión");
    }
  });
}

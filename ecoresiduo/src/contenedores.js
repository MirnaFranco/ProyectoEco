// =======================
// MAPA
// =======================
const map = L.map("map").setView([-26.1849, -58.1731], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

let marker;

// CLICK EN EL MAPA
map.on("click", (e) => {
  const { lat, lng } = e.latlng;
  document.getElementById("lat").value = lat.toFixed(6);
  document.getElementById("lng").value = lng.toFixed(6);

  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng]).addTo(map);
});

// =======================
// MEMORIA LOCAL
// =======================
let listaContenedores = [];
let modoEdicion = false;
let idEditando = null;

// =======================
// BOTONES LOGOUT Y DARK MODE
// =======================
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("toggleDark").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// =======================
// GUARDAR / EDITAR
// =======================
document.getElementById("guardarBtn").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const horarios = document.getElementById("horarios").value;
  const lat = Number(document.getElementById("lat").value);
  const lng = Number(document.getElementById("lng").value);

  const select = document.getElementById("materiales");
  const materiales = Array.from(select.selectedOptions).map(o => o.value).join(", ");

  if (!nombre || !lat || !lng || !materiales) {
    document.getElementById("status").innerText = "⚠️ Complete los campos obligatorios.";
    return;
  }

  const contenedor = {
    nombreIdentificador: nombre,
    direccion,
    latitud: lat,
    longitud: lng,
    materialesAceptados: materiales,
    diasHorariosRecoleccion: horarios
  };

  if (modoEdicion) {
    try {
      const res = await fetch(`http://localhost:3000/contenedores/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contenedor)
      });

      const data = await res.json();

      if (res.ok) {
        document.getElementById("status").innerText = "✅ Contenedor actualizado.";
        listaContenedores = listaContenedores.map(c =>
          c.idContenedor === idEditando ? data.contenedor : c
        );
        renderContenedores();
        limpiarFormulario();
        modoEdicion = false;
        idEditando = null;
      } else {
        document.getElementById("status").innerText = "❌ Error: " + data.message;
      }
    } catch {
      document.getElementById("status").innerText = "❌ Error de conexión.";
    }
    return;
  }

  // CREAR
  try {
    const res = await fetch("http://localhost:3000/contenedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contenedor)
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("status").innerText = "✅ Contenedor creado.";
      listaContenedores.push(data.contenedor);
      renderContenedores();
      limpiarFormulario();
    } else {
      document.getElementById("status").innerText = "❌ " + data.message;
    }
  } catch {
    document.getElementById("status").innerText = "❌ Error de conexión.";
  }
});

// =======================
// LIMPIAR FORMULARIO
// =======================
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("horarios").value = "";
  document.getElementById("lat").value = "";
  document.getElementById("lng").value = "";
  document.getElementById("materiales").selectedIndex = -1;

  if (marker) map.removeLayer(marker);

  modoEdicion = false;
  idEditando = null;
}

// =======================
// RENDER LISTA
// =======================
function renderContenedores() {
  const contenedorLista = document.getElementById("contenedorLista");
  contenedorLista.innerHTML = "";

  listaContenedores.forEach(c => {
    const card = document.createElement("div");
    card.className = "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700";

    card.innerHTML = `
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-200">${c.nombreIdentificador}</h2>
      <p><b>Dirección:</b> ${c.direccion}</p>
      <p><b>Materiales:</b> ${c.materialesAceptados}</p>
      <p><b>Horario:</b> ${c.diasHorariosRecoleccion || "No especificado"}</p>
      <p><b>Lat:</b> ${c.latitud} | <b>Lng:</b> ${c.longitud}</p>

      <div class="flex gap-4 mt-3">
        <button onclick="editarContenedor(${c.idContenedor})" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white">Editar</button>
        <button onclick="eliminarContenedor(${c.idContenedor})" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white">Eliminar</button>
      </div>
    `;
    contenedorLista.appendChild(card);
  });
}

// =======================
// ELIMINAR
// =======================
async function eliminarContenedor(idContenedor) {
  if (!confirm("¿Eliminar el contenedor?")) return;

  try {
    const res = await fetch(`http://localhost:3000/contenedores/${idContenedor}`, { method: "DELETE" });
    if (res.ok) {
      listaContenedores = listaContenedores.filter(c => c.idContenedor !== idContenedor);
      renderContenedores();
    } else {
      alert("❌ No se pudo eliminar (ID no encontrado).");
    }
  } catch {
    alert("❌ Error eliminando contenedor.");
  }
}

// =======================
// EDITAR
// =======================
function editarContenedor(idContenedor) {
  const c = listaContenedores.find(x => x.idContenedor === idContenedor);
  if (!c) return;

  modoEdicion = true;
  idEditando = idContenedor;

  document.getElementById("nombre").value = c.nombreIdentificador;
  document.getElementById("direccion").value = c.direccion;
  document.getElementById("horarios").value = c.diasHorariosRecoleccion;
  document.getElementById("lat").value = c.latitud;
  document.getElementById("lng").value = c.longitud;

  const select = document.getElementById("materiales");
  const materiales = c.materialesAceptados.split(", ");
  Array.from(select.options).forEach(opt => opt.selected = materiales.includes(opt.value));

  if (marker) map.removeLayer(marker);
  marker = L.marker([c.latitud, c.longitud]).addTo(map);

  document.getElementById("status").innerText = "✏️ Modo edición activado. Guardar para actualizar.";
}

// =======================
// CARGAR CONTENEDORES
// =======================
async function cargarContenedores() {
  try {
    const res = await fetch("http://localhost:3000/contenedores");
    const data = await res.json();
    listaContenedores = data.contenedores || [];
    renderContenedores();
  } catch (err) {
    console.error("Error cargando contenedores", err);
  }
}

cargarContenedores();

// =======================
// LOGOUT
// =======================
async function logout() {
  await fetch("http://localhost:3000/usuarios/logout", { credentials: "include" });
  window.location.href = "/index.html";
}

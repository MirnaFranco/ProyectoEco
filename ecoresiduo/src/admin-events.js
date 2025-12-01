console.log("admin-events.js cargado");

// ========================
// VALIDAR SESIÓN ADMIN
// ========================
async function validarSesion() {
  try {
    const res = await fetch("http://localhost:3000/usuarios/session", {
      credentials: "include",
    });

    const data = await res.json();
    console.log("Sesión:", data);

    if (!data.ok || data.user.role !== "administrador") {
      alert("Acceso denegado. Solo administradores.");
      window.location.href = "/index.html";
    }

  } catch (err) {
    console.error("Error al validar sesión:", err);
    window.location.href = "/index.html";
  }
}
validarSesion();


// ELEMENTOS
const tablaBody = document.getElementById("eventosBody");
const form = document.getElementById("eventoForm");

const idEvento = document.getElementById("idEvento");
const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const fecha = document.getElementById("fecha");
const puntosOtorgados = document.getElementById("puntosOtorgados");
const latitud = document.getElementById("latitud");
const longitud = document.getElementById("longitud");


// ========================
// MAPA LEAFLET
// ========================
let map = L.map("map").setView([-26.1849, -58.1731], 13);
let marker = null;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

// Click en el mapa → setear lat/long
map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  latitud.value = lat.toFixed(6);
  longitud.value = lng.toFixed(6);

  if (marker) marker.remove();
  marker = L.marker([lat, lng]).addTo(map);
});


// ========================
// CARGAR TODOS LOS EVENTOS
// ========================
async function cargarEventos() {
  try {
    const res = await fetch("http://localhost:3000/eventos", {
      credentials: "include",
    });
    const data = await res.json();

    if (!data.ok) throw new Error("Error al obtener eventos");

    tablaBody.innerHTML = "";

    data.data.forEach((ev) => {
      const tr = document.createElement("tr");
      tr.classList.add("border-b", "hover:bg-green-100", "dark:hover:bg-green-900");

      tr.innerHTML = `
        <td class="p-2">${ev.idEvento}</td>
        <td class="p-2">${ev.nombre}</td>
        <td class="p-2">${ev.fecha.split("T")[0]}</td>
        <td class="p-2">${ev.latitud ?? "--"}</td>
        <td class="p-2">${ev.longitud ?? "--"}</td>
        <td class="p-2 flex gap-2">
          <button onclick='editarEvento(${JSON.stringify(ev)})'
            class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Editar
          </button>

          <button onclick="eliminarEvento(${ev.idEvento})"
            class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
            Eliminar
          </button>
        </td>
      `;

      tablaBody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error:", err);
    mostrarMensaje("Error al cargar eventos", "error");
  }
}
cargarEventos();


// ========================
// MOSTRAR MENSAJES
// ========================
function mostrarMensaje(texto, tipo = "success") {
  const div = document.createElement("div");

  div.className = `
    fixed top-4 right-4 px-4 py-2 rounded shadow text-white z-[9999]
    ${tipo === "success" ? "bg-green-600" : "bg-red-600"}
  `;

  div.innerText = texto;
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 2500);
}


// ========================
// GUARDAR EVENTO (Crear/Editar)
// ========================
async function guardarEvento() {
  const evento = {
    nombre: nombre.value.trim(),
    descripcion: descripcion.value || null,
    fecha: fecha.value,
    puntosOtorgados: Number(puntosOtorgados.value),
    latitud: latitud.value ? Number(latitud.value) : null,
    longitud: longitud.value ? Number(longitud.value) : null,
  };

  const editando = Boolean(idEvento.value);

  const url = editando
    ? `http://localhost:3000/eventos/${idEvento.value}`
    : "http://localhost:3000/eventos";

  const method = editando ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
      credentials: "include",
    });

    const data = await res.json();

    if (!data.ok) throw new Error(data.message);

    mostrarMensaje(editando ? "Evento actualizado" : "Evento creado");
    form.reset();
    idEvento.value = "";
    cargarEventos();

  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al guardar evento", "error");
  }
}


// ========================
// COMPLETAR FORMULARIO PARA EDICIÓN
// ========================
function editarEvento(ev) {
  idEvento.value = ev.idEvento;

  nombre.value = ev.nombre;
  descripcion.value = ev.descripcion ?? "";
  fecha.value = ev.fecha.split("T")[0];
  puntosOtorgados.value = ev.puntosOtorgados;

  latitud.value = ev.latitud ?? "";
  longitud.value = ev.longitud ?? "";

  // Dibujar el marcador en el mapa
  if (marker) marker.remove();

  if (ev.latitud && ev.longitud) {
    marker = L.marker([ev.latitud, ev.longitud]).addTo(map);
    map.setView([ev.latitud, ev.longitud], 14);
  }

  mostrarMensaje("Editando evento...");
}


// ========================
// ELIMINAR EVENTO
// ========================
async function eliminarEvento(id) {
  if (!confirm("¿Seguro que deseas eliminar este evento?")) return;

  try {
    const res = await fetch(`http://localhost:3000/eventos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!data.ok) throw new Error(data.message);

    mostrarMensaje("Evento eliminado");
    cargarEventos();

  } catch (err) {
    console.error(err);
    mostrarMensaje("Error al eliminar evento", "error");
  }
}


// ========================
// LOGOUT
// ========================
async function logout() {
  await fetch("http://localhost:3000/usuarios/logout", { credentials: "include" });
  window.location.href = "/index.html";
}

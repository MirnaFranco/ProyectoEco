// =========================
// ELEMENTOS
// =========================
const materialInput = document.getElementById("materialNombre");
const pesoKg = document.getElementById("pesoKg");
const idContenedor = document.getElementById("idContenedor");
const form = document.getElementById("formEntrega");
const msg = document.getElementById("msg");
const btnEnviar = document.getElementById("btnEnviar");
const tbody = document.getElementById("tbodyEntregas");
const logoutBtn = document.getElementById("logoutBtn");

let modoEdicion = null; // almacena ID si estamos editando

const materialesValidos = [
  "Plástico",
  "Vidrio",
  "Metal",
  "Residuos peligrosos",
  "Orgánicos",
  "Papel",
  "Cartón"
];

// =========================
// MENSAJES
// =========================
function mostrarMensaje(texto, tipo = "success") {
  msg.innerHTML = `
    <p class="p-2 rounded ${tipo === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}">
      ${texto}
    </p>`;
  setTimeout(() => (msg.innerHTML = ""), 3000);
}

// =========================
// GEOLOCALIZACIÓN
// =========================
async function obtenerCoordenadas() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject("Geolocalización no disponible.");

    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => reject("No se pudo obtener la ubicación.")
    );
  });
}

// =========================
// CARGAR ENTREGAS
// =========================
document.addEventListener("DOMContentLoaded", cargarEntregas);

async function cargarEntregas() {
  tbody.innerHTML = "";
  try {
    const res = await fetch("http://localhost:3000/entregas", { credentials: "include" });
    const data = await res.json();
    data.forEach(e => agregarFila(e));
  } catch (err) {
    mostrarMensaje("Error al cargar entregas", "error");
  }
}

function agregarFila(e) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="p-2 border-b border-gray-300 dark:border-gray-600">${e.idEntrega}</td>
    <td class="p-2 border-b border-gray-300 dark:border-gray-600">${e.materialNombre}</td>
    <td class="p-2 border-b border-gray-300 dark:border-gray-600">${e.pesoKg} kg</td>
    <td class="p-2 border-b border-gray-300 dark:border-gray-600">${e.idContenedor ?? "GPS"}</td>
    <td class="p-2 border-b border-gray-300 dark:border-gray-600 flex gap-2">
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded" onclick="editarEntrega(${e.idEntrega})">Editar</button>
      <button class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded" onclick="eliminarEntrega(${e.idEntrega})">Eliminar</button>
    </td>
  `;
  tbody.appendChild(tr);
}

// =========================
// SUBMIT FORMULARIO
// =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const materialNombre = materialInput.value.trim();
  const peso = parseFloat(pesoKg.value);
  const contenedor = idContenedor.value.trim();

  if (!materialesValidos.includes(materialNombre)) {
    mostrarMensaje("Seleccione un material válido", "error");
    return;
  }

  if (!peso || peso <= 0) {
    mostrarMensaje("Ingrese un peso válido", "error");
    return;
  }

  btnEnviar.disabled = true;

  let latitud = null, longitud = null;

  if (!contenedor) {
    try {
      const coords = await obtenerCoordenadas();
      latitud = coords.lat;
      longitud = coords.lon;
    } catch (err) {
      mostrarMensaje(err, "error");
      btnEnviar.disabled = false;
      return;
    }
  }

  const body = {
    materialNombre,
    pesoKg: peso,
    idContenedor: contenedor ? Number(contenedor) : null,
    latitud,
    longitud
  };

  const url = modoEdicion
    ? `http://localhost:3000/entregas/${modoEdicion}`
    : "http://localhost:3000/entregas";

  const method = modoEdicion ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje(data.message || "Error", "error");
      btnEnviar.disabled = false;
      return;
    }

    mostrarMensaje(modoEdicion ? "Entrega actualizada" : "Entrega registrada");
    form.reset();
    modoEdicion = null;
    tbody.innerHTML = "";
    cargarEntregas();
  } catch (err) {
    mostrarMensaje("Error al guardar entrega", "error");
  } finally {
    btnEnviar.disabled = false;
  }
});

// =========================
// EDITAR ENTREGA
// =========================
async function editarEntrega(id) {
  modoEdicion = id;
  try {
    const res = await fetch(`http://localhost:3000/entregas/${id}`, { credentials: "include" });
    const e = await res.json();

    materialInput.value = e.materialNombre;
    pesoKg.value = e.pesoKg;
    idContenedor.value = e.idContenedor ?? "";

    mostrarMensaje("Modo edición activado");
  } catch {
    mostrarMensaje("Error al obtener entrega", "error");
  }
}

// =========================
// ELIMINAR ENTREGA
// =========================
async function eliminarEntrega(id) {
  if (!confirm("¿Eliminar entrega?")) return;

  try {
    await fetch(`http://localhost:3000/entregas/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    cargarEntregas();
  } catch {
    mostrarMensaje("Error al eliminar entrega", "error");
  }
}

// =========================
// LOGOUT
// =========================
logoutBtn.addEventListener("click", async () => {
  try {
    await fetch("http://localhost:3000/usuarios/logout", { credentials: "include" });
    window.location.href = "/index.html";
  } catch {
    mostrarMensaje("Error al cerrar sesión", "error");
  }
});

// Exponer editarEntrega y eliminarEntrega al global (para onclick en tabla)
window.editarEntrega = editarEntrega;
window.eliminarEntrega = eliminarEntrega;


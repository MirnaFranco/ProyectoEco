// =======================
// MAPA
// =======================
const map = L.map("map").setView([-26.1849, -58.1731], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

let marker;

// CLICK EN EL MAPA → RELLENA LAT & LNG
map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  document.getElementById("lat").value = lat.toFixed(6);
  document.getElementById("lng").value = lng.toFixed(6);

  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);
});

// CONTENEDORES CARGADOS EN MEMORIA PARA MOSTRARLOS
let listaContenedores = [];

// =======================
// GUARDAR CONTENEDOR
// =======================
document.getElementById("guardarBtn").addEventListener("click", async () => {
  const inputNombre = document.getElementById("nombre").value;
  const inputDireccion = document.getElementById("direccion").value;
  const inputHorarios = document.getElementById("horarios").value;
  const inputLat = document.getElementById("lat").value;
  const inputLng = document.getElementById("lng").value;

  // MATERIAL MULTIPLE
  const select = document.getElementById("materiales");
  const materiales = Array.from(select.selectedOptions)
    .map(opt => opt.value)
    .join(", ");

  if (!inputNombre || !inputLat || !inputLng || !materiales) {
    document.getElementById("status").innerText =
      "⚠️ Complete todos los campos obligatorios.";
    return;
  }

  const contenedor = {
    nombreIdentificador: inputNombre,
    direccion: inputDireccion,
    latitud: inputLat,
    longitud: inputLng,
    materialesAceptados: materiales,
    diasHorariosRecoleccion: inputHorarios
  };

  try {
    const res = await fetch("http://localhost:3000/contenedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contenedor)
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("status").innerText =
        "✅ Contenedor creado con éxito.";

      // lo agregamos a la lista local
      listaContenedores.push(data.contenedor);

      // mostrarlo en pantalla
      renderContenedores();

      // limpiar formulario
      limpiarFormulario();
    } else {
      document.getElementById("status").innerText = "❌ Error: " + data.message;
    }
  } catch (err) {
    document.getElementById("status").innerText = "❌ Error de conexión.";
    console.error(err);
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

  if (marker) map.removeLayer(marker);
}

// =======================
// RENDERIZAR TARJETAS
// =======================
function renderContenedores() {
  const contenedorLista = document.getElementById("contenedorLista");
  contenedorLista.innerHTML = "";

  listaContenedores.forEach((c) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-800 p-4 rounded-lg shadow-lg mb-4 border border-gray-700";

    card.innerHTML = `
      <h2 class="text-xl font-bold">${c.nombreIdentificador}</h2>
      <p><b>Dirección:</b> ${c.direccion}</p>
      <p><b>Materiales:</b> ${c.materialesAceptados}</p>
      <p><b>Horario:</b> ${c.diasHorariosRecoleccion || "No especificado"}</p>
      <p><b>Lat:</b> ${c.latitud} | <b>Lng:</b> ${c.longitud}</p>

      <div class="flex gap-4 mt-3">
        <button onclick="editarContenedor(${c.idContenedor})" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
          Editar
        </button>

        <button onclick="eliminarContenedor(${c.idContenedor})" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
          Eliminar
        </button>
      </div>
    `;

    contenedorLista.appendChild(card);
  });
}

// =======================
// ELIMINAR
// =======================
async function eliminarContenedor(id) {
  if (!confirm("¿Eliminar el contenedor?")) return;

  try {
    await fetch(`http://localhost:3000/contenedores/${id}`, {
      method: "DELETE",
    });

    listaContenedores = listaContenedores.filter(c => c.idContenedor !== id);

    renderContenedores();
  } catch (err) {
    alert("❌ Error eliminando contenedor.");
  }
}

// =======================
// EDITAR (POR AHORA SOLO CARGA LOS DATOS)
// =======================
async function editarContenedor(id) {
  const c = listaContenedores.find(x => x.idContenedor === id);
  if (!c) return;

  document.getElementById("nombre").value = c.nombreIdentificador;
  document.getElementById("direccion").value = c.direccion;
  document.getElementById("horarios").value = c.diasHorariosRecoleccion;

  document.getElementById("lat").value = c.latitud;
  document.getElementById("lng").value = c.longitud;

  if (marker) map.removeLayer(marker);
  marker = L.marker([c.latitud, c.longitud]).addTo(map);

  document.getElementById("status").innerText =
    "✏️ Modo edición activado (pero falta implementar PUT).";
}


// Elementos
const materialInput = document.getElementById("materialNombre");
const pesoKg = document.getElementById("pesoKg");
const idContenedor = document.getElementById("idContenedor");
const form = document.getElementById("formEntrega");
const msg = document.getElementById("msg");
const btnEnviar = document.getElementById("btnEnviar");

// Lista válida
const materialesValidos = [
  "Plástico",
  "Vidrio",
  "Metal",
  "Residuos peligrosos",
  "Orgánicos",
  "Papel",
  "Cartón"
];

function mostrarMensaje(texto, tipo = "success") {
  msg.innerHTML = `
    <p class="p-2 rounded ${
      tipo === "success"
        ? "bg-green-200 text-green-800"
        : "bg-red-200 text-red-800"
    }">${texto}</p>`;
  setTimeout(() => (msg.innerHTML = ""), 3000);
}

function obtenerCoordenadas() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocalización no disponible.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => reject("No se pudo obtener la ubicación.")
    );
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const materialNombre = materialInput.value.trim();
  const peso = parseFloat(pesoKg.value);
  const contenedor = idContenedor.value.trim();

  if (!materialesValidos.includes(materialNombre)) {
    mostrarMensaje("Seleccione un material válido.", "error");
    return;
  }

  if (!peso || peso <= 0) {
    mostrarMensaje("Ingrese un peso válido.", "error");
    return;
  }

  btnEnviar.disabled = true;
  btnEnviar.classList.add("opacity-50");

  let latitud = null;
  let longitud = null;

  if (!contenedor) {
    try {
      const coords = await obtenerCoordenadas();
      latitud = coords.lat;
      longitud = coords.lon;
    } catch (err) {
      mostrarMensaje(err, "error");
      btnEnviar.disabled = false;
      btnEnviar.classList.remove("opacity-50");
      return;
    }
  }

  try {
    const body = {
      materialNombre,
      pesoKg: peso,
      idContenedor: contenedor ? Number(contenedor) : null,
      latitud,
      longitud,
    };

    const res = await fetch("http://localhost:3000/entregas", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (_) {
      mostrarMensaje("El servidor respondió con un formato no válido.", "error");
      return;
    }

    if (!res.ok) {
      mostrarMensaje(data.message || "Error al registrar entrega.", "error");
      return;
    }

    mostrarMensaje(`Entrega registrada. Puntos ganados: ${data.puntos}`, "success");
    form.reset();

  } catch (err) {
    console.error(err);
    mostrarMensaje("Error de conexión", "error");
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.classList.remove("opacity-50");
  }
});

// LOGOUT
async function logout() {
  await fetch("http://localhost:3000/usuarios/logout", { credentials: "include" });
  window.location.href = "/index.html";
}

// MAPA
const map = L.map("map").setView([-26.1849, -58.1731], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

let marker;

// Capturar clic en el mapa
map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  document.getElementById("lat").value = lat.toFixed(6);
  document.getElementById("lng").value = lng.toFixed(6);

  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);
});

// --- GUARDAR CONTENEDOR ---
document.getElementById("guardarBtn").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const horarios = document.getElementById("horarios").value;
  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;

  // MATERIAL MULTIPLE
  const select = document.getElementById("materiales");
  const materiales = Array.from(select.selectedOptions).map(opt => opt.value).join(", ");

  if (!nombre || !lat || !lng || !materiales) {
    document.getElementById("status").innerText = "⚠️ Complete todos los campos obligatorios.";
    return;
  }

  const contenedor = {
    nombreIdentificador: nombre,
    direccion: direccion,
    latitud: lat,
    longitud: lng,
    materialesAceptados: materiales,
    diasHorariosRecoleccion: horarios
  };

  try {
    const res = await fetch("http://localhost:3000/contenedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contenedor)
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("status").innerText = "✅ Contenedor creado con éxito.";
    } else {
      document.getElementById("status").innerText = "❌ Error: " + data.message;
    }

  } catch (err) {
    document.getElementById("status").innerText = "❌ Error de conexión.";
    console.error(err);
  }
});

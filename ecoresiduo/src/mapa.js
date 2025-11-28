import { logoutUser } from "./logout.js";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  // =======================
  // Datos de prueba
  // =======================
  const CONTENEDORES = [
    { id: 1, tipo: "Plástico", lat: -26.1775, lng: -58.1781, direccion: "Calle A 123" },
    { id: 2, tipo: "Vidrio", lat: -26.1820, lng: -58.1650, direccion: "Av. B 456" },
    { id: 3, tipo: "Papel", lat: -26.1750, lng: -58.1600, direccion: "Pasaje C 7" },
    { id: 4, tipo: "Plástico", lat: -26.1790, lng: -58.1720, direccion: "Calle D 33" },
    { id: 5, tipo: "Vidrio", lat: -26.1805, lng: -58.1705, direccion: "Plaza E" },
  ];

  const EVENTOS = [
    { id: "E1", titulo: "Ecopunto móvil", fecha: "2025-09-25 09:00", lat: -26.1760, lng: -58.1690 },
    { id: "E2", titulo: "Jornada de reciclaje", fecha: "2025-10-01 10:00", lat: -26.1830, lng: -58.1660 },
  ];

  // =======================
  // Inicializar mapa
  // =======================
  const map = L.map("map").setView([-26.1775, -58.1781], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let userMarker = null;
  let markers = [];
  let userPos = null;

  // =======================
  // Render contenedores
  // =======================
  const listaCont = document.getElementById("listaContenedores");
  const listaEventos = document.getElementById("listaEventos");
  const filtro = document.getElementById("filtro");
  const infoCercano = document.getElementById("infoCercano");

  function renderContenedores() {
    listaCont.innerHTML = "";
    const tipo = filtro.value;
    const filtrados = tipo === "Todos" ? CONTENEDORES : CONTENEDORES.filter(c => c.tipo === tipo);

    filtrados.forEach(c => {
      const li = document.createElement("li");
      li.className = "p-2 border rounded flex justify-between items-start";
      li.innerHTML = `
        <div>
          <div class="font-medium">${c.tipo}</div>
          <div class="text-sm text-gray-600">${c.direccion}</div>
        </div>
        <button class="text-sm text-blue-600 hover:underline">Ver</button>
      `;
      li.querySelector("button").addEventListener("click", () => {
        map.flyTo([c.lat, c.lng], 16, { duration: 0.8 });
      });
      listaCont.appendChild(li);
    });

    // Render marcadores
    markers.forEach(m => m.remove());
    markers = filtrados.map(c => {
      const marker = L.marker([c.lat, c.lng])
        .bindPopup(`<b>${c.tipo}</b><br>${c.direccion}`)
        .addTo(map);
      return marker;
    });
  }

  EVENTOS.forEach(ev => {
    const li = document.createElement("li");
    li.className = "p-2 border rounded";
    li.innerHTML = `
      <div class="font-medium">${ev.titulo}</div>
      <div class="text-sm text-gray-600">${ev.fecha}</div>
      <button class="text-sm text-blue-600 hover:underline">Ver en mapa</button>
    `;
    li.querySelector("button").addEventListener("click", () => {
      map.flyTo([ev.lat, ev.lng], 16, { duration: 0.8 });
    });
    listaEventos.appendChild(li);

    L.marker([ev.lat, ev.lng])
      .bindPopup(`<b>${ev.titulo}</b><br>${ev.fecha}`)
      .addTo(map);
  });

  renderContenedores();
  filtro.addEventListener("change", renderContenedores);

  // =======================
  // Botón Cerrar Sesión
  // =======================
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // =======================
  // Geolocalización y contenedor más cercano
  // =======================
  function distanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = deg => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  document.getElementById("btnUbicacion").addEventListener("click", () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      if (userMarker) userMarker.remove();
      userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Tu ubicación").openPopup();
      map.flyTo([latitude, longitude], 15, { duration: 0.8 });
      userPos = [latitude, longitude];
    });
  });

  document.getElementById("btnCercano").addEventListener("click", () => {
    if (!userPos) return;

    const tipo = filtro.value;
    const filtrados = tipo === "Todos" ? CONTENEDORES : CONTENEDORES.filter(c => c.tipo === tipo);

    let nearest = null;
    let minDist = Infinity;

    filtrados.forEach(c => {
      const d = distanceMeters(userPos[0], userPos[1], c.lat, c.lng);
      if (d < minDist) {
        minDist = d;
        nearest = { ...c, dist: Math.round(d) };
      }
    });

    if (nearest) {
      infoCercano.classList.remove("hidden");
      infoCercano.innerHTML = `
        <div class="font-semibold">Más cercano</div>
        <div>${nearest.tipo} • ${nearest.direccion}</div>
        <div>${nearest.dist} m</div>
      `;
      map.flyTo([nearest.lat, nearest.lng], 16, { duration: 0.8 });
    }
  });
});


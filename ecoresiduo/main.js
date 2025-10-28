/* main.js - Manejo de mapa, estadísticas, notificaciones, puntos y logros */

const KILO_TO_POINT = 10; // 1kg = 10 puntos
const CO2_PER_KG = 0.2; // estimación: 0.2 kg CO2 evitado por kg reciclado (ejemplo)

const kilosValue = document.getElementById("kilosValue");
const pointsValue = document.getElementById("pointsValue");
const co2Value = document.getElementById("co2Value");
const historyList = document.getElementById("historyList");
const achievementsList = document.getElementById("achievementsList");
const achievementsPreview = document.getElementById("achievementsPreview");
const levelBadge = document.getElementById("levelBadge");

const kilosInput = document.getElementById("kilosInput");
const materialSelect = document.getElementById("materialSelect");
const registerKilosBtn = document.getElementById("registerKilosBtn");
const remindBtn = document.getElementById("remindBtn");
const logoutBtn = document.getElementById("logoutBtn");
const notifyPermBtn = document.getElementById("notifyPermBtn");

const defaultState = {
  kilos: 0,
  points: 0,
  history: [],
  achievements: [],
  lastReminder: null
};

let state = loadState();

// Inicialización
updateUI();
initMap();
requestNotificationPermissionIfNeeded();

// ---- Storage ----
function saveState() {
  localStorage.setItem("ecoresiduos_state_v1", JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem("ecoresiduos_state_v1");
  if (!raw) return { ...defaultState };
  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (e) {
    return { ...defaultState };
  }
}

// ---- UI updates ----
function updateUI() {
  kilosValue.textContent = `${state.kilos.toFixed(1)} kg`;
  pointsValue.textContent = `${state.points}`;
  co2Value.textContent = `${(state.kilos * CO2_PER_KG).toFixed(2)} kg CO₂`;

  // historial
  historyList.innerHTML = "";
  state.history.slice().reverse().forEach(item => {
    const d = document.createElement("div");
    d.className = "bg-gray-50 p-3 rounded";
    d.innerHTML = `<div class="text-sm"><strong>${item.kilos} kg</strong> — ${item.material} <span class="text-xs text-gray-500">(${new Date(item.date).toLocaleString()})</span></div>`;
    historyList.appendChild(d);
  });

  // logros
  achievementsList.innerHTML = "";
  state.achievements.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.title} — ${new Date(a.date).toLocaleDateString()}`;
    achievementsList.appendChild(li);
  });

  // preview (pequeño)
  achievementsPreview.innerHTML = state.achievements.slice(-3).map(a => `<div>🏅 ${a.title}</div>`).join("");

  // nivel simple según puntos
  levelBadge.textContent = getLevelName(state.points);
}

function getLevelName(points) {
  if (points >= 500) return "Experto ♻️";
  if (points >= 200) return "Avanzado 🌿";
  if (points >= 80) return "Intermedio 🌱";
  return "Novato ♻️";
}

// ---- Registro de kilos ----
registerKilosBtn.addEventListener("click", () => doRegister(parseFloat(kilosInput.value), materialSelect.value));
function doRegister(kilos, material) {
  if (!kilos || kilos <= 0) {
    showToast("Ingresa una cantidad válida de kilos.");
    return;
  }

  // actualizar estado
  state.kilos = +(state.kilos + kilos).toFixed(1);
  const puntosGanados = Math.round(kilos * KILO_TO_POINT);
  state.points += puntosGanados;

  const entry = { kilos, material, date: new Date().toISOString() };
  state.history.push(entry);

  // chequear logros
  checkAchievements();

  saveState();
  updateUI();

  showToast(`Registrados ${kilos} kg. +${puntosGanados} puntos`);
  showNotification("¡Buen trabajo! ✅", `Has reciclado ${kilos} kg — ganaste ${puntosGanados} puntos.`);
  kilosInput.value = "";
}

// ---- Logros / Achievements ----
const ACHIEVEMENT_RULES = [
  { id: "bronze_5", kilos: 5, title: "Bronce: 5 kg reciclados" },
  { id: "silver_20", kilos: 20, title: "Plata: 20 kg reciclados" },
  { id: "gold_50", kilos: 50, title: "Oro: 50 kg reciclados" },
  { id: "conciencia_100", kilos: 100, title: "Conciencia: 100 kg reciclados" },
];

function checkAchievements() {
  for (const rule of ACHIEVEMENT_RULES) {
    if (state.kilos >= rule.kilos && !state.achievements.some(a => a.id === rule.id)) {
      const ach = { id: rule.id, title: rule.title, date: new Date().toISOString() };
      state.achievements.push(ach);
      saveState();
      updateUI();
      showToast(`¡Logro desbloqueado! ${rule.title}`);
      showNotification("🎉 Logro desbloqueado", rule.title);
    }
  }
}

// ---- Notifications (Browser) ----
function requestNotificationPermissionIfNeeded() {
  if (!("Notification" in window)) return; // no soportado
  if (Notification.permission === "default") {
    notifyPermBtn.classList.remove("hidden");
    notifyPermBtn.addEventListener("click", () => {
      Notification.requestPermission().then(perm => {
        if (perm === "granted") {
          showToast("Notificaciones habilitadas");
          notifyPermBtn.classList.add("hidden");
        } else {
          showToast("Notificaciones no habilitadas");
        }
      });
    });
  } else if (Notification.permission === "granted") {
    notifyPermBtn.classList.add("hidden");
  }
}

function showNotification(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

// ---- In-app toasts ----
function showToast(text, timeout = 3500) {
  const t = document.createElement("div");
  t.className = "toast toast-enter fixed right-6 bottom-6 bg-white border p-3 rounded-lg shadow-md text-sm";
  t.textContent = text;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.remove("toast-enter"));
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
    setTimeout(() => t.remove(), 400);
  }, timeout);
}

// ---- Recordatorios ----
remindBtn.addEventListener("click", () => {
  scheduleReminder();
  showToast("Recordatorio programado para 24 horas (simulado).");
});

function scheduleReminder() {
  // Para esta demo guardamos la fecha en localStorage y mostramos notificación inmediata simulando reminder.
  state.lastReminder = new Date().toISOString();
  saveState();
  showNotification("Recordatorio EcoResiduos", "No olvides reciclar esta semana ♻️");
}

// ---- Logout simulación ----
logoutBtn.addEventListener("click", () => {
  alert("Sesión cerrada. Redirigiendo a login...");
  window.location.href = "/ecoresiduo/public/login.html";
});

// ---- MAP (Leaflet) ----
function initMap() {
  try {
    const map = L.map("map").setView([-31.6, -60.7], 13); // posición de ejemplo (Argentina)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // marcadores de ejemplo
    const centers = [
      { name: "Punto Verde Centro", lat: -31.599, lng: -60.703, info: "Recepción: Plástico, vidrio, papel" },
      { name: "Centro Reciclaje Norte", lat: -31.589, lng: -60.710, info: "Recepción: Metal, plástico" },
      { name: "EcoPunto Sur", lat: -31.607, lng: -60.690, info: "Recepción: Orgánicos y compost" },
    ];

    centers.forEach(c => {
      const marker = L.marker([c.lat, c.lng]).addTo(map);
      marker.bindPopup(`<strong>${c.name}</strong><br>${c.info}<br><button class="open-route" data-lat="${c.lat}" data-lng="${c.lng}">Cómo llegar</button>`);
      marker.on("popupopen", () => {
        // manejar clicks dentro del popup (delegación simple)
        setTimeout(() => {
          const btn = document.querySelector(".open-route[data-lat]");
          if (btn) {
            btn.addEventListener("click", () => {
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`, "_blank");
            });
          }
        }, 200);
      });
    });
  } catch(e) {
    console.error("Error inicializando mapa:", e);
  }
}

/* Inicializar UI con datos */
updateUI();

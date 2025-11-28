import { logoutUser } from "./logout.js";

// 📊 Datos de las métricas
const metrics = [
  { title: "Usuarios Activos", value: "1,234", icon: "users", trend: "+12%" },
  { title: "Kg Reciclados", value: "5,678", icon: "leaf", trend: "+8%" },
  { title: "Contenedores", value: "45", icon: "map-pin", trend: null },
  { title: "Eventos", value: "12", icon: "calendar", trend: "+3%" },
  { title: "Comercios Adheridos", value: "28", icon: "store", trend: "+5%" },
];

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // 🔹 Renderizar métricas
  const container = document.getElementById("metric-container");
  metrics.forEach((m) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition";
    card.innerHTML = `
      <i data-lucide="${m.icon}" class="w-8 h-8 text-green-600 mb-3"></i>
      <h3 class="text-lg font-semibold">${m.title}</h3>
      <p class="text-2xl font-bold text-gray-800">${m.value}</p>
      ${m.trend ? `<p class="text-sm text-green-600 font-medium mt-1">${m.trend}</p>` : ""}
    `;
    container.appendChild(card);
  });

  lucide.createIcons(); // 🔹 Inicializa Lucide

  // 🔹 Gráfico Kg Reciclados
  const ctxRecycling = document.getElementById("recyclingChart");
  if (ctxRecycling) {
    new Chart(ctxRecycling, {
      type: "bar",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Kg Reciclados",
          data: [120, 150, 180, 200, 250, 300, 350],
          backgroundColor: "rgba(34, 197, 94, 0.6)",
          borderColor: "rgba(22, 163, 74, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, labels: { color: "#14532d" } },
          title: { display: true, text: "Kg Reciclados por Mes", color: "#14532d" },
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: "#14532d" } },
          x: { ticks: { color: "#14532d" } },
        },
      },
    });
  }

  // 🔹 Participación Mensual
  const ctxParticipacion = document.getElementById("participacionChart");
  if (ctxParticipacion) {
    new Chart(ctxParticipacion, {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Participación Ciudadana (%)",
          data: [40, 55, 60, 70, 75, 80, 85],
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#14532d" } },
          title: { display: true, text: "Participación Mensual", color: "#14532d" },
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: "#14532d" } },
          x: { ticks: { color: "#14532d" } },
        },
      },
    });
  }

  // 🔹 Materiales Recolectados
  const ctxMateriales = document.getElementById("materialesChart");
  if (ctxMateriales) {
    new Chart(ctxMateriales, {
      type: "doughnut",
      data: {
        labels: ["Plástico", "Vidrio", "Papel", "Metal", "Orgánico"],
        datasets: [{
          label: "Kg",
          data: [500, 300, 250, 150, 400],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(74, 222, 128, 0.8)",
            "rgba(134, 239, 172, 0.8)",
            "rgba(163, 230, 53, 0.8)",
            "rgba(34, 197, 94, 0.4)",
          ],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { color: "#14532d" } },
          title: { display: true, text: "Materiales Recolectados", color: "#14532d" },
        },
      },
    });
  }
});

//-----------------------------------------------------
  // MODO OSCURO
  //-----------------------------------------------------
  const toggleDark = document.getElementById("toggleDark");

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }

  toggleDark?.addEventListener("click", () => {
    const newTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    lucide.createIcons(); // refrescar íconos
  });


import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
});

/**
 * Renderiza las estadísticas desde localStorage
 */
function renderStats() {
  const resumen = document.getElementById("resumen");
  const medallaContainer = document.getElementById("medalla");

  const state = JSON.parse(localStorage.getItem("ecoresiduos_state_v1")) || {
    kilos: 0,
    points: 0,
    level: "EcoNovata",
    achievements: [],
  };

  // Mostrar resumen con progreso
  resumen.innerHTML = `
    <h2 class="text-2xl font-semibold text-green-700 mb-3">📊 Tu Impacto Ambiental</h2>
    <p>Has reciclado <strong>${state.kilos.toFixed(1)}</strong> kg de residuos.</p>
    <p>Has reducido <strong>${(state.kilos * 0.2).toFixed(1)}</strong> kg de CO₂.</p>
    <p>Puntos totales: <strong>${state.points}</strong></p>
    <p>Nivel actual: <strong>${state.level}</strong></p>
  `;

  // Mostrar medalla según nivel
  const medal =
    state.level === "EcoNovata"
      ? "bronze.gif"
      : state.level === "EcoHeroína"
      ? "silver.gif"
      : "gold.gif";

  medallaContainer.innerHTML = `
    <h3 class="text-lg font-semibold mb-2">🏅 Logros ecológicos</h3>
    <img src="../assets/medals/${medal}" alt="Medalla ecológica"
         class="w-24 h-24 mx-auto animate-bounce" />
    <p class="mt-2 text-gray-600">¡Seguí reciclando para alcanzar la próxima medalla!</p>

    <div class="mt-6">
      <h4 class="font-semibold text-green-700 mb-2">🎖 Logros desbloqueados:</h4>
      ${
        state.achievements.length > 0
          ? `<ul class="text-left text-gray-700 space-y-2">${state.achievements
              .map(
                (a) => `
                <li class="p-2 bg-green-50 border border-green-200 rounded-lg">
                  <strong>${a.title}</strong><br>
                  <span class="text-xs text-gray-500">${a.date}</span>
                </li>`
              )
              .join("")}</ul>`
          : `<p class="text-sm text-gray-500">Aún no desbloqueaste logros.</p>`
      }
    </div>
  `;
}


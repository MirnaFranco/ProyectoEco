import './style.css';

export function loadProfile(container) {
  let usuario = {
    avatar: "../assets/logo.png",
    nombre: "Mirna Fernández",
    ciudad: "Formosa, Argentina",
    puntos: 120,
    nivel: "EcoHeroína",
  };

  // Renderiza la card principal
  function renderCard() {
    container.innerHTML = `
      <div class="profile-card max-w-sm mx-auto p-6 bg-green-50 rounded-xl shadow-md animate-fadeIn relative">
        <img src="${usuario.avatar}" alt="Avatar" class="avatar mx-auto mb-4 w-24 h-24 rounded-full object-cover" id="avatarImg"/>
        <h3 class="text-2xl font-semibold text-green-700" id="nombreText">${usuario.nombre}</h3>
        <p class="text-gray-600 mt-1" id="ciudadText">📍 ${usuario.ciudad}</p>
        <p class="mt-2">💚 Nivel: <b>${usuario.nivel}</b></p>
        <p>⭐ Puntos acumulados: <b>${usuario.puntos}</b></p>
        <button id="editPerfil" class="btn mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Editar perfil</button>
      </div>

      <!-- Modal oculto inicialmente -->
      <div id="editModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
        <div class="bg-white p-6 rounded-xl shadow-lg w-80 relative">
          <h3 class="text-xl font-semibold text-green-700 mb-4">Editar perfil</h3>
          <label class="block mb-2 text-sm font-medium text-gray-700">Avatar (URL)</label>
          <input type="text" id="avatarInput" value="${usuario.avatar}" class="border rounded px-3 py-2 w-full mb-3" />

          <label class="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" id="nombreInput" value="${usuario.nombre}" class="border rounded px-3 py-2 w-full mb-3" />

          <label class="block mb-2 text-sm font-medium text-gray-700">Ciudad</label>
          <input type="text" id="ciudadInput" value="${usuario.ciudad}" class="border rounded px-3 py-2 w-full mb-3" />

          <div class="flex gap-2 mt-4 justify-end">
            <button id="cancelBtn" class="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Cancelar</button>
            <button id="saveBtn" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Guardar</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("editPerfil").addEventListener("click", () => {
      document.getElementById("editModal").classList.remove("hidden");
    });

    document.getElementById("cancelBtn").addEventListener("click", () => {
      document.getElementById("editModal").classList.add("hidden");
    });

    document.getElementById("saveBtn").addEventListener("click", () => {
      // Guardar cambios
      usuario.avatar = document.getElementById("avatarInput").value || usuario.avatar;
      usuario.nombre = document.getElementById("nombreInput").value || usuario.nombre;
      usuario.ciudad = document.getElementById("ciudadInput").value || usuario.ciudad;

      // Actualizar card
      document.getElementById("avatarImg").src = usuario.avatar;
      document.getElementById("nombreText").textContent = usuario.nombre;
      document.getElementById("ciudadText").textContent = `📍 ${usuario.ciudad}`;

      document.getElementById("editModal").classList.add("hidden");
    });
  }

  renderCard();
}

export function renderAchievements(container) {
  const logros = [
    { titulo: "Primer reciclaje", icono: "♻️", descripcion: "Registraste tu primera acción ecológica.", progreso: 100 },
    { titulo: "5 días eco", icono: "🌱", descripcion: "Contribuiste activamente durante 5 días.", progreso: 100 },
    { titulo: "10 kg reciclados", icono: "🏋️‍♀️", descripcion: "Has reciclado más de 10 kg en total.", progreso: 80 },
    { titulo: "Guardiana verde", icono: "💚", descripcion: "Mantienes un promedio constante de reciclaje.", progreso: 65 },
    { titulo: "Embajadora Eco", icono: "🌍", descripcion: "Compartiste EcoResiduos con otros usuarios.", progreso: 40 },
  ];

  container.innerHTML = logros.map(logro => `
    <div class="tip-card transform hover:scale-105 transition p-4 bg-white rounded-xl shadow-md text-center animate-fadeIn">
      <div class="text-4xl mb-2">${logro.icono}</div>
      <h4 class="font-semibold text-green-700">${logro.titulo}</h4>
      <p class="text-sm text-gray-600 mb-3">${logro.descripcion}</p>
      <div class="progress-bar bg-gray-200 h-2 rounded-full">
        <div class="progress bg-green-600 h-2 rounded-full" style="width: ${logro.progreso}%;"></div>
      </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const perfilContainer = document.getElementById("perfilContainer");
  const logrosContainer = document.getElementById("logrosContainer");
  loadProfile(perfilContainer);
  renderAchievements(logrosContainer);
});

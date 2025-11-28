// js/consejos.js
import './style.css';

const consejos = [
  "♻️ Separa tus residuos correctamente: orgánicos e inorgánicos.",
  "🚲 Usa transporte sustentable: camina, anda en bici o compartí viajes.",
  "💧 Reducí el consumo de agua cerrando la canilla mientras te cepillás.",
  "🌱 Plantá un árbol: ayuda a reducir el CO₂.",
  "🔌 Desenchufá los aparatos que no uses para ahorrar energía."
];

const tipContainer = document.getElementById("tipContainer");
let favoritos = JSON.parse(localStorage.getItem("consejos_favoritos") || "[]");

function renderTips() {
  tipContainer.innerHTML = "";
  consejos.forEach((tip, i) => {
    const card = document.createElement("div");
    card.className = "tip-card fade-enter";
    card.innerHTML = `
      <p>${tip}</p>
      <div class="flex justify-between mt-3">
        <button class="btn-next btn">Siguiente</button>
        <span class="favorite" data-index="${i}">${favoritos.includes(i) ? '⭐' : '☆'}</span>
      </div>
    `;
    tipContainer.appendChild(card);

    setTimeout(() => card.classList.add("fade-enter-active"), 50);
    card.querySelector(".btn-next").addEventListener("click", () => showRandomTip(i));
    card.querySelector(".favorite").addEventListener("click", (e) => toggleFavorite(i, e.target));
  });
}

function showRandomTip(excludeIndex) {
  let index;
  do { index = Math.floor(Math.random() * consejos.length); } while (index === excludeIndex && consejos.length > 1);
  const card = document.createElement("div");
  card.className = "tip-card fade-enter";
  card.innerHTML = `
    <p>${consejos[index]}</p>
    <div class="flex justify-between mt-3">
      <button class="btn-next btn">Siguiente</button>
      <span class="favorite" data-index="${index}">${favoritos.includes(index) ? '⭐' : '☆'}</span>
    </div>
  `;
  tipContainer.innerHTML = "";
  tipContainer.appendChild(card);
  setTimeout(() => card.classList.add("fade-enter-active"), 50);

  card.querySelector(".btn-next").addEventListener("click", () => showRandomTip(index));
  card.querySelector(".favorite").addEventListener("click", (e) => toggleFavorite(index, e.target));

  showAchievement(`✔️ Seguiste un consejo: "${consejos[index].slice(0, 30)}..."`);
}

function toggleFavorite(index, el) {
  if (favoritos.includes(index)) {
    favoritos = favoritos.filter(i => i !== index);
    el.textContent = '☆';
  } else {
    favoritos.push(index);
    el.textContent = '⭐';
  }
  localStorage.setItem("consejos_favoritos", JSON.stringify(favoritos));
}

function showAchievement(text) {
  const toast = document.createElement("div");
  toast.className = "toast fixed bottom-6 right-6 bg-green-100 border p-3 rounded-lg shadow-md text-sm";
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

// Inicializar
renderTips();

// Logout simulación
document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "../login.html";
});

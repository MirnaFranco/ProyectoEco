// chatbot.js (versión corregida y robusta)

document.addEventListener("DOMContentLoaded", () => {
  const chatEl = document.getElementById("chat");
  const inputEl = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const historyList = document.getElementById("history");

  // Cargar historial desde localStorage (opcional)
  const savedHistory = JSON.parse(localStorage.getItem("ecobot_history_v1") || "[]");
  savedHistory.forEach(h => addHistoryItem(h.text, h.from, new Date(h.date)));

  // Escapa texto simple para evitar inyección al insertar en innerHTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function addMessage(from, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `mb-2 ${from === "user" ? "text-right" : "text-left"}`;

    const bubble = document.createElement("span");
    bubble.className = `inline-block px-3 py-2 rounded-xl ${
      from === "user" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
    }`;
    bubble.innerHTML = escapeHtml(text);

    messageDiv.appendChild(bubble);
    chatEl.appendChild(messageDiv);
    // mantener scroll abajo
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function addHistoryItem(text, from = "user", date = new Date()) {
    const item = document.createElement("div");
    item.className = "p-2 border-b text-sm text-gray-700";
    const time = new Date(date).toLocaleString();
    item.textContent = `${from === "user" ? "Tú" : "EcoBot"} (${time}): ${text}`;
    historyList.appendChild(item);
  }

  function persistHistoryEntry(text, from) {
    const entries = JSON.parse(localStorage.getItem("ecobot_history_v1") || "[]");
    entries.push({ text, from, date: new Date().toISOString() });
    localStorage.setItem("ecobot_history_v1", JSON.stringify(entries));
  }

  function botRespond() {
    const responses = [
      "🌱 Recuerda separar residuos orgánicos e inorgánicos.",
      "♻️ ¿Sabías que el vidrio se puede reciclar infinitas veces?",
      "🚮 Los plásticos deben limpiarse antes de reciclarse.",
      "🌍 Cada acción cuenta, gracias por cuidar el planeta.",
      "🧴 Si podés, intentá reducir el uso de plásticos de un solo uso."
    ];
    const random = responses[Math.floor(Math.random() * responses.length)];
    addMessage("bot", random);
    addHistoryItem(random, "bot");
    persistHistoryEntry(random, "bot");
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage("user", text);
    addHistoryItem(text, "user");
    persistHistoryEntry(text, "user");
    inputEl.value = "";

    // Simular procesamiento y respuesta
    setTimeout(botRespond, 600);
  }

  // Listeners
  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

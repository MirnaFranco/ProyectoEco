const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const history = document.getElementById("history");

function addMessage(from, text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `mb-2 ${from === "user" ? "text-right" : "text-left"}`;

  const bubble = document.createElement("span");
  bubble.className = `inline-block px-3 py-2 rounded-xl ${
    from === "user"
      ? "bg-green-600 text-white"
      : "bg-gray-200 text-gray-800"
  }`;
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  // Simular respuesta automática del bot
  setTimeout(() => {
    const responses = [
      "🌱 Recuerda separar residuos orgánicos e inorgánicos.",
      "♻️ ¿Sabías que el vidrio se puede reciclar infinitas veces?",
      "🚮 Los plásticos deben limpiarse antes de reciclarse.",
      "🌍 Cada acción cuenta, gracias por cuidar el planeta."
    ];
    const random = responses[Math.floor(Math.random() * responses.length)];
    addMessage("bot", random);

    // Agregar al historial
    const historyItem = document.createElement("div");
    historyItem.textContent = `Usuario: ${text}`;
    history.appendChild(historyItem);
  }, 600);
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

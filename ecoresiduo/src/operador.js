// Obtener elementos
const welcome = document.getElementById("welcomeOperador");
const userList = document.getElementById("userList");
const logoutBtn = document.getElementById("logoutBtn");

// Mostrar saludo
welcome.textContent = "¡Bienvenido, Operador!";

// Obtener lista de usuarios (solo nombres y email)
fetch("http://localhost:3000/usuarios")
  .then(res => res.json())
  .then(users => {
    userList.innerHTML = users.map(u => `
      <li class="border border-gray-300 px-4 py-2 mb-2 rounded bg-white">
        ${u.nombre} - ${u.email} (${u.rol})
      </li>
    `).join("");
  })
  .catch(err => console.error("Error al obtener usuarios:", err));

// Logout
logoutBtn.addEventListener("click", async () => {
  await fetch("http://localhost:3000/usuarios/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "/login.html";
});


// 🔹 Capturar el submit del formulario
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // 🔹 Validar campos
  if (!email || !password) {
    mostrarError("Completa todos los campos.");
    return;
  }

  try {
    // 🔹 Enviar petición al backend
    const res = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      credentials: "include", // IMPORTANTE: para sesión JWT/cookies
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("RESPUESTA LOGIN:", data);

    if (!data.ok) {
      mostrarError(data.mensaje || "Credenciales incorrectas.");
      return;
    }

    // 🔹 Obtener rol (role o rol)
    const role = data.role || data.rol;

    // 🔹 Redirección según rol
    switch (role) {
      case "administrador":
        window.location.href = "/admin.html";
        break;
      case "operador":
        window.location.href = "/repartidor/main.html";
        break;
      case "usuario":
        window.location.href = "/main.html";
        break;
      default:
        mostrarError("Rol no reconocido: " + role);
        break;
    }

  } catch (error) {
    console.error(error);
    mostrarError("Error de conexión con el servidor.");
  }
});

// 🔹 Función para mostrar errores
function mostrarError(msg) {
  const box = document.getElementById("mensajeError");
  box.textContent = msg;
  box.classList.remove("hidden");

  // Opcional: ocultar error después de 5 segundos
  setTimeout(() => box.classList.add("hidden"), 5000);
}

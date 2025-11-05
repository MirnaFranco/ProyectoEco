 import './style.css';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Error en el inicio de sesión.");
      return;
    }

    // ✅ Guardamos los datos del usuario en localStorage
    const userData = {
      name: data.user?.name || data.user?.email || "Usuario",
      email: data.user?.email,
      avatar: data.user?.avatar || "/ecoresiduo/public/assets/default-avatar.png",
      token: data.token,
      loggedIn: true,
    };

    localStorage.setItem("ecoresiduos_user", JSON.stringify(userData));

    alert("Inicio de sesión exitoso. ¡Bienvenido a EcoResiduos! 🌱");

    // ✅ Redirigimos al panel principal
    window.location.href = "/main.html";

  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Error al conectar con el servidor. Verificá que el backend esté en ejecución.");
  }
});

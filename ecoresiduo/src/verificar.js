const form = document.getElementById("verifyForm");
const mensaje = document.getElementById("mensaje");
const reenviarBtn = document.getElementById("reenviarBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = document.getElementById("codigo").value.trim();

  try {
    const response = await fetch("http://localhost:3000/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.textContent = "✅ Cuenta verificada con éxito. Ya puedes iniciar sesión.";
      mensaje.className = "text-green-600 text-center mt-6 font-semibold";
      setTimeout(() => (window.location.href = "login.html"), 2000);
    } else {
      mensaje.textContent = "❌ " + data.message;
      mensaje.className = "text-red-600 text-center mt-6 font-semibold";
    }
  } catch (error) {
    mensaje.textContent = "❌ Error al verificar el código.";
    mensaje.className = "text-red-600 text-center mt-6 font-semibold";
  }
});

reenviarBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.textContent = "📧 Se ha reenviado un nuevo código a tu correo electrónico.";
      mensaje.className = "text-green-600 text-center mt-6 font-semibold";
    } else {
      mensaje.textContent = "❌ " + data.message;
      mensaje.className = "text-red-600 text-center mt-6 font-semibold";
    }
  } catch (error) {
    mensaje.textContent = "❌ Error al reenviar el código.";
    mensaje.className = "text-red-600 text-center mt-6 font-semibold";
  }
});

// Elementos
const materialInput = document.getElementById("materialNombre");
const pesoKg = document.getElementById("pesoKg");
const idContenedor = document.getElementById("idContenedor");
const form = document.getElementById("formEntrega");
const msg = document.getElementById("msg");
const btnEnviar = document.getElementById("btnEnviar");

// Lista de materiales permitidos
const materialesValidos = [
  "Plásticos",
  "Vidrio",
  "Metales",
  "Residuos peligrosos",
  "Orgánicos",
  "Papel y Cartón",
];

// ====== Mostrar mensajes ======
function mostrarMensaje(texto, tipo = "success") {
  msg.innerHTML = `
    <p class="p-2 rounded ${
      tipo === "success"
        ? "bg-green-200 text-green-800"
        : "bg-red-200 text-red-800"
    }">${texto}</p>`;
  setTimeout(() => (msg.innerHTML = ""), 3000);
}

// ====== Enviar entrega ======
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const materialNombre = materialInput.value.trim();
  const peso = parseFloat(pesoKg.value);

  if (!materialNombre || isNaN(peso) || peso <= 0) {
    mostrarMensaje("Complete todos los campos correctamente.", "error");
    return;
  }

  // Validar que el material esté en la lista permitida
  if (!materialesValidos.includes(materialNombre)) {
    mostrarMensaje("Seleccione un material válido de la lista.", "error");
    return;
  }

  btnEnviar.disabled = true;
  btnEnviar.classList.add("opacity-50");

  try {
    const body = {
      materialNombre,
      pesoKg: peso,
      idContenedor: idContenedor.value || null,
    };

    const res = await fetch("http://localhost:3000/entregas", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje(data.message || "Error al registrar entrega", "error");
      return;
    }

    mostrarMensaje(`Entrega registrada. Puntos ganados: ${data.puntos}`, "success");
    form.reset();

  } catch (err) {
    console.error(err);
    mostrarMensaje("Error de conexión", "error");
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.classList.remove("opacity-50");
  }

});

// ========================
// LOGOUT
// ========================
async function logout() {
  await fetch("http://localhost:3000/usuarios/logout", { credentials: "include" });
  window.location.href = "/index.html";
}
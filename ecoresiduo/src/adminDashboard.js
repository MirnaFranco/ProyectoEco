import './style.css';

document.addEventListener("DOMContentLoaded", () => {

  // ========================
  // ELEMENTOS
  // ========================
  const toggleDarkBtn = document.getElementById("toggleDark");
  const logoutBtn = document.getElementById("logoutBtn");

  // ========================
  // MODO OSCURO
  // ========================
  toggleDarkBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  // ========================
  // LOGOUT FUNCIONAL
  // ========================
  logoutBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:3000/usuarios/logout", {
        method: "POST",
        credentials: "include"
      });

      if (res.ok || res.status === 204) {
        window.location.href = "/login.html";
      } else {
        alert("No se pudo cerrar sesión. Intente nuevamente.");
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      alert("No se pudo cerrar sesión. Intente nuevamente.");
    }
  });

  // ========================
  // VALIDAR SESIÓN
  // ========================
  async function validarSesion() {
    try {
      const res = await fetch("http://localhost:3000/usuarios/session", {
        credentials: "include"
      });
      const data = await res.json();

      if (!data.ok || data.user.role !== "administrador") {
        window.location.href = "/login.html";
        return;
      }

      cargarMetricas();
      cargarGraficos();

    } catch (err) {
      console.error("Error al validar sesión:", err);
      window.location.href = "/login.html";
    }
  }

  // ========================
  // MÉTRICAS SIMULADAS
  // ========================
  function cargarMetricas() {
    document.getElementById("usuariosTotal").textContent = 120;
    document.getElementById("kgRecicladosTotal").textContent = 3500;
    document.getElementById("kgRecicladosEsteMes").textContent = 450;
  }

  function cargarGraficos() {
    const usuariosCtx = document.getElementById("usuariosChart").getContext("2d");
    new Chart(usuariosCtx, {
      type: "bar",
      data: {
        labels: ["Enero","Febrero","Marzo","Abril","Mayo"],
        datasets: [{ label: "Usuarios", data: [12,25,34,20,15], backgroundColor:"#10B981" }]
      }
    });

    const reciclajeCtx = document.getElementById("reciclajeChart").getContext("2d");
    new Chart(reciclajeCtx, {
      type: "line",
      data: {
        labels: ["Enero","Febrero","Marzo","Abril","Mayo"],
        datasets: [{ label: "Kg Reciclados", data:[500,700,600,800,900], borderColor:"#059669", fill:false }]
      }
    });

    const tendenciaCtx = document.getElementById("tendenciaChart").getContext("2d");
    new Chart(tendenciaCtx, {
      type: "line",
      data: {
        labels: ["Enero","Febrero","Marzo","Abril","Mayo"],
        datasets: [{ label:"Tendencia", data:[400,600,500,700,650], borderColor:"#047857", fill:false }]
      }
    });
  }

  // ========================
  // INICIO
  // ========================
  validarSesion();

});




// dashboard.js
async function cargarDashboard() {
  try {
    const res = await fetch("http://localhost:3000/dashboard", {
      credentials: "include" // para cookies/JWT de sesión
    });

    const data = await res.json();
    const m = data.metricas;

    // ===============================
    // Actualizar tarjetas de métricas
    // ===============================
    document.getElementById('usuariosTotal').textContent = m.usuariosTotal || 0;
    document.getElementById('kgRecicladosTotal').textContent = m.kgRecicladosTotal || 0;
    document.getElementById('kgRecicladosEsteMes').textContent = m.kgRecicladosEsteMes || 0;

    // ===============================
    // GRÁFICO 1: Usuarios del sistema
    // ===============================
    new Chart(document.getElementById('usuariosChart'), {
      type: 'doughnut',
      data: {
        labels: ['Usuarios Totales', 'Usuarios Activos este Mes'],
        datasets: [{
          data: [m.usuariosTotal || 0, m.usuariosActivosMes || 0],
          backgroundColor: ['#3b82f6', '#10b981']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    // =========================================
    // GRÁFICO 2: Comparación de reciclaje
    // =========================================
    new Chart(document.getElementById('reciclajeChart'), {
      type: 'bar',
      data: {
        labels: ['Total Reciclado', 'Este Mes'],
        datasets: [{
          label: 'Kg',
          data: [m.kgRecicladosTotal || 0, m.kgRecicladosEsteMes || 0],
          backgroundColor: ['#8b5cf6', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // =========================================
    // GRÁFICO 3: Tendencia Mensual (fake si 0)
    // =========================================
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    // Si no hay tendencia real, llenamos con 0 y agregamos valor actual
    const tendencia = Array(6).fill(0);
    tendencia.push(m.tendenciaKgMes || 0);

    new Chart(document.getElementById('tendenciaChart'), {
      type: 'line',
      data: {
        labels: meses,
        datasets: [{
          label: 'Kg por Mes',
          data: tendencia,
          borderColor: '#059669',
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

  } catch (error) {
    console.error("Error cargando dashboard:", error);
    const box = document.getElementById("mensajeError");
    if (box) {
      box.textContent = "Error cargando datos del dashboard.";
      box.classList.remove("hidden");
    }
  }
}

// Ejecutar al cargar
cargarDashboard();


// ========================
// LOGOUT
// ========================
async function logout() {
  await fetch("http://localhost:3000/usuarios/logout", { credentials: "include" });
  window.location.href = "/index.html";
}
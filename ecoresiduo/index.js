// index.js
import './style.css';

// Seleccionamos los botones
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

// Evento al hacer clic en Iniciar sesión
if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevenir navegación por defecto temporalmente
    console.log('Iniciando sesión...');
    window.location.href = loginBtn.href; // Redirige a login.html
  });
}

// Evento al hacer clic en Registrarse
if (registerBtn) {
  registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Registrándose...');
    window.location.href = registerBtn.href; // Redirige a register.html
  });
}

// Animaciones al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const formCard = document.querySelector('.form-card');
  if (formCard) {
    formCard.classList.add('opacity-100'); // Agrega clase para transición si existe en CSS
  }
});

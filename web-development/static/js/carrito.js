// carrito.js

// Variables globales
window.carrito = [];
let total = 0;

// Elementos del DOM
const cartSidebar = document.getElementById("cart-sidebar");
const cartToggle = document.getElementById("cart-toggle");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const finalizeOrder = document.getElementById("finalize-order");

let toggleFromButton = false; // bandera para distinguir el clic interno

// Mostrar y ocultar el carrito con toggle
cartToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleFromButton = true;

  const menuSidebar = document.getElementById("menu-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  if (cartSidebar.classList.contains("open")) {
    cartSidebar.classList.remove("open");
    document.body.style.overflow = "";
  } else {
    cartSidebar.classList.add("open");
    menuSidebar?.classList.remove("open");
    sidebarOverlay?.classList.remove("active");
    document.body.style.overflow = "hidden";
  }

  setTimeout(() => {
    toggleFromButton = false;
  }, 100);
});

// Cerrar si se hace clic fuera del carrito
document.addEventListener("click", (e) => {
  if (toggleFromButton) return;

  const isClickInsideCart = cartSidebar.contains(e.target);
  const isClickOnToggle = cartToggle.contains(e.target);

  if (!isClickInsideCart && !isClickOnToggle && cartSidebar.classList.contains("open")) {
    cartSidebar.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// Evitar que clics dentro del carrito lo cierren
cartSidebar.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Función global para agregar al carrito
window.agregarAlCarrito = function(nombre, precio) {
  const bebidaExistente = carrito.find(item => item.nombre === nombre);

  if (bebidaExistente) {
    bebidaExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  actualizarCarrito();
};

// Actualizar el carrito
window.actualizarCarrito = function () {
  cartItems.innerHTML = "";
  total = 0;

  if (carrito.length === 0) {
    cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    cartCount.textContent = "0";
    cartTotal.textContent = "0";
    return;
  }

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const itemHTML = `
      <div class="cart__item">
        <span>${item.nombre} x ${item.cantidad}</span>
        <span>$${subtotal}</span>
        <div class="cart__controls">
          <button onclick="aumentarCantidad(${index})" class="btn-icon">
            <img src="/static/media/add.svg" alt="Aumentar" width="24" height="24">
          </button>
          <button onclick="disminuirCantidad(${index})" class="btn-icon">
            <img src="/static/media/remove.svg" alt="Disminuir" width="24" height="24">
          </button>
        </div>
      </div>
    `;

    cartItems.insertAdjacentHTML("beforeend", itemHTML);
  });

  cartCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartTotal.textContent = total;
};

// Aumentar cantidad
window.aumentarCantidad = function(index) {
  carrito[index].cantidad += 1;
  actualizarCarrito();
};

// Disminuir cantidad
window.disminuirCantidad = function(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }
  actualizarCarrito();
};


function mostrarNotificacion(mensaje) {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensaje;

  container.appendChild(toast);

  // Eliminar después de 5 segundos
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
// carrito.js

// Variables globales
window.carrito = []; 
let total = 0;

// Elementos del DOM
const cartSidebar = document.getElementById("cart-sidebar");
const cartToggle = document.getElementById("cart-toggle");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const finalizeOrder = document.getElementById("finalize-order");

// Mostrar y ocultar el carrito
cartToggle.addEventListener("click", () => {
  cartSidebar.classList.add("open");
});

closeCart.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
});

// Evita que clics dentro del carrito lo cierren accidentalmente
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

//----- Actualizar el carrito -----//
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
}

//----- Aumentar cantidad -----//
window.aumentarCantidad = function(index) {
  carrito[index].cantidad += 1;
  actualizarCarrito();
}

//----- Disminuir cantidad -----//
window.disminuirCantidad = function(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }
  actualizarCarrito();
}

// Finalizar pedido
finalizeOrder.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. No puedes finalizar el pedido.");
    return;
  }
  console.log("Pedido finalizado. Contenido del carrito:", carrito);
});

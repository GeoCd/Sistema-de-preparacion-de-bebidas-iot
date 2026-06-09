document.addEventListener("DOMContentLoaded", () => {
    const finalizeOrder = document.getElementById("finalize-order");
  
    if (finalizeOrder) {
      finalizeOrder.addEventListener("click", () => {
        if (!window.carrito || carrito.length === 0) {
          mostrarNotificacion("Tu carrito está vacío. No puedes enviar el pedido.");
          return;
        }
  
        const pedido = {
          items: carrito,
          total: carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
          mesa: localStorage.getItem("numero_mesa") || null  // Aquí se incluye la mesa
        };
  
        fetch("/api/guardar_pedido", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pedido),
        })
          .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta del servidor.");
            return response.json();
          })
          .then(data => {
            mostrarNotificacion("¡Pedido enviado con éxito!");
            carrito = [];
            actualizarCarrito();
          })
          .catch(error => {
            console.error("Error al enviar el pedido:", error);
            mostrarNotificacion("Hubo un problema al enviar tu pedido.");
          });
      });
    }
  });

// ASIGNACIO NDE MESA
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const mesa = params.get("mesa");
    if (mesa) {
        const mesaSpan = document.getElementById("mesa-number");
        mesaSpan.textContent = mesa;
    }
});


  
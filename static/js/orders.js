document.addEventListener("DOMContentLoaded", () => {
    const finalizeOrder = document.getElementById("finalize-order");
  
    if (finalizeOrder) {
      finalizeOrder.addEventListener("click", () => {
        if (!window.carrito || carrito.length === 0) {
          alert("Tu carrito está vacío.");
          return;
        }
  
        const pedido = {
          items: carrito,
          total: carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
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
            alert("¡Pedido enviado con éxito!");
            carrito = [];
            actualizarCarrito();
          })
          .catch(error => {
            console.error("Error al enviar el pedido:", error);
            alert("Hubo un problema al enviar tu pedido.");
          });
      });
    }
  });
  
// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    function fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 0;
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    function fadeIn(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 1;
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async function actualizarFilaVirtual() {
    const contenedor = document.getElementById('fila-virtual');
    const errorMsg = document.getElementById('fila-error');
    try {
        const response = await fetch('/api/ver_cola');
        if (!response.ok) throw new Error('Error en la respuesta');
        const data = await response.json();

        contenedor.innerHTML = ''; // Limpiamos visualmente solo si hay nueva data
        errorMsg.style.display = 'none';

        if (data.length === 0) {
            contenedor.innerHTML = '<p class="loading-msg">No hay pedidos en cola.</p>';
            return;
        }

        data.forEach(pedido => {
            const card = document.createElement('div');
            card.className = 'card pedido';
            card.innerHTML = `
                <h3>${pedido.Nombre}</h3>
                <p><strong>Cantidad:</strong> ${pedido.Cantidad}</p>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error al actualizar la fila virtual:', error);
        errorMsg.style.display = 'block';
        contenedor.innerHTML = '';
    }
}


    // --------------------------
    // Pedido actual con tiempo
    // --------------------------

    let tiempoRestante = null;
    let intervaloTiempo = null;

    async function cargarPedido() {
    const pedidoElem = document.getElementById("pedido");
    if (!pedidoElem) return;

    try {
        const res = await fetch('/api/pedido_actual');
        const data = await res.json();

        if (data.status === "sin_pedido") {
            pedidoElem.innerHTML = '<p class="loading-msg">No hay bebida en proceso.</p>';
            return;
        }

        pedidoElem.innerHTML = `
            <div class="resumen-box">
                <p><strong>Bebida:</strong> ${data.Nombre}</p>
                <p><strong>Cantidad:</strong> ${data.Cantidad}</p>
                <p><strong>Hora:</strong> ${data.Hora}</p>
                <p><strong>Tiempo estimado:</strong> ${data.TiempoEstimado} seg</p>
            </div>
        `;
    } catch (error) {
        console.error("Error al cargar bebida en proceso:", error);
        pedidoElem.innerHTML = '<p class="error-msg">Error al cargar bebida en proceso.</p>';
    }
}

    // -------------------------------
    // Gráfica de bebidas más pedidas
    // -------------------------------

    async function cargarGraficaBebidas() {
        try {
            const res = await fetch('/grafica-bebidas');
            if (!res.ok ) throw new Error('Error al obtener datos de bebidas');
            const data = await res.json();

            const nombres = data.map(item => item.bebida);
            const cantidades = data.map(item => item.total);

            const ctx = document.getElementById('grafica-bebidas').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: nombres,
                    datasets: [{
                        label: 'Más pedidas',
                        data: cantidades,
                        backgroundColor:[
                            '#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40',
                            '#A3E4D7','#F1948A','#F7DC6F','#85C1E9','#D2B4DE','#F5B7B1',
                            '#82E0AA','#F8C471','#AED6F1','#E59866','#BB8FCE','#73C6B6'
                        ],
                        borderColor: '#1e1e2f',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#fff' }
                        },
                        title: {
                            display: true,
                            text: 'Bebidas más pedidas',
                            color: '#fff',
                            font: { size: 16 }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error al cargar gráfica:', error);
        }
    }

    setInterval(actualizarFilaVirtual, 2000);
    actualizarFilaVirtual();

    cargarPedido();
    cargarGraficaBebidas();

    setInterval(cargarPedido, 3000);
});

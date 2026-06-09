// websockets.js

const socket = io(); // Conexión con el servidor de Flask-SocketIO

socket.on('connect', () => {
    console.log('WebSocket conectado');
});

// Escucha evento de datos desde Arduino enviados por el backend
socket.on('arduino_data', data => {
    const vasoElem = document.getElementById('estado-vaso');
    const flujoElem = document.getElementById('estado-flujo');
    const errorMsg = document.getElementById('sensores-error');

    if (!vasoElem || !flujoElem) {
        console.warn('Elementos de sensores no encontrados en el DOM');
        return;
    }

    try {
        errorMsg.style.display = 'none';

        vasoElem.textContent = data.vaso ? 'Sí' : 'No';
        flujoElem.textContent = data.pulsos_flujo ?? '-';
    } catch (err) {
        console.error('Error al procesar datos de sensores:', err);
        errorMsg.style.display = 'block';
        vasoElem.textContent = '-';
        flujoElem.textContent = '-';
    }
});

socket.on('disconnect', () => {
    console.warn('WebSocket desconectado');
});

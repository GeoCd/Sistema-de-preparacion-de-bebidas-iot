    // Obtener parámetro "mesa" de la URL
function obtenerNumeroMesa() {
    const params = new URLSearchParams(window.location.search);
    const mesa = params.get("mesa");
    if (mesa) {
        console.log("Mesa asignada:", mesa);
        localStorage.setItem("numero_mesa", mesa);

        const infoMesa = document.createElement("div");
        infoMesa.className = "mesa-info";
        infoMesa.innerText = `Mesa #${mesa}`;
        document.body.prepend(infoMesa);
    }
}
obtenerNumeroMesa();

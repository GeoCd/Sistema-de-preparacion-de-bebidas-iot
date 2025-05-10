document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const menuSidebar = document.getElementById("menu-sidebar");
    const closeMenu = document.getElementById("close-menu");

    const cartToggle = document.getElementById("cart-toggle");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCart = document.getElementById("close-cart");

    // Abrir menú y cerrar carrito
    menuToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        menuSidebar.classList.add("open");
        cartSidebar?.classList.remove("open");
    });

    // Abrir carrito y cerrar menú
    cartToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        cartSidebar.classList.add("open");
        menuSidebar?.classList.remove("open");
    });

    // Cerrar menú
    closeMenu?.addEventListener("click", () => {
        menuSidebar.classList.remove("open");
    });

    // Cerrar carrito
    closeCart?.addEventListener("click", () => {
        cartSidebar.classList.remove("open");
    });

    // Cerrar ambos si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (
            !menuSidebar.contains(e.target) &&
            e.target !== menuToggle &&
            !cartSidebar.contains(e.target) &&
            e.target !== cartToggle
        ) {
            menuSidebar.classList.remove("open");
            cartSidebar.classList.remove("open");
        }
    });

    // Cerrar menú si se hace clic en un link
    document.querySelectorAll(".menu__link").forEach(link => {
        link.addEventListener("click", () => {
            menuSidebar.classList.remove("open");
        });
    });
});


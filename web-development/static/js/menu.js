document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const menuSidebar = document.getElementById("menu-sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");

    const cartToggle = document.getElementById("cart-toggle");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCart = document.getElementById("close-cart");

    // Función para abrir sidebar
    function openSidebar() {
        menuSidebar.classList.add("open");
        sidebarOverlay.classList.add("active");
        cartSidebar?.classList.remove("open");
        document.body.style.overflow = "hidden"; // Prevenir scroll
    }

    // Función para cerrar sidebar
    function closeSidebar() {
        menuSidebar.classList.remove("open");
        sidebarOverlay.classList.remove("active");
        document.body.style.overflow = ""; // Restaurar scroll
    }

    // Toggle del menú principal
    menuToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (menuSidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });


    // Cerrar carrito
    closeCart?.addEventListener("click", () => {
        cartSidebar.classList.remove("open");
    });

    // Cerrar sidebar al hacer clic en overlay
    sidebarOverlay?.addEventListener("click", () => {
        closeSidebar();
    });

    // Cerrar ambos si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (
            !menuSidebar.contains(e.target) &&
            e.target !== menuToggle &&
            !cartSidebar.contains(e.target) &&
            e.target !== cartToggle
        ) {
            closeSidebar();
            cartSidebar.classList.remove("open");
        }
    });

    // Cerrar menú al hacer clic en un link
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            closeSidebar();
        });
    });

    // Marcar link activo según la página actual
    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPath || 
            (currentPath === "/" && link.getAttribute("href").includes("index"))) {
            link.classList.add("active");
        }
    });

    // Efecto de hover mejorado para los iconos
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("mouseenter", () => {
            const icon = link.querySelector(".nav-icon");
            if (icon) {
                icon.style.transform = "scale(1.2)";
            }
        });

        link.addEventListener("mouseleave", () => {
            const icon = link.querySelector(".nav-icon");
            if (icon) {
                icon.style.transform = "scale(1)";
            }
        });
    });
});

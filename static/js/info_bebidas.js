//----- Información adicional de bebidas (precio y descripción) -----//

const INFO_BEBIDAS = {
    "NARANJADA": {
      precio: 150,
      descripcion: "Refrescante bebida de naranja natural con un toque dulce.",
      imagen: "assets/media/naranjada.jpg" 
    },
    "LIMONADA": {
      precio: 150,
      descripcion: "Clásica limonada con un balance perfecto entre dulce y ácido."
    },
    "MOJITO": {
      precio: 30,
      descripcion: "Bebida con limón y ron, ideal para refrescarte."
    },
    "JOHNCOLLINS": {
      precio: 35,
      descripcion: "Cóctel clásico con jugo de limón, jarabe y ron blanco."
    },
    "SHADYGROVE": {
      precio: 30,
      descripcion: "Mezcla de agua, limón y ron suave."
    },
    "BULLDOG": {
      precio: 32,
      descripcion: "Refrescante combinación cítrica con ron blanco."
    },
    "BOSTONCOOLER": {
      precio: 30,
      descripcion: "Cóctel ligero con sabores cítricos y ron."
    },
    "SUZIETAYLOR": {
      precio: 33,
      descripcion: "Fusión de jugo de limón y ron blanco, ideal para cualquier ocasión."
    },
    "ALAMOSPLASH": {
      precio: 30,
      descripcion: "Deliciosa mezcla con un toque tropical."
    },
    "AGAVEJULEP": {
      precio: 35,
      descripcion: "Cóctel herbal con sabor a agave y notas cítricas."
    },
    "CHANGUIRONGO": {
      precio: 34,
      descripcion: "Bebida con personalidad y un sabor refrescante."
    },
    "MARGARITA": {
      precio: 40,
      descripcion: "Famoso cóctel con limón y tequila, perfecto para relajarse."
    },
    "TEQUILASUNRISE": {
      precio: 42,
      descripcion: "Bebida vibrante con tequila y jarabe, ideal para días soleados."
    },
    "DAIQUIRI": {
      precio: 38,
      descripcion: "Cóctel clásico de ron, jugo de limón y jarabe."
    }
  };
  
  function obtenerInfoBebida(nombreBebida) {
    return INFO_BEBIDAS[nombreBebida] || { precio: 1000, descripcion: "Sin información disponible." };
  }
  
  //----- Generación dinámica de tarjetas dentro del HTML----//
  
  document.addEventListener('DOMContentLoaded', () => {
    const contenedorMenu = document.querySelector('.main__menu');
  
    for (const nombre in INFO_BEBIDAS) {
      const info = INFO_BEBIDAS[nombre];
      const nombreFormateado = nombre.charAt(0) + nombre.slice(1).toLowerCase();
  
      const itemHTML = `
        <div class="main__menu-item">
          <div class="card">
            <img src="static/media/sad.jpeg" class="card-img" alt="${nombreFormateado}">
            <div class="card-body">
              <h5 class="card-title">${nombreFormateado}</h5>
              <p class="card-text">${info.descripcion}</p>
              <p class="card-price"><strong>Precio:</strong> $${info.precio}</p>
              <button class="btn btn-primary add-to-cart" data-id="${nombre}" data-name="${nombreFormateado}" data-price="${info.precio}">Agregar al carrito</button>
            </div>
          </div>
        </div>
      `;
  
      contenedorMenu.insertAdjacentHTML('beforeend', itemHTML);
    }
    // 🔥 Aquí agregamos los event listeners a los botones
  const botonesAgregar = document.querySelectorAll('.add-to-cart');
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const nombre = boton.dataset.name;
      const precio = parseFloat(boton.dataset.price);
      agregarAlCarrito(nombre, precio);
      });
    });
  });
  
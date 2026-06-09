//----- Información adicional de bebidas (precio, descripción y tipo) -----//

const INFO_BEBIDAS = {
    "NARANJADA": {
      precio: 70,
      descripcion: "Refrescante bebida de naranja natural con un toque dulce.",
      imagen: "static/media/naranjada.jpg",
      alcoholic: false
    },
    "LIMONADA": {
      precio: 70,
      descripcion: "Clásica limonada con un balance perfecto entre dulce y ácido.",
      imagen: "static/media/limonada.jpg",
      alcoholic: false
    },
    "MOJITO": {
      precio: 130,
      descripcion: "Bebida con limón y ron, ideal para refrescarte.",
      imagen: "static/media/mojito.png",
      alcoholic: true
    },
    "JOHNCOLLINS": {
      precio: 155,
      descripcion: "Cóctel clásico con jugo de limón, jarabe y ron blanco.",
      imagen: "static/media/johncollins.jpg",
      alcoholic: true
    },
    "SHADYGROVE": {
      precio: 130,
      descripcion: "Mezcla de agua, limón y ron suave.",
      imagen: "static/media/shadygrove.png",
      alcoholic: true
    },
    "BULLDOG": {
      precio: 135,
      descripcion: "Refrescante combinación cítrica con ron blanco.",
      imagen: "static/media/bulldog.png",
      alcoholic: true
    },
    "BOSTONCOOLER": {
      precio: 130,
      descripcion: "Cóctel ligero con sabores cítricos y ron.",
      imagen: "static/media/bostoncooler.png",
      alcoholic: true
    },
    "SUZIETAYLOR": {
      precio: 135,
      descripcion: "Fusión de jugo de limón y ron blanco, ideal para cualquier ocasión.",
      imagen: "static/media/suzietaylor.jpg",
      alcoholic: true
    },
    "ALAMOSPLASH": {
      precio: 130,
      descripcion: "Deliciosa mezcla con un toque tropical.",
      imagen: "static/media/alamosplash.png",
      alcoholic: true
    },
    "AGAVEJULEP": {
      precio: 140,
      descripcion: "Cóctel herbal con sabor a agave y notas cítricas.",
      imagen: "static/media/agavejulep.png",
      alcoholic: true
    },
    "CHANGUIRONGO": {
      precio: 130,
      descripcion: "Bebida con personalidad y un sabor refrescante.",
      imagen: "static/media/changuirongo.jpg",
      alcoholic: true
    },
    "MARGARITA": {
      precio: 140,
      descripcion: "Famoso cóctel con limón y tequila, perfecto para relajarse.",
      imagen: "static/media/margarita.png",
      alcoholic: true
    },
    "TEQUILASUNRISE": {
      precio: 155,
      descripcion: "Bebida vibrante con tequila y jarabe, ideal para días soleados.",
      imagen: "static/media/tequilasunrise.png",
      alcoholic: true
    },
    "DAIQUIRI": {
      precio: 140,
      descripcion: "Cóctel clásico de ron, jugo de limón y jarabe.",
      imagen: "static/media/daiquiri.png",
      alcoholic: true
    },
    "CITRUSPUNCH": {
      precio: 110,
      descripcion: "Un dulce sabor citrico.",
      imagen: "static/media/citruspunch.png",
      alcoholic: true
    }
  };
  
  function obtenerInfoBebida(nombreBebida) {
    return INFO_BEBIDAS[nombreBebida] || { precio: 1000, descripcion: "Sin información disponible." };
  }
  
  //----- Generación dinámica de tarjetas dentro del HTML----//
  
  document.addEventListener('DOMContentLoaded', () => {
    const contenedorMenu = document.querySelector('.main__menu');
    
    if (!contenedorMenu) {
      console.error('No se encontró el contenedor .main__menu');
      return;
    }
  
    for (const nombre in INFO_BEBIDAS) {
      const info = INFO_BEBIDAS[nombre];
      const nombreFormateado = nombre.charAt(0) + nombre.slice(1).toLowerCase();
  
      const itemHTML = `
        <div class="main__menu-item">
          <div class="card" data-alcoholic="${info.alcoholic}">
            <img src="${info.imagen ? ('/' + info.imagen) : '/static/media/sad.jpeg'}" class="card-img" alt="${nombreFormateado}">

            <div class="card-body">
              <h5 class="card-title">${nombreFormateado}</h5>
              <p class="card-text">${info.descripcion}</p>
              <p class="card-price"><strong>Precio:</strong> $${info.precio}</p>
              <button class="btn btn-primary add-to-cart" data-id="${nombre}" data-name="${nombreFormateado}" data-price="${info.precio}">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      `;

  
      contenedorMenu.insertAdjacentHTML('beforeend', itemHTML);
    }

  const botonesAgregar = document.querySelectorAll('.add-to-cart');
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const nombre = boton.dataset.name;
      const precio = parseFloat(boton.dataset.price);
      agregarAlCarrito(nombre, precio);
      });
    });
  });

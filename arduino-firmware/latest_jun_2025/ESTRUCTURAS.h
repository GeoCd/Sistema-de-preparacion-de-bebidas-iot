#ifndef ESTRUCTURAS_H
#define ESTRUCTURAS_H

struct Ingrediente {
  const char* nombre;
  float cantidad_ml;
  int estacion;
};

struct Receta {
  const char* nombre;
  Ingrediente* ingredientes;
  int cantidadIngredientes;
};

#endif

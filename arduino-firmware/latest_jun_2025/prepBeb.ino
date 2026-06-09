bool preparar(String bebida) {
  Receta* receta = buscarReceta(bebida);
  if (receta == nullptr) {
    enviarError("Bebida no encontrada: " + bebida);
    return false;
  }

  for (int i = 0; i < receta->cantidadIngredientes; i++) {
    Ingrediente ing = receta->ingredientes[i];

    movPos(ing.estacion);  // Mover a estación

    int sensor, bomba, valvula;
    if (!mapearIngredientes(ing.nombre, sensor, bomba, valvula)) {
      enviarError("Ingrediente no reconocido: " + String(ing.nombre));
      return false;
    }

    dispensar(ing.cantidad_ml, sensor, bomba, valvula);
  }

  return true;
}

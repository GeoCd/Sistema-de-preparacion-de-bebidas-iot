const int pasosPorPosicion = 4000; // 40 stepsPerMm
const int delayPaso = 800; // Ajusta velocidad
int posicionActual = 1;  // Comenzamos en POS1

void movPos(int posDeseada) {
  // Validación de rango
  if (posDeseada < 1 || posDeseada > 3 || posDeseada == posicionActual) {
    return;  // No hacer nada si es inválida o ya está en esa posición
  }

  // Activar el driver
  digitalWrite(EN_PIN, LOW);
  delay(100);

  // Determinar dirección
  if (posDeseada > posicionActual) {
    digitalWrite(DIR_PIN, HIGH); // CW
  } else {
    digitalWrite(DIR_PIN, LOW);  // CCW
  }

  // Calcular cuántas posiciones mover
  int diferencia = abs(posDeseada - posicionActual);
  int totalPasos = pasosPorPosicion * diferencia;

  // Mover el motor
  for (int i = 0; i < totalPasos; i++) {
    digitalWrite(STEP_PIN, HIGH);
    delayMicroseconds(delayPaso);
    digitalWrite(STEP_PIN, LOW);
    delayMicroseconds(delayPaso);
  }

  // Actualizar la posición
  posicionActual = posDeseada;

  // Desactivar el driver
  digitalWrite(EN_PIN, HIGH);
}

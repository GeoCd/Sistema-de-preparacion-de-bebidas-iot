// --- VARIABLES GLOBALES (externas) ---
//extern const int FSR_PIN;              // Debe estar definido en tu archivo principal
//extern volatile int contadorPulsos;    // Incrementado por ISR en valorDispensado.ino

// --- CONFIGURACIÓN PARA ENVÍO PERIÓDICO ---
unsigned long ultimoEnvioWS = 0;
const unsigned long intervaloWS = 3000; // cada 3 segundos (opcional)

// --- ENVÍA ESTADO EN FORMATO JSON ---
/*void enviarEstadoSensores() {
  StaticJsonDocument<128> doc;
  doc["vaso"] = analogRead(FSR_PIN) > 100;     // umbral ajustable
  doc["pulsos_flujo"] = contadorPulsos;
  serializeJson(doc, Serial);
  Serial.println();  // finaliza con salto de línea para lectura de Flask
}*/

void enviarEstadoSensores() {
  StaticJsonDocument<128> doc;
  doc["vaso"] = analogRead(FSR_PIN) > 100;
  doc["pulsos_flujo"] = contadorPulsos;

  serializeJson(doc, Serial);
  Serial.println();

  // Debug para ver en Monitor Serial:
  serializeJsonPretty(doc, Serial); 
  Serial.println();
}

// --- ESCUCHA COMANDOS DESDE SERIAL COMO "ESTADO" ---
void procesarComandoWebSocket() {
  if (!Serial.available()) return;

  String entrada = Serial.readStringUntil('\n');
  entrada.trim();

  if (entrada == "ESTADO") {
    enviarEstadoSensores();
  }
}

// --- LLAMAR EN loop() PRINCIPAL ---
void actualizarWebSocket() {
  procesarComandoWebSocket();

  // Si deseas envío periódico automático:
  if (millis() - ultimoEnvioWS > intervaloWS) {
    enviarEstadoSensores();
    ultimoEnvioWS = millis();
  }
}

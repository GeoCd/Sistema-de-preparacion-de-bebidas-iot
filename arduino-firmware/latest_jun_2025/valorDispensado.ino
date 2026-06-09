volatile unsigned int contadorPulsos = 0;
volatile bool ultimoEstadoSensor = LOW;

// Valor original 0.4545  --- 0.22725
// const float mlPorPulso = 0.469924812;
// const float mlPorPulso = 0.464925; - error del 5.3%
const float mlPorPulso = 0.48;
const float compensacion = 0.0;

// Variables auxiliares para sensor activo y control de interrupción
volatile int sensorActivo;

void dispensar(float volumenObjetivoML, int pinSensor, int pinBomba, int pinValvula) {
  float flujoTotal = 0;
  noInterrupts(); // Proteger el acceso compartido
  contadorPulsos = 0;
  sensorActivo = pinSensor;
  ultimoEstadoSensor = digitalRead(pinSensor);
  enableInterrupt(pinSensor, contadorPulsosISR, CHANGE);
  interrupts();
  digitalWrite(pinValvula, LOW);  // Encender valvula
  delay(200);
  digitalWrite(pinBomba, LOW);  // Encender bomba

  while (flujoTotal < (volumenObjetivoML - compensacion)) {
    
    noInterrupts();
    int copiaPulsos = contadorPulsos;
    interrupts();
    flujoTotal = copiaPulsos * mlPorPulso;
  }

  digitalWrite(pinBomba, HIGH);  // Apagar bomba
  delay(500);
  digitalWrite(pinValvula, HIGH);  // Apagar valvula
  disableInterrupt(pinSensor);
}


void contadorPulsosISR() {
  bool estadoActual = digitalRead(sensorActivo);
  if (!ultimoEstadoSensor && estadoActual) {
    contadorPulsos++;
  }
  ultimoEstadoSensor = estadoActual;
}

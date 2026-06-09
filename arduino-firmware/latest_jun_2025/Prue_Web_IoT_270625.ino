#include <EnableInterrupt.h>
#include <ArduinoJson.h>
#include "ESTRUCTURAS.h"
/*Interrupt Type | Pins
 -------------- | --------------
 External       | 2 3 and 18-21
 Pin Change     | 10-15*/
// Pines para sensores y bombas
const int sen_AgMin  = 2;  // Morado -> Gris
const int sen_ZumLim = 3;  // Azul -> Blanco
const int sen_ZumNar = 10; // Verde -> Negro 
const int sen_JarNat = 11; // Amarillo -> Naranja
const int sen_Gin  = 12;   // Naranja -> Amarillo
const int sen_TeqBla = 13; // Rojo -> Gris
const int sen_RonBla = 14; // Cafe -> Gris

// Definiciones de bombas
const int bom_AgMin  = 22;
const int bom_ZumLim = 24;
const int bom_ZumNar = 26;
const int bom_JarNat = 28;
const int bom_Gin = 30;
const int bom_TeqBla = 32;
const int bom_RonBla = 34;

// Definicion de valvulas
const int valv_AgMin = 23;
const int valv_ZumLim = 25;
const int valv_ZumNar = 27;
const int valv_JarNat = 29;
const int valv_Gin = 31;
const int valv_TeqBla = 33;
const int valv_RonBla = 35;

// Definicion Driver TB6600
const int STEP_PIN = 49; // STEP PULSE 
const int DIR_PIN = 51;
const int EN_PIN = 53;

// Definicion FSR 406
const int FSR_PIN = A0;

// FSR-406
bool vasoPresente = false;

void setup() {
  configurarIO();
}

void loop() {
  if (Serial.available()) {
    String json = Serial.readStringUntil('\n');
    StaticJsonDocument<512> doc; 
    
    DeserializationError err = deserializeJson(doc, json);
    if (err) {
      enviarError("JSON inválido");
      return;
    }

    String bebida = doc["Nombre"];
    int cantidad = doc["Cantidad"];
    
    esperarVasoPresente(); // Vaso colocado
    delay(300);

    for (int i = 0; i < cantidad; i++) {
      esperarVasoPresente(); // Vaso colocado
      delay(200);
      if (!preparar(bebida)) {
        return;  // Error ya fue enviado
      }
      movPos(1);  // Regresar al inicio
      delay(200);
      esperarVasoRetirado(); // Vaso fuera
    }
    delay(200);
    enviarConfirmacion(); //Envia ok
  }
}

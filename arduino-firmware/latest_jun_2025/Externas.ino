/*bool verificarVaso() {
  int lectura = analogRead(FSR_PIN);
  vasoPresente = lectura > 100;  // Umbral ajustable
  return vasoPresente;
}*/

bool verificarVaso() {
  int suma = 0;
  for (int i = 0; i < 5; i++) {
    suma += analogRead(FSR_PIN);
    delay(300);
  }
  int promedio = suma / 5;
  if (promedio <= 1020) {
  vasoPresente = true;
  } else {
    vasoPresente = false;
    }
    return vasoPresente;
}


void esperarVasoPresente() {
  while (!verificarVaso()) {
    delay(100);
  }
}

void esperarVasoRetirado() {
  while (verificarVaso()) {
    delay(100);
  }
}


void enviarError(String mensaje) {
  StaticJsonDocument<128> doc;
  doc["error"] = mensaje;
  serializeJson(doc, Serial);
}

void enviarConfirmacion() {
 StaticJsonDocument<64> doc;
 doc["ok"] = true;
 serializeJson(doc, Serial);
 Serial.println(); 
}

bool mapearIngredientes(String nombre, int &sensor, int &bomba, int &valvula) {
  if (nombre == "Agua") {
    sensor = sen_AgMin; bomba = bom_AgMin; valvula = valv_AgMin;
  } else if (nombre == "JugoL") {
    sensor = sen_ZumLim; bomba = bom_ZumLim; valvula = valv_ZumLim;
  } else if (nombre == "JugoN") {
    sensor = sen_ZumNar; bomba = bom_ZumNar; valvula = valv_ZumNar;
  } else if (nombre == "Jarabe") {
    sensor = sen_JarNat; bomba = bom_JarNat; valvula = valv_JarNat;
  } else if (nombre == "Gin") {
    sensor = sen_Gin; bomba = bom_Gin; valvula = valv_Gin;
  } else if (nombre == "Tequila") {
    sensor = sen_TeqBla; bomba = bom_TeqBla; valvula = valv_TeqBla;
  } else if (nombre == "Ron") {
    sensor = sen_RonBla; bomba = bom_RonBla; valvula = valv_RonBla;
  } else {
    return false;
  }
  return true;
}

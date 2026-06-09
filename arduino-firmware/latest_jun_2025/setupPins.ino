void configurarIO() {
  //Serial para pruebas
  Serial.begin(9600);
  // Sensores como entradas
  pinMode(sen_AgMin, INPUT);
  pinMode(sen_ZumLim, INPUT);
  pinMode(sen_ZumNar, INPUT);
  pinMode(sen_JarNat, INPUT);
  pinMode(sen_Gin, INPUT);
  pinMode(sen_TeqBla, INPUT);
  pinMode(sen_RonBla, INPUT);

  // Bombas como salidas
  pinMode(bom_AgMin, OUTPUT);
  pinMode(bom_ZumLim, OUTPUT);
  pinMode(bom_ZumNar, OUTPUT);
  pinMode(bom_JarNat, OUTPUT);
  pinMode(bom_Gin, OUTPUT);
  pinMode(bom_TeqBla, OUTPUT);
  pinMode(bom_RonBla, OUTPUT);

  //Apagar las bombas al inicio
  digitalWrite(bom_AgMin, HIGH);
  digitalWrite(bom_ZumLim, HIGH);
  digitalWrite(bom_ZumNar, HIGH);
  digitalWrite(bom_JarNat, HIGH);
  digitalWrite(bom_Gin, HIGH);
  digitalWrite(bom_TeqBla, HIGH);
  digitalWrite(bom_RonBla, HIGH);

  // Válvulas como salidas
  pinMode(valv_AgMin, OUTPUT);
  pinMode(valv_ZumLim, OUTPUT);
  pinMode(valv_ZumNar, OUTPUT);
  pinMode(valv_JarNat, OUTPUT);
  pinMode(valv_Gin, OUTPUT);
  pinMode(valv_TeqBla, OUTPUT);
  pinMode(valv_RonBla, OUTPUT);

  //Apagar las valvulas al inicio
  digitalWrite(valv_AgMin, HIGH);
  digitalWrite(valv_ZumLim, HIGH);
  digitalWrite(valv_ZumNar, HIGH);
  digitalWrite(valv_JarNat, HIGH);
  digitalWrite(valv_Gin, HIGH);
  digitalWrite(valv_TeqBla, HIGH);
  digitalWrite(valv_RonBla, HIGH);

  // Configuracion para controlador TB6600
  pinMode(DIR_PIN, OUTPUT);
  pinMode(STEP_PIN, OUTPUT);
  pinMode(EN_PIN, OUTPUT);
  // Deshabilita el Driver por defecto
  digitalWrite(EN_PIN, HIGH);  
}

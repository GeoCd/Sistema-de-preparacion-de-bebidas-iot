Receta receta_LIMONADA = {
  "LIMONADA",
  ingredientes_LIMONADA,
  sizeof(ingredientes_LIMONADA) / sizeof(ingredientes_LIMONADA[0])
};

Receta receta_NARANJADA = {
  "NARANJADA",
  ingredientes_NARANJADA,
  sizeof(ingredientes_NARANJADA) / sizeof(ingredientes_NARANJADA[0])
};

Receta receta_VIRGINMARGARITA = {
  "VIRGINMARGARITA",
  ingredientes_VIRGINMARGARITA,
  sizeof(ingredientes_VIRGINMARGARITA) / sizeof(ingredientes_VIRGINMARGARITA[0])
};

Receta receta_CITRUSPUNCH = {
  "CITRUSPUNCH",
  ingredientes_CITRUSPUNCH,
  sizeof(ingredientes_CITRUSPUNCH) / sizeof(ingredientes_CITRUSPUNCH[0])
};

Receta receta_MOJITO = {
  "MOJITO",
  ingredientes_MOJITO,
  sizeof(ingredientes_MOJITO) / sizeof(ingredientes_MOJITO[0])
};

Receta receta_JOHNCOLLINS = {
  "JOHNCOLLINS",
  ingredientes_JOHNCOLLINS,
  sizeof(ingredientes_JOHNCOLLINS) / sizeof(ingredientes_JOHNCOLLINS[0])
};

Receta receta_SHADYGROVE = {
  "SHADYGROVE",
  ingredientes_SHADYGROVE,
  sizeof(ingredientes_SHADYGROVE) / sizeof(ingredientes_SHADYGROVE[0])
};

Receta receta_BULLDOG = {
  "BULLDOG",
  ingredientes_BULLDOG,
  sizeof(ingredientes_BULLDOG) / sizeof(ingredientes_BULLDOG[0])
};

Receta receta_BOSTONCOOLER = {
  "BOSTONCOOLER",
  ingredientes_BOSTONCOOLER,
  sizeof(ingredientes_BOSTONCOOLER) / sizeof(ingredientes_BOSTONCOOLER[0])
};

Receta receta_SUZIETAYLOR = {
  "SUZIETAYLOR",
  ingredientes_SUZIETAYLOR,
  sizeof(ingredientes_SUZIETAYLOR) / sizeof(ingredientes_SUZIETAYLOR[0])
};

Receta receta_ALAMOSPLASH = {
  "ALAMOSPLASH",
  ingredientes_ALAMOSPLASH,
  sizeof(ingredientes_ALAMOSPLASH) / sizeof(ingredientes_ALAMOSPLASH[0])
};

Receta receta_AGAVEJULEP = {
  "AGAVEJULEP",
  ingredientes_AGAVEJULEP,
  sizeof(ingredientes_AGAVEJULEP) / sizeof(ingredientes_AGAVEJULEP[0])
};

Receta receta_CHANGUIRONGO = {
  "CHANGUIRONGO",
  ingredientes_CHANGUIRONGO,
  sizeof(ingredientes_CHANGUIRONGO) / sizeof(ingredientes_CHANGUIRONGO[0])
};

Receta receta_MARGARITA = {
  "MARGARITA",
  ingredientes_MARGARITA,
  sizeof(ingredientes_MARGARITA) / sizeof(ingredientes_MARGARITA[0])
};

Receta receta_TEQUILASUNRISE = {
  "TEQUILASUNRISE",
  ingredientes_TEQUILASUNRISE,
  sizeof(ingredientes_TEQUILASUNRISE) / sizeof(ingredientes_TEQUILASUNRISE[0])
};

Receta receta_DAIQUIRI = {
  "DAIQUIRI",
  ingredientes_DAIQUIRI,
  sizeof(ingredientes_DAIQUIRI) / sizeof(ingredientes_DAIQUIRI[0])
};

Receta* listaRecetas[] = {
  &receta_LIMONADA,
  &receta_NARANJADA,
  &receta_VIRGINMARGARITA,
  &receta_CITRUSPUNCH,
  &receta_MOJITO,
  &receta_JOHNCOLLINS,
  &receta_SHADYGROVE,
  &receta_BULLDOG,
  &receta_BOSTONCOOLER,
  &receta_SUZIETAYLOR,
  &receta_ALAMOSPLASH,
  &receta_AGAVEJULEP,
  &receta_CHANGUIRONGO,
  &receta_MARGARITA,
  &receta_TEQUILASUNRISE,
  &receta_DAIQUIRI
};

const int totalRecetas = sizeof(listaRecetas) / sizeof(listaRecetas[0]);

Receta* buscarReceta(String nombre) {
  nombre.toUpperCase();
  nombre.trim();
  for (int i = 0; i < totalRecetas; i++) {
    if (nombre == listaRecetas[i]->nombre) {
      return listaRecetas[i];
    }
  }
  return nullptr;
}

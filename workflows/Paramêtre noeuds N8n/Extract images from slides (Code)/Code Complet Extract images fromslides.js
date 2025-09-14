// Entrée : sortie brute du HTTP Request Get Slides
const slides = $json.slides || [];

// Dictionnaire final
const images = {};

// Parcours des slides et des objets
for (const slide of slides) {
  for (const el of (slide.pageElements || [])) {
    // On garde uniquement ceux dont le titre finit par .png
    if (el.title && el.title.endsWith(".png")) {
      // Ex : titre "S1_GRAPH_IMG.png" → clé "S1_GRAPH_IMG"
      const key = el.title.replace(".png", "");
      images[key] = {
        objectId: el.objectId,
        altText: el.title
      };
    }
  }
}

// Sortie unique
return [{
  json: {
    images
  }
}];

const report = $json.placeholders || {};   // on cible bien l'objet avec S1_SUBx_PCT

// Palette couleurs par session
const colors = {
  S1: "rgba(75,192,192,1)",   // vert
  S2: "rgba(255,99,132,1)",   // rouge
  S3: "rgba(255,159,64,1)",   // orange
  S4: "rgba(54,162,235,1)",   // bleu
};

// Graphe comparatif (barres par sous-sections)
function compareUrl(sectionId, labels, valuesUser, valuesAvg, colorUser) {
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Vos résultats',
          data: valuesUser,
          backgroundColor: colorUser
        },
        {
          label: 'Moyenne',
          data: valuesAvg,
          backgroundColor: 'rgba(128,128,128,0.7)'
        }
      ]
    },
   
  }))}`;
}

// Graphe radar global
function radarUrl(labels, values) {
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: 'Vos résultats globaux',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.4)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    },
    options: {
      scales: {
        r: { min: 0, max: 100, ticks: { stepSize: 20 } }
      },
      plugins: {
        title: { display: true, text: 'Vue d’ensemble' }
      }
    }
  }))}`;
}

// Graphe progress bar par session (avec type progressBar)
function progressUrl(sessionId, pct, color) {
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
    type: 'progressBar',
    data: {
      datasets: [
        {
          data: [pct],
          backgroundColor: color
        }
      ]
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          formatter: (val) => val + '%'
        }
      }
    }
  }))}&width=1250&height=70`;
}

const out = {};

// Graphiques par sous-sections (barres comparatives + progress bars)
for (let i = 1; i <= 4; i++) {
  const key = `S${i}`;
  // Mapping des sous-sections par section
const sectionLabels = {
  S1: ["Navigation & Internet", "Logiciels & Sécurité", "Gestion des fichiers"],
  S2: ["Emails & messagerie", "Cloud & outils collaboratifs", "Réseaux sociaux & visioconférence"],
  S3: ["Protection contre les menaces", "Mots de passe & authentification", "Vie privée & conformité"],
  S4: ["Services & usages en ligne", "Information & actualité numérique", "Programmation & intelligence artificielle"]
};

// Récupère les bons labels pour la section courante
const labels = sectionLabels[key] || [
  "Sous-section 1", 
  "Sous-section 2", 
  "Sous-section 3"
];

// Les valeurs utilisateur restent identiques
const valuesUser = [
  Number(String(report[`${key}_SUB1_PCT`] || "0").replace("%","")),
  Number(String(report[`${key}_SUB2_PCT`] || "0").replace("%","")),
  Number(String(report[`${key}_SUB3_PCT`] || "0").replace("%",""))
];

  const valuesAvg = [
    Number(String(report[`${key}_SUB1_AVG`] || "0").replace("%","")),
    Number(String(report[`${key}_SUB2_AVG`] || "0").replace("%","")),
    Number(String(report[`${key}_SUB3_AVG`] || "0").replace("%",""))
  ];

  const colorUser = colors[key];

  // Graphe comparatif
  out[`${key}_GRAPH_IMG`] = compareUrl(i, labels, valuesUser, valuesAvg, colorUser);

  // Progress bar style plein
  const sessionPct = Number(String(report[`${key}_PCT`] || "0").replace("%",""));
  out[`${key}_PROGRESS_IMG`] = progressUrl(i, sessionPct, colorUser);
}

// Graphe radar global
const radarLabels = ["Compétences numériques de base", "Communication & collaboration enligne", "Sécurité numérique & protection des données", "Culture numérique & usages avancés"];
const radarValues = radarLabels.map((_, i) => {
  const sid = i + 1;
  return Number(String(report[`S${sid}_PCT`] || "0").replace("%",""));
});
out["GLOBAL_RADAR_IMG"] = radarUrl(radarLabels, radarValues);

return [{ json: out }];

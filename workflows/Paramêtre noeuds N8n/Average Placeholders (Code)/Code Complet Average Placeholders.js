// Entrée = liste de lignes avec row_number, clé, somme, n, moyenne
const rows = $input.all().map(item => item.json);

// Helper pour formater %
function pctFmt(n) {
  return `${Number(n || 0).toFixed(0)}%`;
}

const placeholders = {};

for (const r of rows) {
  if (r.clé && r.moyenne !== undefined) {
    // Exemple : clé = "S1_SUB1_AVG"
    placeholders[r.clé] = pctFmt(r.moyenne);
  }
}

return [{
  json: {
    placeholders
  }
}];

// Entrée = sortie directe de build_report
const report = $json || {};

// helper pour formater %
function pctFmt(n) {
  return `${Number(n || 0).toFixed(0)}%`;
}

// Dictionnaire final
const placeholders = {};

// --- Valeurs globales ---
placeholders["DATE"]       = report.horodateur || "";
placeholders["GLOBAL_PCT"] = pctFmt(report.global?.pct || 0);
placeholders["EMAIL"]      = report.email || "";

// --- Sessions ---
if (Array.isArray(report.sessions)) {
  for (const s of report.sessions) {
    const sid = s.id; // "1".."4"

    placeholders[`S${sid}_TITLE`] = s.label || `Session ${sid}`;
    placeholders[`S${sid}_PCT`]   = pctFmt(s.total_pct || 0);

    if (Array.isArray(s.subthemes)) {
      s.subthemes.forEach((st, i) => {
        const n = i + 1;
        placeholders[`S${sid}_SUB${n}_TITLE`] = st.label || `Sous-thème ${n}`;
        placeholders[`S${sid}_SUB${n}_PCT`]   = pctFmt(st.pct || 0);
        placeholders[`S${sid}_SUB${n}_STARS`] = st.stars || "";
        placeholders[`S${sid}_SUB${n}_BILAN`] = st.bilan || "";
      });
    }
  }
}

// --- Sortie ---
return [{
  json: {
    placeholders
  }
}];


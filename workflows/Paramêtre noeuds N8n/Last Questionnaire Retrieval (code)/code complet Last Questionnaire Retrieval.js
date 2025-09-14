// --- 1) Ne garder que la dernière ligne selon "Horodateur" (format FR) ---
function parseFRDatetime(s) {
  if (!s) return 0;
  const m = String(s).match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (!m) return 0;
  const [ , dd, MM, yyyy, HH, mm, ss ] = m.map(Number);
  return new Date(yyyy, MM - 1, dd, HH, mm, ss).getTime();
}

const all = $items();
if (!all.length) return [];

// Trie les lignes par date croissante
all.sort((a, b) => parseFRDatetime(a.json.Horodateur) - parseFRDatetime(b.json.Horodateur));
const last = all[all.length - 1].json;

// --- 2) Extraire uniquement les champs utiles ---
const SEP = ", ";
const out = {
  Horodateur: last["Horodateur"],
  "Adresse e-mail": last["Adresse e-mail"] || ""   // 👈 ajout de l'adresse e-mail
};

for (const [key, val] of Object.entries(last)) {
  if (key === "Horodateur" || key === "Adresse e-mail") continue; // 👈 on ne les retrait pas

  if (typeof val === "string" && val.includes(SEP)) {
    out[`${key}__arr`] = val.split(SEP).map(s => s.trim()).filter(Boolean);
  }
}

return [{ json: out }];
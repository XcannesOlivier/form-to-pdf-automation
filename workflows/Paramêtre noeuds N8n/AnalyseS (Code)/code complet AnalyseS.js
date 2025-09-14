// --- Helpers ---
const norm = (s) => String(s ?? "")
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .replace(/[“”«»"']/g, "")
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();

const input = items[0].json; // ⚠️ Run Once for All Items
const rules = input.rules;
if (!rules) {
  return [{ json: { error: "Aucune règle trouvée dans input.rules" } }];
}

const thresholds = rules.thresholds || { beginner: 40, intermediate: 70 };
const questions = rules.questions || [];
const horodateur = input["Horodateur"] || null;
const email = input["Adresse e-mail"] || "";   // 👈 récupère l’email

function findAnswers(label) {
  const needle = norm(label);
  for (const k of Object.keys(input)) {
    if (k.endsWith("__arr") && norm(k.replace("__arr", "")).includes(needle)) {
      return input[k];
    }
  }
  console.log("🔎 No match for:", needle, "in keys:", Object.keys(input));
  return [];
}

// --- INIT blocs ---
const blocs = {
  q01_q10: { score: 0, max: 0 },
  q11_q20: { score: 0, max: 0 },
  q21_q30: { score: 0, max: 0 },
  q31_q40: { score: 0, max: 0 },
};

const details = [];
let totalScore = 0;
let totalMax = 0;

for (const q of questions) {
  const options = q.options || {};
  const answers = findAnswers(q.label_snippet || q.key);
  const answersNorm = new Set(answers.map(norm));

  const maxForQ = Object.values(options)
    .map(v => Number(v) || 0)
    .filter(v => v > 0)
    .reduce((a, b) => a + b, 0);

  let scoreForQ = 0;
  for (const [rawLabel, val] of Object.entries(options)) {
    const label = norm(rawLabel);
    if (answersNorm.has(label)) {
      scoreForQ += Number(val) || 0;
    }
  }

  if (scoreForQ > maxForQ) scoreForQ = maxForQ;

  totalScore += scoreForQ;
  totalMax += maxForQ;

  // Bloc ?
  const qNum = Number(q.key.replace("q", ""));
  let bloc = null;
  if (qNum >= 1 && qNum <= 10) bloc = "q01_q10";
  else if (qNum >= 11 && qNum <= 20) bloc = "q11_q20";
  else if (qNum >= 21 && qNum <= 30) bloc = "q21_q30";
  else if (qNum >= 31 && qNum <= 40) bloc = "q31_q40";

  if (bloc) {
    blocs[bloc].score += scoreForQ;
    blocs[bloc].max += maxForQ;
  }

  details.push({
    key: q.key,
    label: q.label_snippet,
    theme: q.theme || null,
    answers,
    score: scoreForQ,
    max: maxForQ
  });
}

// --- Calculs finaux ---
const percent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
let level = "advanced";
if (percent < thresholds.beginner) level = "beginner";
else if (percent < thresholds.intermediate) level = "intermediate";

function blocInfo(b) {
  const bloc = blocs[b];
  return {
    score: bloc.score,
    max: bloc.max,
    percent: bloc.max > 0 ? Math.round((100 * bloc.score) / bloc.max) : 0
  };
}

// --- Sortie ---
return [{
  json: {
    horodateur,
    email,  // 👈 adresse e-mail passée de l’input à l’output
    total_score: totalScore,
    total_max: totalMax,
    percent,
    level,
    blocks: {
      q01_q10: blocInfo("q01_q10"),
      q11_q20: blocInfo("q11_q20"),
      q21_q30: blocInfo("q21_q30"),
      q31_q40: blocInfo("q31_q40"),
    },
    details
  }
}];
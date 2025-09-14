// ================= Helpers =================
const pct   = (s, m) => (m ? +(100 * s / m).toFixed(1) : 0);
const stars = (p) => p < 40 ? "★☆☆" : p < 70 ? "★★☆" : "★★★";

// Bilan générique (fallback)
const genericBilan = (p) =>
  p < 40 ? "Niveau à consolider : reprenez les bases essentielles."
: p < 70 ? "Bon socle : poursuivez des exercices ciblés pour progresser."
         : "Très bonne maîtrise : continuez avec des cas plus avancés.";

const levelFromPct = (p) =>
  p < 40 ? "Débutant" : p < 60 ? "En progrès" : p < 80 ? "Compétent" : "Expert";

const levelKey = (p) =>
  p < 40 ? "debutant" : p < 60 ? "en_progres" : p < 80 ? "competent" : "expert";

// ================= Bilans spécifiques par sous-thème =================
// Clé = `${sessionId}:${partId}`  →  "1:1" .. "4:3"
const BILANS = {
  // Session 1
  "1:1": { // Navigation & Internet
    debutant:   "Bases fragiles : comprendre navigateur, recherche, différence email/URL.",
    en_progres: "Bases acquises mais confusions sur URL/email/moteur. Continue à explorer.",
    competent:  "Formulaires, téléchargements, onglets multiples. Découvre extensions et réglages.",
    expert:     "Bonne maîtrise : recherche efficace, distinction email/web. Poursuis avec favoris/onglets.",
  },
  "1:2": { // Logiciels & Sécurité
    debutant:   "Difficultés : mises à jour, copier-coller, pièces jointes sécurisées.",
    en_progres: "Bonnes bases, mais automatismes à renforcer (MAJ, copier-coller, PJ sûres).",
    competent:  "Paramètres, désinstallation propre, partage de PJ lourdes par lien.",
    expert:     "À l’aise avec MAJ, copier-coller, PJ. Explore raccourcis et formats de fichiers.",
  },
  "1:3": { // Fichiers & Organisation
    debutant:   "Difficultés : distinguer appareils, types de fichiers, créer dossier, enregistrer.",
    en_progres: "Bonnes intuitions, mais progresse sur organisation : dossiers, extensions, emplacements.",
    competent:  "Nommage standard, tri par type, recherche avancée.",
    expert:     "Bonne maîtrise : fichiers, dossiers, enregistrement. Explore sauvegardes et cloud.",
  },

  // Session 2
  "2:1": { // Emails & messagerie
    debutant:   "Fragile : antivirus, liens/PJ dangereux, mots de passe, verrouillage appareil.",
    en_progres: "Réflexes acquis mais erreurs. Varie les mots de passe, verrouille et reste vigilant.",
    competent:  "Utilise modèles, CC/Cci correctement, partage PJ lourdes par lien.",
    expert:     "Bon réflexes : phishing, mots de passe variés, protection appareil. Sensibilise ton entourage.",
  },
  "2:2": { // Cloud & collaboratif
    debutant:   "Pas de réflexes sécurité : attention SMS suspects, découvre 2FA et gestion données.",
    en_progres: "Pratiques utiles mais à renforcer : active 2FA, maîtrise données et signalements.",
    competent:  "Permissions fines, modèles d’équipe, intégrations Drive/Docs/Calendar.",
    expert:     "Réflexes solides : 2FA, gestion données, réaction aux SMS frauduleux. Bravo.",
  },
  "2:3": { // Réseaux sociaux & visioconf
    debutant:   "Bases manquantes : MAJ régulières, connexion https.",
    en_progres: "Réflexes partiels : active MAJ auto, vérifie cadenas https.",
    competent:  "Animation, modération, netiquette.",
    expert:     "Bonne pratique : MAJ régulières, connexions sécurisées. Vérifie aussi sur mobile.",
  },

  // Session 3
  "3:1": { // Protection menaces
    debutant:   "Repère liens/PJ suspects ; scan antivirus si doute.",
    en_progres: "Identifie phishing/SMS frauduleux, signale (33700), change mots de passe.",
    competent:  "2FA généralisée, MAJ rapides, sensibilise entourage.",
    expert:     "Procédures incidents, sauvegardes chiffrées, outils anti-phishing, veille.",
  },
  "3:2": { // Mots de passe & authentification
    debutant:   "Bases faibles : boîte de réception, email pro/perso, objet clair, destinataires.",
    en_progres: "Bon niveau mais erreurs : objet précis, vérifie destinataires, contexte formel.",
    competent:  "Clés 2FA/TOTP, révocation accès, codes de secours.",
    expert:     "Maîtrise email : objets, adresses, réponses collectives. Explore signatures et filtres.",
  },
  "3:3": { // Vie privée & conformité
    debutant:   "Bases à acquérir : partage cloud, messagerie instantanée, public/privé réseaux.",
    en_progres: "Bases présentes mais confusions : pratique partage contrôlé, messages adaptés.",
    competent:  "Export/suppression données, chiffrement, mots de passe pour archives.",
    expert:     "À l’aise : partage, messageries, confidentialité réseaux. Bonne maîtrise.",
  },

  // Session 4
  "4:1": { // Services & usages en ligne
    debutant:   "Fragile : docs collaboratifs, calendrier partagé, visioconf.",
    en_progres: "Comprend outils, mais pratique : crée doc, planifie événement, rejoins visioconf.",
    competent:  "Paiements, plafonds/alertes, dossiers en ligne complets.",
    expert:     "À l’aise : partage docs, réunions, calendriers. Efficace à distance.",
  },
  "4:2": { // Information & actualité
    debutant:   "Bases manquantes : site sécurisé, fake news, services publics en ligne.",
    en_progres: "Pratiques utiles mais à renforcer : https, croise sources, démarches admin.",
    competent:  "Analyse biais/financements, suit sources fiables.",
    expert:     "Réflexes solides : achats sécurisés, esprit critique, autonomie admin. Bravo.",
  },
  "4:3": { // Programmation & IA
    debutant:   "Fragile : cookies, vérif infos, suivre actualité numérique.",
    en_progres: "Bonne intuition mais zones d’ombre : cookies, sources, suivre IA.",
    competent:  "Projets structurés, Git, algos clairs, IA prototypage.",
    expert:     "Bonne compréhension : données, vérif infos, actu numérique/IA. Bravo.",
  },
};

// ================= Données d’entrée =================
const a = $input.all()[0].json;

// Index par question: "q1".."q40" -> {score,max}
const qIndex = new Map();
for (const d of (a.details || [])) {
  qIndex.set(d.key, {
    score: Number(d.score ?? 0),
    max:   Number(d.max ?? d.max_score ?? 0),
  });
}

// Découpage explicite (corrigé S2)
const EXPLICIT_MAP = {
  "1": { "1": ["q1","q2","q4"], "2": ["q5","q6","q8"], "3": ["q3","q7","q9","q10"] },
  "2": { "1": ["q11","q12","q13","q14","q16"], "2": ["q15","q17","q18"], "3": ["q19","q20"] },
  "3": { "1": ["q21","q22","q23","q26"], "2": ["q24","q25","q27"], "3": ["q28","q29","q30"] },
  "4": { "1": ["q31","q35","q40"], "2": ["q32","q33","q34","q36"], "3": ["q37","q38","q39"] },
};

// Libellés (optionnels)
const LABELS = {
  "1": ["Navigation & Internet","Logiciels & Sécurité","Gestion des fichiers & Organisation"],
  "2": ["Emails & messagerie","Cloud & outils collaboratifs","Réseaux sociaux & visioconférence"],
  "3": ["Protection contre les menaces","Mots de passe & authentification","Vie privée & conformité"],
  "4": ["Services & usages en ligne","Information & actualité numérique","Programmation & intelligence artificielle"],
};

// Utils
const sumQ = (keys) => {
  let s = 0, m = 0;
  for (const k of keys) {
    const qm = qIndex.get(k) || { score:0, max:0 };
    s += qm.score; m += qm.max;
  }
  return { score: s, max: m, pct: pct(s, m) };
};

const subthemeBilan = (sId, pId, p) => {
  const lk = levelKey(p);
  const entry = BILANS[`${sId}:${pId}`];
  return (entry && entry[lk]) ? entry[lk] : genericBilan(p);
};

// ================= Construction du rapport =================
const report = {
  horodateur: a.horodateur,
  email: a["email"] || "", 
  global: {
    score: a.total_score,
    max:   a.total_max,
    pct:   a.percent,
    level: a.level || levelFromPct(a.percent),
    stars: stars(a.percent),
    bilan: genericBilan(a.percent),
  },
  sessions: [],
};

// Sessions 1..4
for (const sId of ["1","2","3","4"]) {
  const mapSess = EXPLICIT_MAP[sId];
  if (!mapSess) continue;

  const allQs = Array.from(new Set([...(mapSess["1"]||[]), ...(mapSess["2"]||[]), ...(mapSess["3"]||[]) ]));
  const total = sumQ(allQs);

  const labels = LABELS[sId] || ["Partie 1","Partie 2","Partie 3"];
  const parts = ["1","2","3"].map((pid, idx) => {
    const qs = mapSess[pid] || [];
    const r  = sumQ(qs);
    const lvl = levelFromPct(r.pct);
    return {
      id: pid,
      label: labels[idx],
      questions: qs,
      score: r.score,
      max:   r.max,
      pct:   r.pct,
      level: lvl,
      stars: stars(r.pct),
      bilan: subthemeBilan(sId, pid, r.pct), // 👈 spécifique sous-thème + niveau
    };
  });

  report.sessions.push({
    id: sId,
    label: `Session ${sId}`,
    total_score: total.score,
    total_max:   total.max,
    total_pct:   total.pct,
    level:       levelFromPct(total.pct),
    stars:       stars(total.pct),
    bilan:       genericBilan(total.pct), // tu peux aussi faire un bilan agrégé si besoin
    subthemes:   parts,
  });
}

return [{ json: report }];
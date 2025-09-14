🌍 Available languages: [English](./README.md) | [Français](README.fr.md)

📊 Évaluation des compétences numériques (Workflow automatisé)


1. 🎯 Objectif du projet

Ce projet permet d’évaluer les compétences numériques de participants via un questionnaire Google Forms.
Les réponses sont automatiquement :

 . traitées et scorées,

 . mises en forme dans un rapport personnalisé (Google Slides → PDF),

 . envoyées au participant par email avec son rapport en pièce jointe.

👉 Aucun traitement manuel nécessaire, tout est automatisé via n8n.




2. 🛠️ Technologies utilisées

 . Google Forms : collecte des réponses.

 . Google Sheets : stockage des réponses + calculs statistiques (moyennes par sous-thème).

 . n8n : orchestrateur du workflow.

 . QuickChart : génération de graphiques (barres, radars, progress bars).

 . Google Slides : modèle de restitution (avec placeholders).

 . Gmail API : envoi automatique des rapports PDF.



3. 📥 Collecte des données

. Les participants remplissent le Google Form.

. Chaque réponse est enregistrée dans une Google Sheet brute :

   . Email

   . Horodatage

   . Réponses à chaque question



4. 📊 Traitement des réponses

a) Barème JSON

Un barème définit pour chaque question :

 . Le bloc (ex. S1, S2, S3, S4)

 . Le sous-thème (ex. SUB1, SUB2, sub3,)

 . Le nombre de points attribués


b) Calculs réalisés

 . Score global en %

 . Score par bloc (S1, S2, S3, S4)

 . Score par sous-thème (Sx_SUBy), x= numéro de session, y= numéro de sous-théme.

 . Attribution d’un niveau (Débutant, Intermédiaire, Avancé)

 . Attribution d’étoiles       ★          ★ ★        ★ ★ ★




5. 📈 Génération des graphiques

Grâce à QuickChart, le workflow génère :

 . Progress bars par sous-thème

 . Graphiques comparatifs par bloc

 . Radar global comparant score individuel.

👉 Les images sont injectées dans Slides via leurs URLs générées.




6. 📑 Création du rapport

1- Copie du modèle Slides (Google Drive).

2- Extraction des zones images (objectId des placeholders).

3- Remplacement des textes et images via l’API Google Slides (batchUpdate).

. (EMAIL) → adresse du participant

. (GLOBAL_PCT) → score global

. (S1_SUB1_BILAN) → texte bilan personnalisé

. etc.




 7. 📤 Export & diffusion

. Conversion du Slides en PDF.

. Envoi par email (via Gmail API) avec :

   . Objet : Résultats de votre test de compétences numériques

   . Corps du mail personnalisé

   . Pièce jointe : rapport PDF




8. 📂 Organisation des données

. Google Sheets 1 : Réponses brutes (Form)

. Google Sheets 2 : Moyennes par sous-thème

. Google Slides modèle : avec placeholders (PLACEHOLDER)

. n8n workflow : pipeline automatisé complet




9. 📌 Schéma du workflow

flowchart LR
  A[Google Form] --> B[Google Sheets - Réponses]
  B --> C[n8n - Scoring & Placeholders]
  C --> D[QuickChart - Graphiques]
  C --> E[Google Slides - Modèle]
  D --> E
  E --> F[Export PDF]
  F --> G[Gmail - Envoi]



10. 📝 Exemple de placeholders (JSON)
{
  "EMAIL": "participant@email.com",
  "DATE": "14/09/2025",
  "GLOBAL_PCT": "59%",
  "S1_SUB1_TITLE": "Navigation & Internet",
  "S1_SUB1_PCT": "50%",
  "S1_SUB1_STARS": "★★★",
  "S1_SUB1_BILAN": "Bases acquises mais confusions sur URL/email/moteur. Continuez à explorer."
}









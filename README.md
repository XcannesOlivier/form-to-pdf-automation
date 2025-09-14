# form-to-pdf-automation
"Automated n8n workflow to process Google Form responses, evaluate digital skills, generate personalized reports (PDF/Slides), and deliver them via email."

🌍 Available languages: [English](README.md) | [Français](README.fr.md)


📊 Digital Skills Assessment (Automated Workflow)
🎯 Project Goal

This project evaluates participants’ digital skills through a Google Forms questionnaire.
The responses are automatically:

processed and scored,

formatted into a personalized report (Google Slides → PDF),

sent to the participant by email with the report attached.

👉 No manual processing required — everything is automated with n8n.

🛠️ Technologies Used

Google Forms: collecting responses

Google Sheets: storing responses + statistical calculations (averages per sub-theme)

n8n: workflow orchestrator

QuickChart: generating charts (bar, radar, progress bars)

Google Slides: report template (with placeholders)

Gmail API: automatic delivery of PDF reports

📥 Data Collection

Participants fill out the Google Form.

Each response is stored in a raw Google Sheet with:

Email

Timestamp

Answers to each question

📊 Response Processing

a) JSON Scoring Rubric
For each question, a rubric defines:

The block (e.g., S1, S2, S3, S4)

The sub-theme (e.g., SUB1, SUB2, SUB3)

The number of points awarded

b) Calculations performed

Global score (%)

Score per block (S1, S2, S3, S4)

Score per sub-theme (Sx_SUBy, x = session number, y = sub-theme number)

Skill level assignment (Beginner, Intermediate, Advanced)

Star rating ★ ★ ★ ★ ★

📈 Chart Generation

Using QuickChart, the workflow generates:

Progress bars per sub-theme

Comparative charts per block

Global radar comparing the individual score

👉 The images are injected into Slides via their generated URLs.

📑 Report Creation

Copy the Slides template (Google Drive).

Extract image zones (objectId of placeholders).

Replace texts and images via the Google Slides API (batchUpdate).

Examples:

(EMAIL) → participant’s email address

(GLOBAL_PCT) → global score

(S1_SUB1_BILAN) → personalized feedback text

etc.

📤 Export & Delivery

Convert the Slides into PDF.

Send by email (via Gmail API) with:

Subject: Results of your digital skills test

Body: personalized message

Attachment: PDF report

📂 Data Organization

Google Sheet 1: Raw responses (Form)

Google Sheet 2: Averages per sub-theme

Google Slides template: with placeholders (PLACEHOLDER)

n8n workflow: complete automated pipeline

📌 Workflow Diagram
flowchart LR
  A[Google Form] --> B[Google Sheets - Responses]
  B --> C[n8n - Scoring & Placeholders]
  C --> D[QuickChart - Charts]
  C --> E[Google Slides - Template]
  D --> E
  E --> F[Export PDF]
  F --> G[Gmail - Send]

📝 Example Placeholders (JSON)
{
  "EMAIL": "participant@email.com",
  "DATE": "09/14/2025",
  "GLOBAL_PCT": "59%",
  "S1_SUB1_TITLE": "Navigation & Internet",
  "S1_SUB1_PCT": "50%",
  "S1_SUB1_STARS": "★★★",
  "S1_SUB1_BILAN": "Basic knowledge acquired but confusion remains about URL/email/search engine. Keep exploring."
}

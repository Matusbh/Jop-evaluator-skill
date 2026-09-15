/**
 * generate_docs.js
 *
 * Reusable CV + cover letter generator for the job-application-evaluator skill.
 * Ships with no one's personal data — the config below is a placeholder shape.
 * Claude fills in a real config object per application using facts pulled from
 * references/candidate-profile.md (built in Step 0 for whoever is using the skill).
 *
 * Usage: fill in a config object (see CONFIG below or pass a JSON file as argv[2])
 * and run with `node generate_docs.js [config.json]`.
 *
 * Requires: npm i docx   (LibreOffice / soffice.py for the PDF conversion step,
 * run separately — see the skill's SKILL.md "Building the files" section).
 *
 * Output: <company>_CV.docx and <company>_CoverLetter.docx in the current directory.
 * Convert both to PDF with LibreOffice and present the PDFs to the user (PDF-only
 * by default — see SKILL.md formatting rules).
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = require("docx");
const fs = require("fs");

// ---- Placeholder config shape — Claude fills this in per person/application from candidate-profile.md ----
const CONFIG = {
  company: "CompanyName",
  color: "0f2240", // alternate 0f2240 (navy) <-> 1a3328 (slate green) each new application, or use the candidate's own chosen pair
  titleLine: "(role title) · (top 2-3 skills)",
  profileParagraph: "(tailored profile paragraph, 3-5 sentences, reusing facts from candidate-profile.md)",
  skillsLines: [
    "(category): (skills…)",
  ],
  // projects: array of { title, stack, bullets: [] } — pulled from candidate-profile.md
  projects: [],
  clientProjectsHeading: "(Client Work / Freelance Projects — only if the candidate wants this shown, per their profile)",
  clientProjectsBullets: [],
  educationLines: [
    { title: "(credential – institution · years)", bullet: "(one line, only if useful)" },
  ],
  languagesLine: "(language — level), …",
  expectedSalaryLabel: "Expected Salary", // translate this label to match the CV's language
  expectedSalaryLine: "(range and currency, from the candidate's profile)",
  contactLine: "(name) | (email) | (GitHub/portfolio) | (LinkedIn) | (location) | (citizenship/work authorization) | (relocation note if any)",

  // Cover letter
  letterParagraphs: [
    "Dear Hiring Team,",
    "(paragraph 1: why this role)",
    "(paragraph 2: relevant stack/experience)",
    "(paragraph 3: relocation note, only if the candidate's profile states one, framed as deliberate)",
    "(paragraph 4: closing, CV + portfolio attached)",
    "Best regards,",
  ],
  signatureLine: "(email) · (GitHub/portfolio) · (LinkedIn URL)",
};

function buildCV(cfg) {
  const COLOR = cfg.color;
  const heading = (text) => new Paragraph({
    spacing: { before: 140, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR, space: 2 } },
    children: [new TextRun({ text, bold: true, color: COLOR, size: 19, allCaps: true })],
  });
  const body = (text, opts = {}) => new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 17, ...opts })],
  });
  const bullet = (text) => new Paragraph({
    spacing: { after: 30 },
    indent: { left: 220 },
    children: [new TextRun({ text: "•  " + text, size: 17 })],
  });

  const children = [
    new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "Matus Behun", bold: true, size: 28, color: COLOR })] }),
    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: cfg.titleLine, size: 19, color: COLOR })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: cfg.contactLine, size: 15 })] }),

    heading("Profile"),
    body(cfg.profileParagraph),

    heading("Technical Skills"),
    ...cfg.skillsLines.map((l) => body(l)),

    heading("Projects"),
    ...cfg.projects.flatMap((p) => [
      body(p.title, { bold: true }),
      body(p.stack),
      ...p.bullets.map(bullet),
    ]),
    body(cfg.clientProjectsHeading, { bold: true }),
    ...cfg.clientProjectsBullets.map(bullet),

    heading("Education"),
    ...cfg.educationLines.flatMap((e) => [
      body(e.title, { bold: true }),
      ...(e.bullet ? [bullet(e.bullet)] : []),
    ]),

    heading("Languages"),
    body(cfg.languagesLine),

    heading(cfg.expectedSalaryLabel),
    body(cfg.expectedSalaryLine),
  ];

  return new Document({
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 500, bottom: 500, left: 720, right: 720 } } },
      children,
    }],
  });
}

function buildLetter(cfg) {
  const p = (text) => new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text, size: 22 })] });
  const children = [
    new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: "Matus Behun", bold: true, size: 24 })] }),
    ...cfg.letterParagraphs.map(p),
    new Paragraph({ children: [new TextRun({ text: "Matus Behun", size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: cfg.signatureLine, size: 20 })] }),
  ];
  return new Document({
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
      children,
    }],
  });
}

async function main() {
  const cfgPath = process.argv[2];
  const cfg = cfgPath ? JSON.parse(fs.readFileSync(cfgPath, "utf8")) : CONFIG;

  const cvBuf = await Packer.toBuffer(buildCV(cfg));
  fs.writeFileSync(`${cfg.company}_CV.docx`, cvBuf);

  const letterBuf = await Packer.toBuffer(buildLetter(cfg));
  fs.writeFileSync(`${cfg.company}_CoverLetter.docx`, letterBuf);

  console.log(`Written ${cfg.company}_CV.docx and ${cfg.company}_CoverLetter.docx — convert both to PDF and present only the PDFs.`);
}

main();

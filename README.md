# job-evaluator

**[English](README.md) | [Español](README.es.md)**

A Claude Skill that evaluates job postings against **your own** candidate profile and, when it's a fit, generates a tailored one-page CV + cover letter as a PDF — ready to send.

Paste a job ad (text or screenshot), and it tells you straight away: apply, don't apply, or here's the nuance — before it ever touches a CV.

No one's personal data ships with this skill. The first time you use it, it builds your profile from your own CV or a short interview, and reuses it for every posting after that.

## What it does

For every job posting you send it, `job-evaluator` runs the same process instead of a fresh, inconsistent judgment call each time:

1. **Checks for duplicates** — if you already evaluated this company + role, it tells you instead of redoing the work.
2. **Checks hard blockers** — stack/domain mismatch, required experience you don't have, a non-negotiable credential you don't hold, an unsupported language, a location outside your target markets, a contract type you've ruled out. Any of these → an immediate, one-line "not a fit," no CV generated.
   - Exception: if *years of experience* is the only blocker in the whole posting, it applies automatically without asking.
3. **Flags nuance** — cases that aren't a flat rejection but are worth a decision from you (e.g. a degree requirement that also says "or equivalent experience," a role that's adjacent to but not exactly what you're after). It explains the trade-off and waits for your answer.
4. **Confirms a clean match** — no blockers, no nuance — and waits for your go-ahead before generating anything.
5. **Generates the CV + cover letter** — tailored to that specific posting, in the right language, one page, as a PDF. It pulls every fact from your profile; it never invents experience, skills, or education you don't have.
6. **Delivers the files** and a one-line estimate of the average monthly salary — no long explanations, no repeating the letter back to you in chat.

## How it works

- The skill is a single `SKILL.md` file plus two supporting resources:
  - `references/candidate-profile.md` — a template Claude fills in *for you*, the first time you use the skill (either by reading a CV you upload, or by asking you a short set of questions: stack, projects, education, languages, target markets, salary expectations, anything you explicitly don't want to be matched to). This is the only place your personal data lives, and it stays local to your own copy of the skill.
  - `scripts/generate_docs.js` — a reusable document generator (Node.js + the `docx` package) that Claude fills in per application and converts to PDF. Keeping one generator instead of hand-rolled code per company keeps every CV formatted consistently.
- Everything else — the blocker rules, the language rules, the formatting rules, the delivery rules — lives in `SKILL.md` as plain-English instructions Claude follows step by step.
- The skill decides hard blockers by comparing the posting against *your* profile, not a fixed list — so it works for any stack, role, or market, not just software development.

## Installation

### Option A — Claude.ai (web / desktop / mobile app)

Requires a Pro, Max, Team, or Enterprise plan, with **Code execution and file creation** enabled (Settings → Capabilities) — this is what lets it generate the PDF files.

1. Download this repository as a ZIP (or clone it and zip the `job-evaluator/` folder yourself). Make sure the folder inside the ZIP is named `job-evaluator` — the folder name must match the skill's `name` field.
2. In Claude.ai, go to **Settings → Customize → Skills**.
3. Click **"+"** → **"Create skill"** → **Upload a skill**, and select the ZIP.
4. Once it appears in your skills list, toggle it **on**.
5. Start a new chat, upload your CV (or just say you want to set up your profile), and go from there.

### Option B — Claude Code (terminal)

1. Clone or download this repository.
2. Copy the `job-evaluator/` folder into one of Claude Code's skill directories:
   - `~/.claude/skills/job-evaluator/` — available in every project
   - `.claude/skills/job-evaluator/` — available only in the current project
3. Claude Code picks it up automatically — no toggle needed.
4. In a session, paste a job posting or ask "is this a fit for me?" and Claude will pull in the skill on its own (or invoke it directly if your Claude Code version supports slash commands for skills).

**Note:** a skill installed in Claude.ai Settings is not visible to Claude Code, and vice versa — install it separately in each place you want to use it.

## First run — setting up your profile

The first time the skill activates, it will either:
- read a CV you upload and show you back what it extracted, so you can correct anything, or
- ask you a handful of short questions (contact info, stack, 2-4 projects, education, languages, target markets, salary range, anything you don't want to be matched to).

That profile is saved to `references/candidate-profile.md` inside your copy of the skill and reused for every posting afterward. Update it any time something changes (finished a project, updated your salary target, etc.) — just tell Claude what changed.

## Requirements for PDF generation

`scripts/generate_docs.js` needs Node.js with the `docx` package, and LibreOffice (`soffice`) for the DOCX → PDF conversion step. This works out of the box wherever Claude has code execution available (Claude.ai with Code execution enabled, or Claude Code). Without it, Claude can still run the full evaluation and draft the cover letter as text, it just won't produce a PDF automatically.

## A note on trust

Like any skill you install from the internet, look through `SKILL.md` and the scripts before installing — check there's nothing asking to read credentials, API keys, or send your data anywhere outside the skill's stated purpose. This skill only reads what you give it (your CV, job postings you paste) and writes local files (your profile, the generated CV/letter).

## License

MIT — use it, fork it, adapt it to your own market and workflow.

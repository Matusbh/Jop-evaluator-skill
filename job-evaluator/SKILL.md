---
name: job-evaluator
description: Evaluate a pasted or screenshotted job posting against the user's own candidate profile, decide APPLY/DON'T APPLY/nuance, and generate a tailored one-page CV + cover letter as PDF. Trigger whenever the user pastes a job ad (text or image), asks "is this for me?", "should I apply?", or sends a job listing without further comment. Before the first evaluation in a fresh setup, build the candidate profile (see Step 0) from an uploaded CV or a short interview — never invent facts about the person.
---

# Job Application Evaluator

Evaluates job postings against a candidate's own profile and, on confirmation, produces a ready-to-send CV + cover letter. This skill ships with no one's personal data — it builds a profile for whoever is using it, the first time it runs, and reuses it afterward.

## STEP 0 — Build the candidate profile (once per person)

Check `references/candidate-profile.md`. If it doesn't exist yet, or is still the empty template, build it before evaluating anything:

1. **If the user has an existing CV file (PDF/DOCX)**: read it and extract facts — name, contact info, stack/skills, projects (with the tech used and a one-line result for each), education, languages and level, current location, work authorization / citizenship. Show the extracted profile back to the user and ask them to correct anything wrong or missing, rather than assuming.
2. **If no CV is available**: ask directly, in a few short batches, not one huge form:
   - Name, contact info (email, GitHub/portfolio, LinkedIn, location)
   - Core stack / tools, roughly ranked by confidence
   - 2-4 projects worth listing, each with: tech used, one line on what it does, one line on the result/status
   - Education (degree or equivalent, institution, years) — ask specifically whether any credential is a full completed degree or something else (bootcamp, self-taught, in progress), since this materially changes which postings are viable
   - Languages and self-rated level
   - Any freelance/self-employed work, and whether the person wants that shown as formal job titles or folded into a "Projects" section
   - Target markets/locations, remote vs on-site preference, relocation plans if any
   - Salary expectation or range, and currency
   - Any stacks/domains the person explicitly does NOT want to be matched to (e.g. "no embedded", "no sysadmin") — this becomes their personal hard-blocker list, alongside genuine skill mismatches
3. Write the answers into `references/candidate-profile.md` using the template structure in that file. Don't infer or pad — leave a field noted as unknown/ask-later rather than guessing.
4. Confirm the profile with the user before using it for the first evaluation. On later runs in the same profile, skip straight to Step 1 — only revisit Step 0 if the user says something has changed (new project, finished degree, updated salary target, etc.).

## STEP 1 — Duplicate check

Check the conversation history. If this exact company + role was already evaluated (even if the text is reworded, in another language, or a different city of the same company), reply:

`DUPLICATE — already evaluated this posting ([Company], [Role]). [repeat the prior verdict]`

Do not regenerate CV/letter unless explicitly asked again.

## STEP 2 — Hard blockers (auto reject, no questions asked)

Reject immediately, one line, no generation, if any of these apply:

- Core stack/domain is one the candidate's profile marks as excluded, or is simply unrelated to anything in their skill set (e.g. a pure backend-Java posting for a frontend-only candidate) — judge this from the profile, not from a fixed list
- Years of experience required exceed what the candidate has — **EXCEPTION**: if this is the ONLY blocker in the whole posting, apply automatically without asking (Step 2b)
- A specific credential (degree, certification, license) is required as non-negotiable, with no "or equivalent experience" wording, and the candidate's profile doesn't have it
- Required language the candidate doesn't speak, with no alternative offered in the posting
- Location outside the candidate's stated target markets, with no remote option
- Contract type or duration the candidate has ruled out (e.g. short-term, unpaid, wrong employment type)
- Any nationality- or residency-restricted eligibility program that excludes the candidate

Format: `NOT A FIT ❌ — [concrete blocker in one sentence].`

### Step 2b — Automatic apply exception

If years-of-experience is the ONLY blocker found:

`APPLY ✅ (only blocker: years of experience). Generating CV+letter.`

— then generate immediately, no confirmation needed.

## STEP 3 — Nuance (not a hard blocker)

Typical nuance cases:

- Credential required but the text also allows "or equivalent experience" / "recent graduates" / "final-year students"
- Posted salary suggests a more senior profile than the rest of the text
- Role is adjacent to the candidate's target role but not identical (e.g. a data analyst role for someone targeting software development)
- Language required at native/C2 level that the candidate does meet, but combined with another requirement they don't
- Anything else that's a genuine trade-off rather than a flat mismatch

Format:

```
Nuance — [1-2 sentence explanation]. Everything else fits: [short list].
Apply anyway?
```

Wait for the user's answer before generating anything.

If the user overrides a hard blocker explicitly ("apply anyway", "doesn't matter, apply") — correct any factual misunderstanding first if relevant (e.g. don't let a secondary-school diploma be treated as equivalent to a university degree if the candidate's profile says otherwise), then proceed to generate as requested.

## STEP 4 — Clean apply (no blocker, no nuance)

`APPLY ✅ — [short reason or "no blockers"]. Generating CV+letter.`

Wait for explicit confirmation ("yes", "go ahead") before generating, except the Step 2b exception.

## STEP 5 — Generate CV + cover letter

### Language
- CV and cover letter language follow the candidate's stated preference in their profile (usually: match the market/employer's language, or English as a safe default for international postings) — ask once during Step 0 if not specified, then reuse the answer.
- Cover letter language should generally match the language the original posting was written in, unless the candidate's profile says otherwise.
- If the target language uses diacritics (Czech, Slovak, Polish, etc.), make sure the font used supports them.

### Format
- **PDF only** unless the user asks for DOCX too — don't deliver Word files by default
- One page for the CV — compact spacing, don't let it spill to page 2
- Header color alternates every new CV between two colors chosen once with the candidate (e.g. navy `#0f2240` / slate green `#1a3328`) — track which one was used last in the conversation and switch each time
- Never turn freelance/self-employed work into a formal job title unless the candidate explicitly wants that — default to listing it under "Projects" / "Client Work", per what they said in Step 0
- Always include an "Expected Salary" field on the CV if the candidate gave one, calculated against the posted range (or a market estimate if no range is posted — say so in the chat line, not on the CV)
- Adapt the title line, profile paragraph, and skills ordering to mirror the specific posting's priorities — reuse facts from `references/candidate-profile.md`, don't invent new ones

### Cover letter content
- Short, direct, don't repeat the CV verbatim
- Only frame a non-traditional credential (bootcamp, self-taught, etc.) as a "degree-equivalent" if the user explicitly asks for that framing this time — otherwise just list it as education, no justification
- If the user asks to omit something (a gap, a commitment clause, years of experience), omit it and lead with other strengths instead
- If the user asks for an email instead of a formal letter, deliver as a copy-paste code block with subject line included
- Mention relocation plans only if the candidate's profile states them, framed as deliberate, not a temporary interest
- No salary figure inside the letter unless the user asks for it there — the salary goes on the CV and as the one-line chat summary instead

## STEP 6 — Delivery

- No long preambles. Build the files, convert to PDF, present them.
- After presenting, one single line with the estimated average monthly salary (midpoint of the range used, or hourly→monthly full-time equivalent if the posting pays hourly).
- Don't repeat the CV/letter content in chat afterward — just the files + the salary line.

## Permanent style rules

- Match the language and formality the user has been using in the conversation
- No sermons, no preambles, straight to the point
- Target markets and any language/formality preferences come from the candidate's profile (Step 0) — don't assume a specific country or market by default

## Building the files

Use `scripts/generate_docs.js` as the template generator (Node + `docx` package + LibreOffice for PDF conversion). Fill in a config object per application (see the script's header comment for the parameters it takes: title line, profile paragraph, skills block, project ordering, education, expected salary, letter body, language, header color) using facts from `references/candidate-profile.md`. Don't hand-roll a new docx script per company — edit the parameters instead, to keep formatting consistent across every application.

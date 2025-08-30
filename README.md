# Hype It Up — TikTok For Good Feature Prototype

Hype it Up is a TikTok feature prototype that lets fans amplify verified causes so more people see them.
There is no in-app fundraising — coins buy visibility only. Donations happen off-platform via the creator’s own fundraiser link (GoFundMe/NGO/etc).

Theme: Value sharing reimagined

# Getting Started

install deps
```
npm i
```

run dev 
```
npm run dev
```
Open http://localhost:3000 on browser to view.

# What it does

Paid Hype (coins): converts coins into extra reach windows (no funds flow to the creator directly).

Community Hype (free): collective boosts unlock time-boxed visibility (e.g., +10k views for 2h).

AI Verification for Causes:
Checks for consistency between video and text input
Checks for reliability through external links' hosts and input itself

Context Card on approved posts:
Tier badge (NGO-Verified / Community-Verified / Awareness)
AI summary + suggested hashtags
Donate Externally button (opens the creator’s fundraiser site)

Impact UI: live counters (reach boost %, total reach), community milestones, and a Hype ledger (visibility events).

# Problem 

TikTok already supports good causes through:
Donation Stickers in Lives → creators can add real-time fundraising prompts.
Donation Stickers on Videos → creators can attach donation calls-to-action.
Permanent Donation Links on Profiles → creators can embed cause links.
TikTok Change Makers

These features are powerful, but they rely heavily on manual creator strategy and come with issues:
Fragmentation: donations are scattered across Lives, videos, profiles. No unified, transparent flow.
Trust Gap: viewers wonder if funds truly reach the cause.
Reliance on Creator Skill: TikTok for Good itself advises: “Prove impact, use specifics, let creators go off-script, shout out supporters.” But not every creator can craft persuasive fundraising content or track donors effectively.
Limited Engagement: today, the main fan actions are comment, share, or click a sticker. These are indirect compared to boosting reach + donating in one action.

Hype it Up solves this by:

Keeping donations external (no financial custody or compliance burden).
Using a lightweight AI verification layer to resist abuse (consistency & reliability checks).
Providing transparent impact (projected reach ± error, audience chips) and fairness pacing (daily caps, overflow roll-forward).

# Key principles

- No in-app fundraising. Coins ≠ donations; they purchase visibility only.

- External donation first. Fundraisers must include a donation URL.

- AI-verified authenticity. 

- Transparent impact. Show projected reach and why.

- Fairness pacing. Daily cap on extra reach; overflow to next day.

# Tech stack

- React + TypeScript + Vite

- Tailwind CSS

- Local AI (browser-only, free) via @huggingface/transformers (Transformers.js)

Models

- Question Answering: Xenova/distilbert-base-cased-distilled-squad

- Summarization: Xenova/distilbart-cnn-6-6

- OCR: tesseract.js

_Models load directly from huggingface.co in the browser and cache in IndexedDB._

# How the AI verification works (no server needed)

All in src/ai/localVerifier.ts.

Gather text signals

Creator form: title, description, goal, category, fundraiser URL

Video text: OCR/captions (optional but used if present)

Consistency checks

Title vs Description similarity (soft gate that tolerates paraphrase)

OCR/combined content vs. form (lexical overlap + cue overlap like “surgery”, “gofundme”, “donate”)

Category alignment (keyword hits per category)

QA assists (best-effort; never blocks if model is unavailable)

Goal extraction requires currency cues (ignores random digits from noisy OCR)

Reliability checks

Donation link is HTTPS and on an allowlist (e.g., gofundme.com, give.asia, giving.sg, globalgiving.org)

URL slug/title overlap (bonus, non-blocking)

Decision

If consistent and reliable → Approved
→ Generate AI summary + hashtags, set tier (NGO/Community/Awareness), allow posting.

Otherwise → Rejected with specific reasons (shown in UI) and which step failed.

The verifier is rule-based + model-assisted and designed for hackathon reliability: models are guarded so they never crash the flow.

# Manual Testing

*Should PASS*

Title: “Help Layla get surgery”
Description: “Layla has a rare illness called pyometra…”
Category: medical
OCR shows “Help Layla get the emergency surgery she needs”
Link: https://www.gofundme.com/...
→ Approved. Tier = Community-Verified (or NGO-Verified if domain matches).

*Should FAIL*

Awareness video OCR (“PTSD awareness month… symptoms…”) but form says dog surgery fundraiser
→ Rejected with reason: “OCR indicates awareness content … while the form describes a fundraiser.”

Wrong/unsupported domain or non-HTTPS donation link
→ Rejected with specific domain/HTTPS reason.

Title “Help dog get food”, Description “Layla has rare illness…”, Category “disaster-relief”
→ Rejected for mismatch (title↔desc/category) with specifics.

# Privacy & security

- The app does not process payments or touch funds.

- Donation links open externally in the user’s browser.

- AI runs locally in the browser; no user text/video leaves the device for verification (except when you explicitly visit external donation links).

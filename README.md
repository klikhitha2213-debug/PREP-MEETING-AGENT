# Meeting Prep Agent 🎙️⚡
> **Autonomous Executive Briefing Engine & Interaction Intelligence Ledger**

Meeting Prep Agent is an AI-powered assistant and interactive web application designed to help executives, founders, and leaders enter every meeting fully prepared by transforming raw interaction history into a concise, actionable, and strictly fact-verified **9-part briefing**.

---

## 🌟 Core Philosophy & Strict Rules

1. **Zero Fabrication**: Only information from connected records (meetings, calls, emails, messages) or explicitly logged notes is used. Never invent commitments, dates, or sensitivities.
2. **Accountability Enforcement**: *"Never assume an action was completed unless the available records indicate it."* If you promised an item and no completion was logged, it is prominently flagged as `[OVERDUE]` with proactive talking points to own it before the counterparty asks.
3. **Chronology & Contradiction Detection**: Preserves chronological fidelity and flags unresolved friction points across past touchpoints.
4. **Adaptive Executive Styling**: Calibrates tone, reading depth, and talking points according to your personal meeting style (e.g. *Direct & Action-Oriented*, *Executive High-Level*, *Analytical Deep-Dive*, *Collaborative*).

---

## 📋 The 9-Part Briefing Architecture

Every generated briefing strictly adheres to the following standardized sections:

1. **MEETING SNAPSHOT**: Counterparty profile, role, organization, scheduled time, objective, recent developments, and recommended focus.
2. **LAST INTERACTION**: Date, type, discussion summary, decisions made, commitments agreed, and notable quotes.
3. **OPEN LOOPS**:
   - *My Outstanding Commitments* (with due dates & overdue tags)
   - *Contact's Outstanding Commitments*
   - *Missed Follow-ups*
   - *Unresolved Questions on Record*
   - *Deadlines Approaching (Next 14 Days)*
4. **RELATIONSHIP CONTEXT**: What matters most, recurring concerns, active priorities, topics of agreement, and friction/sensitivities.
5. **TALKING POINTS**: 3–7 specific points prioritized by relevance to the meeting objective (Critical, High, Medium, Strategic).
6. **QUESTIONS TO ASK**: Practical, specific inquiries targeting open loops and avoiding generic pleasantries.
7. **FOLLOW-UP CHECK**: Proactive ownership recommendations on unfulfilled commitments.
8. **PERSONALIZED PREP**: Strategic tactical guidance tailored to your meeting style and the counterparty's behavioral temperament.
9. **30-SECOND BRIEF**: An ultra-punchy pre-call cheat sheet to scan right before clicking *"Join Call"*.

---

## 🚀 Key Application Features

- **Executive Cockpit Dashboard**:
  - Real-time stat counters: Active Contacts, Overdue Follow-ups, Open Loops, and Logged Interactions.
  - Upcoming meeting cards with 1-click **"Generate 9-Part Briefing"**.
  - **Accountability Watch**: Interactive list of open loops with instant status toggling (`PENDING` ➔ `COMPLETED` ➔ `MISSED`).
- **Contacts & Ledger**:
  - Filterable contacts directory with detailed counterparty dossiers (communication style, priorities, recurring concerns, sensitivities).
  - Interactive chronological timeline of all meetings, emails, and chats.
  - Add and edit contact profiles and log new interactions on the fly.
- **Dedicated Prep Generator**:
  - Select any contact and set the meeting objective.
  - Quick-preset objective chips (*SLA Remediation*, *Executive QBR*, *Technical Co-Development*, *Accountability Catch-up*).
  - Customize focus and override meeting style per session.
  - Browse and re-open previously saved briefings.
- **Executive 9-Part Briefing Viewer**:
  - Sticky jump-navigation to all 9 numbered sections.
  - **1-Click Copy Full Markdown** (for pasting into Obsidian, Notion, Apple Notes, or Slack).
  - **1-Click Copy 30-Second Brief** (for quick desktop reference).
  - **Print / PDF-Ready Stylesheet**: Formatted for printing or exporting clean meeting prep documents.
- **Local Persistence & Export**:
  - Built-in `localStorage` persistence with seed data (Dr. Elena Rostova, Marcus Vance, Sarah Chen).
  - Complete JSON backup export and restore capability.

---

## 🛠️ Technology Stack

- **Core**: Vanilla JavaScript (ES Modules) + Semantic HTML5
- **Styling**: Tailored Modern Vanilla CSS (Dark Glassmorphism, CSS Custom Properties, Responsive Layout, Google Fonts *Plus Jakarta Sans* & *JetBrains Mono*)
- **Tooling**: Vite 8.3
- **Verification**: Node.js Automated Test Suite (`test-engine.mjs`)

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm or npm.cmd

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
http://localhost:5173/
```

### Run Automated Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

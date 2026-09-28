// Realistic default dataset for Meeting Prep Agent
export const INITIAL_USER_PROFILE = {
  name: "Alex Carter",
  role: "VP of Enterprise Solutions",
  company: "ApexFlow Technologies",
  meetingStyle: "Direct & Action-Oriented", // Options: 'Direct & Action-Oriented', 'Collaborative & Relationship-First', 'Analytical & Deep-Dive', 'Executive High-Level'
  prepDepth: "Standard (3-5 min)",
  proactivityMode: "High Accountability (Flag all unverified promises & delays)",
  preferredView: "interactive",
};

export const INITIAL_CONTACTS = [
  {
    id: "c-1",
    name: "Dr. Elena Rostova",
    role: "VP of Engineering & Core Platform",
    organization: "CloudScale Systems",
    email: "elena.rostova@cloudscalesys.io",
    avatarColor: "#6366f1",
    initials: "ER",
    relationshipStage: "Key Strategic Client",
    communicationStyle: "Extremely direct, data-centric, zero patience for vague roadmaps. Appreciates when risks are acknowledged upfront rather than sugarcoated.",
    recurringConcerns: [
      "API v2 latency spikes during Europe peak hours",
      "Lack of clear disaster recovery failover drill documentation",
      "Engineering team bandwidth constraints during Q4 migration"
    ],
    priorities: [
      "Targeting 99.995% SLA compliance ahead of holiday traffic surge",
      "Consolidating 3 legacy telemetry vendors into a single unified pipeline",
      "Strict security compliance signoff for SOC2 Type II audit by Nov 30"
    ],
    interests: [
      "Distributed consensus algorithms (Raft vs Paxos)",
      "High-altitude mountaineering and trail running",
      "Open telemetry and eBPF instrumentation"
    ],
    preferences: [
      "Requests written pre-reads sent at least 24 hours in advance",
      "No slides longer than 5 pages; prefers live architectural diagrams or PRDs",
      "Never schedule calls before 10:00 AM PST"
    ],
    tags: ["Enterprise", "High Value", "Technical Stakeholder", "SLA Renegotiation"],
    upcomingMeeting: {
      scheduledDate: "Tomorrow at 10:30 AM",
      objective: "Review SLA Performance Remediation & Sign-off on Enterprise License Renewal",
      prepFocus: "Address overdue latency benchmark report and present concrete latency reduction timeline."
    }
  },
  {
    id: "c-2",
    name: "Marcus Vance",
    role: "General Partner",
    organization: "Vance Horizon Capital",
    email: "marcus@vancehorizon.com",
    avatarColor: "#06b6d4",
    initials: "MV",
    relationshipStage: "Board Observer / Strategic Investor",
    communicationStyle: "Macro-level thinker, impatient with tactical weeds, laser-focused on net revenue retention (NRR), gross margins, and enterprise CAC payback.",
    recurringConcerns: [
      "Sales cycle elongation in EMEA accounts",
      "Executive hiring pipeline (specifically Head of Enterprise Sales)",
      "Competitive pressure from open-source alternatives"
    ],
    priorities: [
      "Preparing Q3 portfolio health deck for LP meeting in early November",
      "Pushing for 130%+ Net Revenue Retention on enterprise cohort",
      "Evaluating strategic acquisition targets in APAC"
    ],
    interests: [
      "Vintage mechanical watch restoration",
      "Seed-stage AI infrastructure ecosystems",
      "Competitive squash"
    ],
    preferences: [
      "Prefers 1-page executive memos over decks",
      "Bottom-line-up-front (BLUF) formatting",
      "Always start with numbers before strategic narrative"
    ],
    tags: ["Investor", "Board", "Executive Governance", "Growth Metrics"],
    upcomingMeeting: {
      scheduledDate: "Thursday at 2:00 PM",
      objective: "Review Q3 ARR Runway, Enterprise Pipeline Velocity, and Sales Leadership Search",
      prepFocus: "Explain EMEA sales cycle extension and present updated candidate shortlist for VP Sales."
    }
  },
  {
    id: "c-3",
    name: "Sarah Chen",
    role: "Director of Product Management",
    organization: "FinTech Global Payments",
    email: "s.chen@fintechglobal.com",
    avatarColor: "#10b981",
    initials: "SC",
    relationshipStage: "Co-Development Partner",
    communicationStyle: "Highly collaborative, consensus-builder, values cross-functional alignment. Expects meticulous documentation and edge-case clarity.",
    recurringConcerns: [
      "Regulatory audit readiness for cross-border currency settlement",
      "Developer experience (DX) and SDK backward compatibility",
      "Conflicting timelines between our API v3 release and their mobile app v4"
    ],
    priorities: [
      "Launching beta multi-currency settlement gateway in UK/EU by Dec 1",
      "Reducing customer onboarding drop-off rate from 18% to under 6%",
      "Publishing new unified Developer Portal documentation"
    ],
    interests: [
      "Behavioral economics and UX friction reduction",
      "Specialty pour-over coffee roasts",
      "Women in Fintech mentorship programs"
    ],
    preferences: [
      "Appreciates detailed agenda shared 48 hours prior",
      "Likes to end meetings 5 minutes early to confirm action item owners",
      "Prefers Loom walkthroughs for complex technical change-logs"
    ],
    tags: ["Product Partner", "API Integration", "High Collaboration"],
    upcomingMeeting: {
      scheduledDate: "Friday at 11:00 AM",
      objective: "Finalize Joint API v3 Launch Milestones & Resolve Cross-Border Compliance Edge Cases",
      prepFocus: "Review sandbox integration test results and confirm developer docs freeze date."
    }
  }
];

export const INITIAL_INTERACTIONS = [
  // Elena Rostova Interactions
  {
    id: "int-101",
    contactId: "c-1",
    date: "2026-09-18",
    type: "Meeting",
    title: "SLA Remediation & Architecture Sync",
    summary: "Reviewed recent p99 latency spikes affecting Frankfurt cluster during EU market open. Elena expressed serious frustration that previous promise of latency benchmarks was delayed. We agreed on a dedicated gateway proxy deployment and mutual testing timeline.",
    keyTopics: [
      "Frankfurt cluster latency regression (180ms p99 vs 45ms SLA target)",
      "Root cause analysis: Redis cache invalidation thundering herd",
      "Enterprise license renewal terms ($420k ARR contract expiring Dec 15)"
    ],
    decisionsMade: [
      "Adopt dedicated Envoy proxy tier to buffer and cache read replicas",
      "Pause any non-critical schema migrations until latency stabilises below 50ms"
    ],
    userCommitments: [
      {
        id: "uc-1",
        text: "Deliver complete Redis cache benchmark report and Envoy rollout plan",
        dueDate: "2026-09-22",
        status: "missed", // Overdue! Shows accountability
        completedDate: null
      },
      {
        id: "uc-2",
        text: "Provide staging cluster credentials for Elena's QA leads (Dmitri & Kai)",
        dueDate: "2026-09-20",
        status: "completed",
        completedDate: "2026-09-20"
      },
      {
        id: "uc-3",
        text: "Send draft SLA amendment clause capping downtime penalties",
        dueDate: "2026-09-25",
        status: "pending",
        completedDate: null
      }
    ],
    contactCommitments: [
      {
        id: "cc-1",
        text: "Elena to share sanitized anonymized production traffic replay traces for stress testing",
        dueDate: "2026-09-24",
        status: "missed",
        completedDate: null
      },
      {
        id: "cc-2",
        text: "CloudScale security team to approve staging IP allowlist",
        dueDate: "2026-09-21",
        status: "completed",
        completedDate: "2026-09-21"
      }
    ],
    unresolvedQuestions: [
      "Will CloudScale agree to renew the 3-year term if p99 latency drops below 50ms by Oct 15?",
      "Who at CloudScale has final budget sign-off if Elena's VP of Ops raises objections?"
    ],
    importantQuotes: [
      "\"If we see another 180ms spike on market open, my CEO will mandate evaluating an in-house build, regardless of renewal discounts.\"",
      "\"I want hard synthetic load numbers, not reassuring slides.\""
    ],
    sentimentOrTone: "Tense"
  },
  {
    id: "int-102",
    contactId: "c-1",
    date: "2026-09-24",
    type: "Email",
    title: "Re: Frankfurt Cluster Traffic Traces & Next Sync",
    summary: "Elena emailed acknowledging delay in sending traffic traces due to legal privacy review. She asked whether the Envoy proxy tier adds hop latency.",
    keyTopics: [
      "Delay in production traffic dump due to GDPR scrub requirement",
      "Query regarding Envoy proxy hop latency overhead"
    ],
    decisionsMade: [],
    userCommitments: [
      {
        id: "uc-4",
        text: "Answer Envoy hop latency question with micro-benchmark data",
        dueDate: "2026-09-26",
        status: "pending",
        completedDate: null
      }
    ],
    contactCommitments: [
      {
        id: "cc-3",
        text: "Legal-approved sanitized traffic trace upload to S3 bucket",
        dueDate: "2026-09-29",
        status: "pending",
        completedDate: null
      }
    ],
    unresolvedQuestions: [
      "Does the Envoy proxy layer add more than 1.5ms overhead per query?"
    ],
    importantQuotes: [
      "\"Our legal team insists on a 5-day scrub on query params. Trace files will be delayed until Tuesday.\""
    ],
    sentimentOrTone: "Productive"
  },

  // Marcus Vance Interactions
  {
    id: "int-201",
    contactId: "c-2",
    date: "2026-09-12",
    type: "Meeting",
    title: "Q3 Board Prep & Metric Deep Dive",
    summary: "High-intensity sync reviewing ARR trajectory. US enterprise sales exceeded target by 14%, but EMEA slipped by 22%. Marcus challenged our enterprise churn forecast and pushed hard to expedite hiring the new VP of Sales.",
    keyTopics: [
      "Q3 Ending ARR forecast ($18.4M vs $19.2M plan)",
      "EMEA pipeline friction & procurement approval delays in Germany",
      "Executive candidate pipeline for Head of Enterprise Sales"
    ],
    decisionsMade: [
      "Retain executive search firm Riviera Partners with revised candidate rubric",
      "Target board presentation submission date of Oct 8"
    ],
    userCommitments: [
      {
        id: "uc-201",
        text: "Share vetted shortlist of top 3 VP Sales candidates with interview scorecards",
        dueDate: "2026-09-22",
        status: "missed", // Overdue promise
        completedDate: null
      },
      {
        id: "uc-202",
        text: "Provide revised EMEA cohort retention analysis stripping out legacy churn",
        dueDate: "2026-09-19",
        status: "completed",
        completedDate: "2026-09-18"
      }
    ],
    contactCommitments: [
      {
        id: "cc-201",
        text: "Marcus to introduce Alex to former Datadog VP EMEA for an advisory interview",
        dueDate: "2026-09-25",
        status: "pending",
        completedDate: null
      }
    ],
    unresolvedQuestions: [
      "Is the EMEA slump purely macroeconomic or does our local pricing model fail in DACH?",
      "Will the board approve a 15% equity top-up pool for the incoming sales executive?"
    ],
    importantQuotes: [
      "\"Do not hide behind pipeline coverage ratios. Tell me how many deals have signed procurement approvals this month.\"",
      "\"A great VP of Sales solves this in two quarters; the wrong one burns 18 months of runway.\""
    ],
    sentimentOrTone: "Tense"
  },

  // Sarah Chen Interactions
  {
    id: "int-301",
    contactId: "c-3",
    date: "2026-09-15",
    type: "Meeting",
    title: "Joint Integration Architecture & Gateway Launch",
    summary: "Reviewed end-to-end sandbox tests for multi-currency routing. Sarah's team confirmed that currency conversion webhook callbacks are passing 98% of test suites, but currency rate fluctuation edge cases during weekend market close need a fallback buffer.",
    keyTopics: [
      "Multi-currency webhook callback reliability",
      "Weekend FX rate fluctuation guardrails",
      "Co-marketing launch announcement target (Nov 18)"
    ],
    decisionsMade: [
      "Implement 0.5% rate tolerance buffer for offline weekend settlement requests",
      "Target joint sandbox freeze date for Oct 20"
    ],
    userCommitments: [
      {
        id: "uc-301",
        text: "Deliver updated sandbox SDK v3.2.0 with weekend buffer fallback mechanism",
        dueDate: "2026-09-26",
        status: "completed",
        completedDate: "2026-09-25"
      },
      {
        id: "uc-302",
        text: "Provide compliance statement on GDPR transaction logging for UK regulators",
        dueDate: "2026-09-28",
        status: "pending",
        completedDate: null
      }
    ],
    contactCommitments: [
      {
        id: "cc-301",
        text: "Sarah to send FinTech Global security audit sign-off for v3 API endpoints",
        dueDate: "2026-09-27",
        status: "missed",
        completedDate: null
      }
    ],
    unresolvedQuestions: [
      "Who absorbs foreign exchange spread variance if weekend transaction volume exceeds €500k?",
      "Can we co-brand the developer documentation portal or must it live on FinTech Global's domain?"
    ],
    importantQuotes: [
      "\"If our compliance officers don't see the transaction audit logs by month-end, the Dec 1 launch slips into Q1.\"",
      "\"We love the developer ergonomics of the new SDK; our engineering leads are genuinely excited.\""
    ],
    sentimentOrTone: "Productive"
  }
];

export const OBJECTIVE_PRESETS = [
  {
    label: "SLA Remediation & Renewal",
    objective: "Address latency/stability remediation, rebuild trust on unfulfilled promises, and align on license renewal timeline."
  },
  {
    label: "Executive QBR / Board Sync",
    objective: "Review quarterly ARR performance, address EMEA pipeline variance, and agree on sales leadership hiring roadmap."
  },
  {
    label: "Technical Co-Development Sync",
    objective: "Resolve technical integration blockers, confirm API version freeze, and lock in compliance sign-offs for upcoming launch."
  },
  {
    label: "Accountability Check & Catch-up",
    objective: "Review outstanding commitments, resolve stalled dependencies, and reset mutual delivery expectations."
  }
];

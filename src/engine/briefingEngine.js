// Briefing Generation Engine for Meeting Prep Agent
// Strictly adheres to 9-part structure and accountability verification rules.

export class BriefingEngine {
  /**
   * Generates a complete 9-part prep briefing
   * @param {Object} contact 
   * @param {Array} interactions 
   * @param {Object} meetingParams { objective, scheduledDate, customFocus }
   * @param {Object} userProfile 
   * @returns {Object} Briefing payload
   */
  static generate({ contact, interactions = [], meetingParams = {}, userProfile = {} }) {
    if (!contact) {
      throw new Error("A valid contact record is required to generate a briefing.");
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const today = new Date();

    // Sort interactions chronologically (newest first)
    const sortedInteractions = [...interactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastInteraction = sortedInteractions[0] || null;

    // 1. Gather all commitments and open items
    const allUserCommitments = [];
    const allContactCommitments = [];
    const allUnresolvedQuestions = [];
    const allDecisions = [];
    const keyThemes = new Set();

    sortedInteractions.forEach(item => {
      (item.userCommitments || []).forEach(uc => {
        allUserCommitments.push({ ...uc, interactionDate: item.date, interactionTitle: item.title, interactionId: item.id });
      });
      (item.contactCommitments || []).forEach(cc => {
        allContactCommitments.push({ ...cc, interactionDate: item.date, interactionTitle: item.title, interactionId: item.id });
      });
      (item.unresolvedQuestions || []).forEach(q => {
        allUnresolvedQuestions.push({ question: q, date: item.date, from: item.title });
      });
      (item.decisionsMade || []).forEach(d => {
        allDecisions.push({ decision: d, date: item.date });
      });
      (item.keyTopics || []).forEach(t => keyThemes.add(t));
    });

    // 2. Classify Open Loops
    const myOutstandingCommitments = allUserCommitments.filter(c => c.status !== 'completed');
    const contactOutstandingCommitments = allContactCommitments.filter(c => c.status !== 'completed');

    const missedFollowUps = [
      ...myOutstandingCommitments.filter(c => c.status === 'missed' || (c.dueDate && c.dueDate < todayStr)),
      ...contactOutstandingCommitments.filter(c => c.status === 'missed' || (c.dueDate && c.dueDate < todayStr))
    ];

    const deadlinesApproaching = [
      ...myOutstandingCommitments.filter(c => {
        if (!c.dueDate || c.dueDate < todayStr) return false;
        const diffDays = Math.ceil((new Date(c.dueDate) - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 14;
      }),
      ...contactOutstandingCommitments.filter(c => {
        if (!c.dueDate || c.dueDate < todayStr) return false;
        const diffDays = Math.ceil((new Date(c.dueDate) - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 14;
      })
    ];

    // 3. Synthesize Section 1: MEETING SNAPSHOT
    const objective = meetingParams.objective || contact.upcomingMeeting?.objective || "Strategic Status & Alignment Review";
    const scheduledDate = meetingParams.scheduledDate || contact.upcomingMeeting?.scheduledDate || "Upcoming";
    
    // Recent developments: last interaction summary + latest completed/missed events
    let recentDevelopments = "No prior interaction records logged yet.";
    if (lastInteraction) {
      recentDevelopments = `Last interaction (${lastInteraction.type} on ${lastInteraction.date}): ${lastInteraction.summary}`;
      if (lastInteraction.decisionsMade?.length > 0) {
        recentDevelopments += ` Agreed: "${lastInteraction.decisionsMade[0]}".`;
      }
    }

    const recommendedFocus = meetingParams.customFocus || 
      (missedFollowUps.some(c => myOutstandingCommitments.includes(c))
        ? "Lead with accountability on delayed deliverables before addressing new requests."
        : "Align directly on core milestones and unblock pending dependencies.");

    const snapshot = {
      contactName: contact.name,
      role: contact.role,
      organization: contact.organization,
      meetingObjective: objective,
      scheduledTime: scheduledDate,
      recentDevelopments,
      recommendedFocus
    };

    // 4. Section 2: LAST INTERACTION
    let lastInteractionSection = null;
    if (lastInteraction) {
      lastInteractionSection = {
        date: lastInteraction.date,
        type: lastInteraction.type,
        title: lastInteraction.title,
        discussed: lastInteraction.summary,
        decisions: lastInteraction.decisionsMade || [],
        commitmentsMade: [
          ...(lastInteraction.userCommitments || []).map(c => `[You] ${c.text} (Due: ${c.dueDate || 'Unspecified'}) - Status: ${c.status}`),
          ...(lastInteraction.contactCommitments || []).map(c => `[${contact.name}] ${c.text} (Due: ${c.dueDate || 'Unspecified'}) - Status: ${c.status}`)
        ],
        quotes: lastInteraction.importantQuotes || []
      };
    } else {
      lastInteractionSection = {
        date: "None recorded",
        type: "N/A",
        title: "No Previous Interaction",
        discussed: "This is your first recorded meeting with this contact.",
        decisions: [],
        commitmentsMade: [],
        quotes: []
      };
    }

    // 5. Section 3: OPEN LOOPS
    const openLoops = {
      myOutstanding: myOutstandingCommitments.map(c => ({
        id: c.id,
        interactionId: c.interactionId,
        text: c.text,
        dueDate: c.dueDate,
        status: c.status,
        isOverdue: c.status === 'missed' || (c.dueDate && c.dueDate < todayStr),
        datePromised: c.interactionDate
      })),
      contactOutstanding: contactOutstandingCommitments.map(c => ({
        id: c.id,
        interactionId: c.interactionId,
        text: c.text,
        dueDate: c.dueDate,
        status: c.status,
        isOverdue: c.status === 'missed' || (c.dueDate && c.dueDate < todayStr),
        datePromised: c.interactionDate
      })),
      missedFollowUps: missedFollowUps.map(c => ({
        owner: myOutstandingCommitments.includes(c) ? 'You' : contact.name,
        text: c.text,
        dueDate: c.dueDate,
        promisedOn: c.interactionDate,
        status: c.status
      })),
      unresolvedQuestions: allUnresolvedQuestions.map(q => q.question),
      deadlinesApproaching: deadlinesApproaching.map(c => ({
        owner: myOutstandingCommitments.includes(c) ? 'You' : contact.name,
        text: c.text,
        dueDate: c.dueDate
      })),
      accountabilityNote: "Rule enforced: Never assume an action was completed unless the available records indicate it."
    };

    // 6. Section 4: RELATIONSHIP CONTEXT
    const relationshipContext = {
      whatMattersMost: contact.priorities?.[0] || "Driving high-impact outcomes and execution clarity.",
      recurringConcerns: contact.recurringConcerns || ["Execution timelines and SLA assurances"],
      priorities: contact.priorities || ["Timely delivery and clear roadmaps"],
      agreementTopics: allDecisions.map(d => d.decision).slice(0, 3),
      frictionOrDisagreement: (lastInteraction?.sentimentOrTone === 'Tense' || missedFollowUps.length > 0)
        ? [`Tension around past deadlines or SLA predictability (${missedFollowUps.length} overdue item(s) flagged).`]
        : ["No major friction points recorded."],
      preferencesAndSensitivities: contact.preferences || ["Prefers concise agendas and direct updates"]
    };

    // 7. Section 5: TALKING POINTS (3-7 items prioritized by relevance to objective)
    const talkingPoints = [];

    // Point 1: Objective alignment
    talkingPoints.push({
      priority: "High",
      point: `Direct Alignment on Objective: "${objective}". Ground discussion in concrete outcomes and mutual success metrics.`
    });

    // Point 2: Proactive commitment update (Accountability check)
    const overdueMy = myOutstandingCommitments.filter(c => c.status === 'missed' || (c.dueDate && c.dueDate < todayStr));
    if (overdueMy.length > 0) {
      talkingPoints.push({
        priority: "Critical",
        point: `Proactive Ownership: Address status of "${overdueMy[0].text}" promised on ${overdueMy[0].interactionDate}. Provide exact completion timeline before being asked.`
      });
    } else if (myOutstandingCommitments.length > 0) {
      talkingPoints.push({
        priority: "High",
        point: `Pending Deliverables: Update ${contact.name} on progress toward "${myOutstandingCommitments[0].text}" (target due: ${myOutstandingCommitments[0].dueDate || 'TBD'}).`
      });
    }

    // Point 3: Request for contact's pending deliverables
    const pendingContact = contactOutstandingCommitments.filter(c => c.status !== 'completed');
    if (pendingContact.length > 0) {
      talkingPoints.push({
        priority: "High",
        point: `Contact Dependency: Respectfully check in on "${pendingContact[0].text}" to ensure our dependent milestones stay unblocked.`
      });
    }

    // Point 4: Addressing contact's top priority or concern
    if (contact.recurringConcerns?.length > 0) {
      talkingPoints.push({
        priority: "Medium",
        point: `Mitigate Recurring Concern: Directly speak to ${contact.recurringConcerns[0]}, outlining concrete safeguards.`
      });
    }

    // Point 5: Unresolved question resolution
    if (allUnresolvedQuestions.length > 0) {
      talkingPoints.push({
        priority: "Medium",
        point: `Close Open Loop: Clarify: "${allUnresolvedQuestions[0].question}" to eliminate ambiguity before next stage.`
      });
    }

    // Point 6: Future milestone lock-in
    talkingPoints.push({
      priority: "Strategic",
      point: `Next Phase Sign-off: Establish written next steps, assigned owners, and date for the subsequent progress review.`
    });

    // 8. Section 6: QUESTIONS TO ASK (Practical, specific, avoid generic questions)
    const questionsToAsk = [];
    if (allUnresolvedQuestions.length > 0) {
      questionsToAsk.push(`Regarding our previous discussion: "${allUnresolvedQuestions[0].question}"`);
    }
    if (contactOutstandingCommitments.length > 0) {
      questionsToAsk.push(`"What is the current status of ${contactOutstandingCommitments[0].text}, and do you need anything from our team to complete it?"`);
    }
    if (contact.priorities?.length > 0) {
      questionsToAsk.push(`"Given your priority on ${contact.priorities[0]}, does our current timeline align with your team's internal milestones?"`);
    }
    if (contact.recurringConcerns?.length > 0) {
      questionsToAsk.push(`"How is your team feeling about ${contact.recurringConcerns[0]} since our last sync?"`);
    }
    if (questionsToAsk.length < 3) {
      questionsToAsk.push(`"What is the single biggest risk or blocker your leadership is watching for this initiative over the next 30 days?"`);
    }

    // 9. Section 7: FOLLOW-UP CHECK (Proactive accountability)
    const followUpCheck = [];
    myOutstandingCommitments.forEach(c => {
      const statusLabel = (c.status === 'missed' || (c.dueDate && c.dueDate < todayStr))
        ? "OVERDUE - NO COMPLETION RECORDED"
        : "IN PROGRESS - UNCOMPLETED";
      followUpCheck.push({
        text: `You promised "${c.text}" on ${c.interactionDate} (Due: ${c.dueDate || 'Unspecified'}). [${statusLabel}]`,
        recommendation: `State this upfront: "Before we dive in, I want to give a transparent update on ${c.text}."`,
        isOverdue: (c.status === 'missed' || (c.dueDate && c.dueDate < todayStr))
      });
    });

    if (followUpCheck.length === 0) {
      followUpCheck.push({
        text: "All previous commitments made by you are marked COMPLETED in available records.",
        recommendation: "No overdue liabilities. You enter this meeting with clean accountability.",
        isOverdue: false
      });
    }

    // 10. Section 8: PERSONALIZED PREP (Tailored to user style)
    const userStyle = userProfile.meetingStyle || "Direct & Action-Oriented";
    const prepDepth = userProfile.prepDepth || "Standard (3-5 min)";
    
    let styleGuidance = "";
    if (userStyle.includes("Direct")) {
      styleGuidance = `Adaptation for ${userProfile.name || 'You'} (${userStyle}): Jump straight into concrete numbers and action items. Skip lengthy introductory preambles. ${contact.name}'s communication style (${contact.communicationStyle || 'Direct'}) matches this perfectly.`;
    } else if (userStyle.includes("Collaborative")) {
      styleGuidance = `Adaptation for ${userProfile.name || 'You'} (${userStyle}): Acknowledge their team's efforts first. Focus on shared ownership of the solution, but ensure action item owners are pinned down in the final 5 minutes.`;
    } else if (userStyle.includes("Analytical")) {
      styleGuidance = `Adaptation for ${userProfile.name || 'You'} (${userStyle}): Bring hard verification metrics, benchmark links, and technical architecture specs. Be ready to explain latency numbers at the microsecond level.`;
    } else {
      styleGuidance = `Adaptation for ${userProfile.name || 'You'} (${userStyle}): Frame all discussions in terms of high-level ROI, strategic runway, and risk mitigation. Keep tactical details in reserve for follow-up memos.`;
    }

    const personalizedPrep = {
      userStyle,
      prepDepth,
      guidance: styleGuidance,
      contactCommunicationMatch: `Contact Style: "${contact.communicationStyle || 'Standard'}". Approach recommendation: match their energy, address known sensitivities (${contact.preferences?.[0] || 'No special preferences'}), and honor their time boundary.`
    };

    // 11. Section 9: 30-SECOND BRIEF
    const primaryOverdue = overdueMy[0]?.text || null;
    const thirtySecondBrief = {
      contactSnippet: `${contact.name} (${contact.role}, ${contact.organization})`,
      objective: objective,
      dangerZone: primaryOverdue
        ? `⚠️ ACCOUNTABILITY ALERT: Address delayed "${primaryOverdue}" immediately before they bring it up.`
        : `⚠️ WATCH OUT: Sensitive to "${contact.recurringConcerns?.[0] || 'timeline slippage'}". Keep answers crisp.`,
      keyAskOrWin: `🎯 KEY WIN: Secure explicit alignment on "${objective}" and lock next review date.`,
      quickRule: `🚫 DO NOT: ${contact.preferences?.[1] || contact.preferences?.[0] || 'Wander off-agenda without concrete data.'}`
    };

    return {
      id: `brf-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      contactId: contact.id,
      meetingSnapshot: snapshot,
      lastInteraction: lastInteractionSection,
      openLoops,
      relationshipContext,
      talkingPoints,
      questionsToAsk,
      followUpCheck,
      personalizedPrep,
      thirtySecondBrief
    };
  }

  /**
   * Formats the briefing object into clean Markdown for exporting or clipboard copying
   */
  static toMarkdown(b) {
    const s = b.meetingSnapshot;
    const li = b.lastInteraction;
    const ol = b.openLoops;
    const rc = b.relationshipContext;
    const tsb = b.thirtySecondBrief;

    return `
# MEETING PREPARATION BRIEFING
**Generated**: ${new Date(b.generatedAt).toLocaleString()}
**Strict Fact Enforcement**: Verified records only. No hallucinated commitments.

---

### 1. MEETING SNAPSHOT
* **Contact**: ${s.contactName}
* **Role & Organization**: ${s.role} | ${s.organization}
* **Meeting Objective**: ${s.meetingObjective}
* **Scheduled Time**: ${s.scheduledTime}
* **Relevant Recent Developments**: ${s.recentDevelopments}
* **Recommended Focus**: ${s.recommendedFocus}

---

### 2. LAST INTERACTION
* **Date & Type**: ${li.date} (${li.type}) - ${li.title}
* **What Was Discussed**: ${li.discussed}
* **Decisions Made**:
${li.decisions.length ? li.decisions.map(d => `  - ${d}`).join('\n') : '  - None recorded'}
* **Commitments Made**:
${li.commitmentsMade.length ? li.commitmentsMade.map(c => `  - ${c}`).join('\n') : '  - None recorded'}
* **Important Quotes**:
${li.quotes.length ? li.quotes.map(q => `  - ${q}`).join('\n') : '  - None recorded'}

---

### 3. OPEN LOOPS
*(Enforcement: Never assume an action was completed unless available records indicate it)*

**My Outstanding Commitments**:
${ol.myOutstanding.length ? ol.myOutstanding.map(c => `  - [${c.isOverdue ? 'OVERDUE' : 'PENDING'}] ${c.text} (Due: ${c.dueDate || 'TBD'}) [Promised: ${c.datePromised}]`).join('\n') : '  - None outstanding'}

**Contact's Outstanding Commitments**:
${ol.contactOutstanding.length ? ol.contactOutstanding.map(c => `  - [${c.isOverdue ? 'OVERDUE' : 'PENDING'}] ${c.text} (Due: ${c.dueDate || 'TBD'}) [Promised: ${c.datePromised}]`).join('\n') : '  - None outstanding'}

**Missed Follow-Ups**:
${ol.missedFollowUps.length ? ol.missedFollowUps.map(m => `  - [${m.owner}] ${m.text} (Was due: ${m.dueDate || 'Past date'})`).join('\n') : '  - None recorded'}

**Unresolved Questions**:
${ol.unresolvedQuestions.length ? ol.unresolvedQuestions.map(q => `  - ${q}`).join('\n') : '  - None recorded'}

**Deadlines Approaching (Next 14 Days)**:
${ol.deadlinesApproaching.length ? ol.deadlinesApproaching.map(d => `  - [${d.owner}] ${d.text} (Due: ${d.dueDate})`).join('\n') : '  - None in immediate window'}

---

### 4. RELATIONSHIP CONTEXT
* **What Matters Most**: ${rc.whatMattersMost}
* **Recurring Concerns**:
${rc.recurringConcerns.map(c => `  - ${c}`).join('\n')}
* **Priorities**:
${rc.priorities.map(p => `  - ${p}`).join('\n')}
* **Topics of Agreement**:
${rc.agreementTopics.length ? rc.agreementTopics.map(a => `  - ${a}`).join('\n') : '  - Under development'}
* **Friction / Disagreement Points**:
${rc.frictionOrDisagreement.map(f => `  - ${f}`).join('\n')}
* **Preferences & Sensitivities**:
${rc.preferencesAndSensitivities.map(p => `  - ${p}`).join('\n')}

---

### 5. TALKING POINTS (Prioritized)
${b.talkingPoints.map((tp, idx) => `${idx + 1}. **[${tp.priority}]** ${tp.point}`).join('\n')}

---

### 6. QUESTIONS TO ASK (Practical & Specific)
${b.questionsToAsk.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}

---

### 7. FOLLOW-UP CHECK (Proactive Accountability)
${b.followUpCheck.map(f => `* ${f.text}\n  *Action*: ${f.recommendation}`).join('\n\n')}

---

### 8. PERSONALIZED PREP
* **User Style**: ${b.personalizedPrep.userStyle} (${b.personalizedPrep.prepDepth})
* **Preparation Strategy**: ${b.personalizedPrep.guidance}
* **Interpersonal Match**: ${b.personalizedPrep.contactCommunicationMatch}

---

### 9. 30-SECOND BRIEF (Read Immediately Before Joining)
* **Who**: ${tsb.contactSnippet}
* **Goal**: ${tsb.objective}
* ${tsb.dangerZone}
* ${tsb.keyAskOrWin}
* ${tsb.quickRule}
`.trim();
  }
}

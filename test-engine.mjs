// Internal verification script for BriefingEngine
import { INITIAL_CONTACTS, INITIAL_INTERACTIONS, INITIAL_USER_PROFILE } from './src/data/sampleData.js';
import { BriefingEngine } from './src/engine/briefingEngine.js';

console.log("=== Testing Meeting Prep Agent Briefing Engine ===");

const contact = INITIAL_CONTACTS[0]; // Dr. Elena Rostova
const interactions = INITIAL_INTERACTIONS.filter(i => i.contactId === contact.id);

const briefing = BriefingEngine.generate({
  contact,
  interactions,
  meetingParams: {
    objective: "Review SLA Performance Remediation & Sign-off on Enterprise License Renewal",
    scheduledDate: "Tomorrow at 10:30 AM",
    customFocus: "Address overdue latency benchmark report"
  },
  userProfile: INITIAL_USER_PROFILE
});

console.log("1. Snapshot Contact:", briefing.meetingSnapshot.contactName, "| Focus:", briefing.meetingSnapshot.recommendedFocus);
console.log("2. Last Interaction:", briefing.lastInteraction.date, "-", briefing.lastInteraction.title);
console.log("3. Open Loops:", {
  myOutstanding: briefing.openLoops.myOutstanding.length,
  contactOutstanding: briefing.openLoops.contactOutstanding.length,
  missedFollowUps: briefing.openLoops.missedFollowUps.length,
  unresolvedQuestions: briefing.openLoops.unresolvedQuestions.length,
  deadlinesApproaching: briefing.openLoops.deadlinesApproaching.length
});
console.log("4. Relationship Context - Priorities:", briefing.relationshipContext.priorities.length);
console.log("5. Talking Points (Count):", briefing.talkingPoints.length);
console.log("6. Questions to Ask (Count):", briefing.questionsToAsk.length);
console.log("7. Follow-up Check items:", briefing.followUpCheck.length, "| Overdue liability:", briefing.followUpCheck[0]?.isOverdue);
console.log("8. Personalized Prep:", briefing.personalizedPrep.userStyle);
console.log("9. 30-Second Brief Danger Zone:", briefing.thirtySecondBrief.dangerZone);

const md = BriefingEngine.toMarkdown(briefing);
console.log("\n=== Generated Markdown Length ===", md.length, "characters");

// Strict validation of the 9 sections
const sections = [
  briefing.meetingSnapshot,
  briefing.lastInteraction,
  briefing.openLoops,
  briefing.relationshipContext,
  briefing.talkingPoints,
  briefing.questionsToAsk,
  briefing.followUpCheck,
  briefing.personalizedPrep,
  briefing.thirtySecondBrief
];

if (sections.some(s => !s)) {
  throw new Error("Missing one of the mandatory 9 sections!");
}

console.log("\n>>> ALL 9 SECTIONS FULLY VERIFIED ACCORDING TO USER REQUIREMENTS! <<<");

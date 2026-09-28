// 9-Part Meeting Preparation Briefing Display Component
export function renderBriefingDisplay({ briefing, onCopyMarkdown, onCopyThirtySec, onPrint, onToggleCommitment }) {
  if (!briefing) {
    return `
      <div class="glass-card" style="text-align: center; padding: 4rem 2rem;">
        <div class="stat-icon primary" style="margin: 0 auto 1.5rem; width: 64px; height: 64px; font-size: 2rem;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No Active Briefing Generated Yet</h2>
        <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem;">
          Select a contact and meeting objective in the Prep Generator to construct your comprehensive 9-part briefing.
        </p>
        <button class="btn btn-primary" id="btn-empty-go-generator">
          Open Prep Generator
        </button>
      </div>
    `;
  }

  const s = briefing.meetingSnapshot;
  const li = briefing.lastInteraction;
  const ol = briefing.openLoops;
  const rc = briefing.relationshipContext;
  const tsb = briefing.thirtySecondBrief;

  const hasOverdueLiability = ol.missedFollowUps.some(m => m.owner === 'You');

  return `
    <div class="briefing-display-wrapper">
      <!-- Top Action Toolbar & Jump Navigation -->
      <div class="briefing-toolbar">
        <div class="jump-nav" aria-label="Jump to briefing section">
          <a class="jump-link" href="#sec-snapshot">1. Snapshot</a>
          <a class="jump-link" href="#sec-last-interaction">2. Last Interaction</a>
          <a class="jump-link" href="#sec-open-loops">3. Open Loops</a>
          <a class="jump-link" href="#sec-relationship">4. Context</a>
          <a class="jump-link" href="#sec-talking-points">5. Talking Points</a>
          <a class="jump-link" href="#sec-questions">6. Questions</a>
          <a class="jump-link" href="#sec-follow-up-check">7. Follow-up Check</a>
          <a class="jump-link" href="#sec-personalized-prep">8. Personal Prep</a>
          <a class="jump-link" href="#sec-30-sec-brief">9. 30s Brief</a>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
          <button class="btn btn-secondary btn-sm" id="btn-copy-30s-brief" title="Copy 30-Second Pre-Call Summary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy 30s Brief
          </button>

          <button class="btn btn-primary btn-sm" id="btn-copy-full-brief" title="Copy Full 9-Part Markdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy Full Markdown
          </button>

          <button class="btn btn-secondary btn-icon btn-sm" id="btn-print-brief" title="Print / Save PDF">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
        </div>
      </div>

      <!-- SECTION 1: MEETING SNAPSHOT -->
      <section class="briefing-section" id="sec-snapshot">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">01</span>
            MEETING SNAPSHOT
          </div>
          <span class="badge badge-primary">${s.scheduledTime}</span>
        </div>

        <div class="snapshot-grid">
          <div class="snapshot-item">
            <div class="snapshot-label">Contact</div>
            <div class="snapshot-value">${s.contactName}</div>
          </div>
          <div class="snapshot-item">
            <div class="snapshot-label">Organization & Role</div>
            <div class="snapshot-value">${s.role} • ${s.organization}</div>
          </div>
          <div class="snapshot-item" style="grid-column: span 2;">
            <div class="snapshot-label">Meeting Objective</div>
            <div class="snapshot-value" style="color: var(--primary-light); font-weight: 700;">
              ${s.meetingObjective}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <div class="snapshot-label" style="margin-bottom: 0.35rem;">Relevant Recent Developments</div>
          <p style="font-size: 0.9rem; color: var(--text-primary); background: rgba(10, 14, 25, 0.4); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            ${s.recentDevelopments}
          </p>
        </div>

        <div class="focus-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div>
            <strong style="color: var(--text-primary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.2rem;">
              Recommended Preparation Focus
            </strong>
            <span style="font-size: 0.9rem; color: var(--text-secondary);">
              ${s.recommendedFocus}
            </span>
          </div>
        </div>
      </section>

      <!-- SECTION 2: LAST INTERACTION -->
      <section class="briefing-section" id="sec-last-interaction">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">02</span>
            LAST INTERACTION
          </div>
          <span class="badge badge-cyan">${li.date} (${li.type})</span>
        </div>

        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 0.3rem;">
            Title & Discussion Summary
          </h4>
          <p style="font-size: 0.92rem; color: var(--text-primary);">
            <strong>${li.title}</strong>: ${li.discussed}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 1rem;">
          <!-- Decisions Made -->
          <div style="background: rgba(10, 14, 25, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--emerald); display: block; margin-bottom: 0.4rem;">
              Decisions Made
            </strong>
            <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
              ${li.decisions.length ? li.decisions.map(d => `<li>${d}</li>`).join('') : '<li>None explicitly recorded in notes.</li>'}
            </ul>
          </div>

          <!-- Commitments Made -->
          <div style="background: rgba(10, 14, 25, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--primary-light); display: block; margin-bottom: 0.4rem;">
              Commitments Made
            </strong>
            <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
              ${li.commitmentsMade.length ? li.commitmentsMade.map(c => `<li>${c}</li>`).join('') : '<li>No new commitments agreed.</li>'}
            </ul>
          </div>
        </div>

        ${li.quotes.length ? `
          <div style="margin-top: 1rem; background: rgba(245, 158, 11, 0.05); border-left: 3px solid var(--amber); padding: 0.75rem 1rem; border-radius: 0 var(--radius-md) var(--radius-md) 0;">
            <strong style="font-size: 0.75rem; text-transform: uppercase; color: var(--amber); display: block; margin-bottom: 0.25rem;">
              Important Direct Quotes
            </strong>
            ${li.quotes.map(q => `<p style="font-size: 0.88rem; font-style: italic; color: var(--text-primary); margin-bottom: 0.25rem;">${q}</p>`).join('')}
          </div>
        ` : ''}
      </section>

      <!-- SECTION 3: OPEN LOOPS -->
      <section class="briefing-section" id="sec-open-loops">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">03</span>
            OPEN LOOPS & VERIFIED STATUS
          </div>
          <span class="badge ${ol.missedFollowUps.length > 0 ? 'badge-rose' : 'badge-emerald'}">
            ${ol.missedFollowUps.length > 0 ? `${ol.missedFollowUps.length} Overdue / Delayed` : 'All On Track'}
          </span>
        </div>

        <div style="background: rgba(15, 20, 35, 0.5); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); padding: 0.65rem 0.9rem; font-size: 0.78rem; color: var(--text-tertiary); margin-bottom: 1.25rem;">
          ⚖️ <strong>Strict Verification Standard:</strong> ${ol.accountabilityNote}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          <!-- My Outstanding Commitments -->
          <div>
            <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--primary-light); letter-spacing: 0.05em; margin-bottom: 0.6rem; display: flex; align-items: center; justify-content: space-between;">
              <span>My Outstanding Commitments</span>
              <span class="badge badge-primary">${ol.myOutstanding.length}</span>
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${ol.myOutstanding.length ? ol.myOutstanding.map(c => `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: rgba(10, 14, 25, 0.5); border: 1px solid ${c.isOverdue ? 'var(--rose-border)' : 'var(--border-subtle)'}; padding: 0.6rem 0.85rem; border-radius: var(--radius-md);">
                  <div style="font-size: 0.85rem;">
                    <div style="color: var(--text-primary); font-weight: 500;">${c.text}</div>
                    <div style="font-size: 0.72rem; color: ${c.isOverdue ? 'var(--rose)' : 'var(--text-tertiary)'}; font-family: var(--font-mono); margin-top: 0.15rem;">
                      Due: ${c.dueDate || 'Unspecified'} • Promised: ${c.datePromised}
                    </div>
                  </div>
                  <button 
                    class="status-pill ${c.status}" 
                    data-interaction-id="${c.interactionId}" 
                    data-commitment-id="${c.id}" 
                    data-is-user="true" 
                    data-current-status="${c.status}"
                    title="Click to toggle status"
                  >
                    ${c.status.toUpperCase()}
                  </button>
                </div>
              `).join('') : '<p style="font-size: 0.82rem; color: var(--text-tertiary);">No outstanding commitments for you.</p>'}
            </div>
          </div>

          <!-- Contact's Outstanding Commitments -->
          <div>
            <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--accent-cyan); letter-spacing: 0.05em; margin-bottom: 0.6rem; display: flex; align-items: center; justify-content: space-between;">
              <span>${s.contactName}'s Commitments</span>
              <span class="badge badge-cyan">${ol.contactOutstanding.length}</span>
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${ol.contactOutstanding.length ? ol.contactOutstanding.map(c => `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: rgba(10, 14, 25, 0.5); border: 1px solid ${c.isOverdue ? 'var(--rose-border)' : 'var(--border-subtle)'}; padding: 0.6rem 0.85rem; border-radius: var(--radius-md);">
                  <div style="font-size: 0.85rem;">
                    <div style="color: var(--text-primary); font-weight: 500;">${c.text}</div>
                    <div style="font-size: 0.72rem; color: ${c.isOverdue ? 'var(--rose)' : 'var(--text-tertiary)'}; font-family: var(--font-mono); margin-top: 0.15rem;">
                      Due: ${c.dueDate || 'Unspecified'} • Promised: ${c.datePromised}
                    </div>
                  </div>
                  <button 
                    class="status-pill ${c.status}" 
                    data-interaction-id="${c.interactionId}" 
                    data-commitment-id="${c.id}" 
                    data-is-user="false" 
                    data-current-status="${c.status}"
                    title="Click to toggle status"
                  >
                    ${c.status.toUpperCase()}
                  </button>
                </div>
              `).join('') : `<p style="font-size: 0.82rem; color: var(--text-tertiary);">No pending deliverables from ${s.contactName}.</p>`}
            </div>
          </div>
        </div>

        <!-- Unresolved Questions & Deadlines -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
          <div>
            <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--amber); display: block; margin-bottom: 0.4rem;">
              Unresolved Questions on Record
            </strong>
            <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
              ${ol.unresolvedQuestions.length ? ol.unresolvedQuestions.map(q => `<li>${q}</li>`).join('') : '<li>All prior questions resolved.</li>'}
            </ul>
          </div>

          <div>
            <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--primary-light); display: block; margin-bottom: 0.4rem;">
              Deadlines Approaching (Next 14 Days)
            </strong>
            <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
              ${ol.deadlinesApproaching.length ? ol.deadlinesApproaching.map(d => `<li><strong>[${d.owner}]</strong> ${d.text} — <em>Due ${d.dueDate}</em></li>`).join('') : '<li>No deadlines due in the immediate 14-day window.</li>'}
            </ul>
          </div>
        </div>
      </section>

      <!-- SECTION 4: RELATIONSHIP CONTEXT -->
      <section class="briefing-section" id="sec-relationship">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">04</span>
            RELATIONSHIP CONTEXT
          </div>
          <span class="badge badge-primary">Psychological & Operational Fit</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
          <div class="snapshot-item">
            <div class="snapshot-label" style="color: var(--accent-cyan);">What Matters Most to This Person</div>
            <p style="font-size: 0.88rem; color: var(--text-primary); margin-top: 0.25rem;">${rc.whatMattersMost}</p>
          </div>

          <div class="snapshot-item">
            <div class="snapshot-label" style="color: var(--amber);">Recurring Concerns</div>
            <ul style="padding-left: 1.1rem; font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${rc.recurringConcerns.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>

          <div class="snapshot-item">
            <div class="snapshot-label" style="color: var(--emerald);">Active Priorities</div>
            <ul style="padding-left: 1.1rem; font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${rc.priorities.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>

          <div class="snapshot-item">
            <div class="snapshot-label" style="color: var(--rose);">Friction & Disagreement Points</div>
            <ul style="padding-left: 1.1rem; font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${rc.frictionOrDisagreement.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- SECTION 5: TALKING POINTS -->
      <section class="briefing-section" id="sec-talking-points">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">05</span>
            PRIORITIZED TALKING POINTS
          </div>
          <span class="badge badge-primary">${briefing.talkingPoints.length} Key Points</span>
        </div>

        <div class="talking-points-list">
          ${briefing.talkingPoints.map((tp, idx) => `
            <div class="talking-point-item">
              <span class="tp-priority-badge tp-priority-${tp.priority}">${tp.priority}</span>
              <div style="flex: 1; font-size: 0.92rem; color: var(--text-primary);">
                <strong>#${idx + 1}:</strong> ${tp.point}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- SECTION 6: QUESTIONS TO ASK -->
      <section class="briefing-section" id="sec-questions">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">06</span>
            QUESTIONS TO ASK (PRACTICAL & SPECIFIC)
          </div>
          <span class="badge badge-cyan">Zero Generic Questions</span>
        </div>

        <div class="questions-list">
          ${briefing.questionsToAsk.map((q, idx) => `
            <div class="question-box">
              <span style="font-weight: 700; color: var(--accent-cyan); font-style: normal; margin-right: 0.5rem;">Q${idx + 1}:</span>
              ${q}
            </div>
          `).join('')}
        </div>
      </section>

      <!-- SECTION 7: FOLLOW-UP CHECK -->
      <section class="briefing-section" id="sec-follow-up-check">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">07</span>
            FOLLOW-UP CHECK (PROACTIVE ACCOUNTABILITY)
          </div>
          <span class="badge ${hasOverdueLiability ? 'badge-rose' : 'badge-emerald'}">
            ${hasOverdueLiability ? 'Proactive Ownership Required' : 'Clean Record'}
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          ${briefing.followUpCheck.map(f => `
            <div class="accountability-callout ${f.isOverdue ? '' : 'clean'}">
              <div style="font-size: 1.25rem;">${f.isOverdue ? '⚠️' : '✅'}</div>
              <div style="flex: 1;">
                <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-primary);">
                  ${f.text}
                </div>
                <div style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 0.35rem;">
                  <strong>Recommended Play:</strong> ${f.recommendation}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- SECTION 8: PERSONALIZED PREP -->
      <section class="briefing-section" id="sec-personalized-prep">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">08</span>
            PERSONALIZED PREP & MEETING STYLE
          </div>
          <span class="badge badge-primary">${briefing.personalizedPrep.userStyle}</span>
        </div>

        <div style="background: rgba(10, 14, 25, 0.5); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
          <h4 style="font-size: 0.82rem; text-transform: uppercase; color: var(--primary-light); margin-bottom: 0.4rem;">
            Custom Tactical Guidance
          </h4>
          <p style="font-size: 0.92rem; color: var(--text-primary);">
            ${briefing.personalizedPrep.guidance}
          </p>
        </div>

        <div style="background: rgba(10, 14, 25, 0.5); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 0.82rem; text-transform: uppercase; color: var(--accent-cyan); margin-bottom: 0.4rem;">
            Interpersonal Dynamics Alignment
          </h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            ${briefing.personalizedPrep.contactCommunicationMatch}
          </p>
        </div>
      </section>

      <!-- SECTION 9: 30-SECOND BRIEF -->
      <section class="briefing-section" id="sec-30-sec-brief">
        <div class="briefing-section-header">
          <div class="section-heading-title">
            <span class="section-number-pill">09</span>
            30-SECOND PRE-CALL BRIEF
          </div>
          <span class="badge badge-emerald">Read Right Before Hitting "Join"</span>
        </div>

        <div class="thirty-second-hero">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--primary-light); letter-spacing: 0.08em; font-weight: 700;">Counterparty</span>
              <h3 style="font-size: 1.15rem; color: #fff;">${tsb.contactSnippet}</h3>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-hero-copy-30s">
              Copy 30s Brief
            </button>
          </div>

          <div class="hero-bullet-list">
            <div class="hero-bullet-item">
              <span style="font-size: 1.2rem;">🎯</span>
              <div>
                <strong>PRIMARY OBJECTIVE:</strong>
                <div>${tsb.objective}</div>
              </div>
            </div>

            <div class="hero-bullet-item">
              <span style="font-size: 1.2rem;">⚠️</span>
              <div>
                <strong style="color: var(--amber);">DANGER ZONE:</strong>
                <div style="color: var(--text-primary);">${tsb.dangerZone}</div>
              </div>
            </div>

            <div class="hero-bullet-item">
              <span style="font-size: 1.2rem;">🏆</span>
              <div>
                <strong style="color: var(--emerald);">KEY ASK / WIN:</strong>
                <div>${tsb.keyAskOrWin}</div>
              </div>
            </div>

            <div class="hero-bullet-item">
              <span style="font-size: 1.2rem;">🚫</span>
              <div>
                <strong style="color: var(--rose);">CARDINAL RULE:</strong>
                <div>${tsb.quickRule}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

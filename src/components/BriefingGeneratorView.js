// Briefing Generator Form View
import { OBJECTIVE_PRESETS } from '../data/sampleData.js';

export function renderBriefingGenerator({ contacts, selectedContactId, userProfile, savedBriefings, onGenerate, onOpenSavedBriefing }) {
  const currentContact = contacts.find(c => c.id === selectedContactId) || contacts[0] || null;

  return `
    <div class="briefing-generator-wrapper">
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Generate Meeting Prep Briefing</h1>
          <p class="page-subtitle">Configure the meeting objective and let the agent parse all records for verified commitments and strategic prep.</p>
        </div>
      </div>

      <div class="generator-container">
        <!-- Configuration Form Panel -->
        <div class="glass-card" style="padding: 2rem;">
          <form id="form-generate-briefing">
            <!-- Contact Select -->
            <div class="form-group">
              <label class="form-label" for="gen-contact-select">
                Target Contact
                <span style="color: var(--text-tertiary); font-weight: normal;">*Required</span>
              </label>
              <select class="form-select" id="gen-contact-select" required>
                ${contacts.map(c => `
                  <option value="${c.id}" ${currentContact && currentContact.id === c.id ? 'selected' : ''}>
                    ${c.name} — ${c.role} (${c.organization})
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Meeting Objective -->
            <div class="form-group">
              <label class="form-label" for="gen-objective-input">
                Meeting Objective
                <span style="color: var(--text-tertiary); font-weight: normal;">What must be achieved?</span>
              </label>
              <input 
                type="text" 
                class="form-input" 
                id="gen-objective-input" 
                value="${currentContact?.upcomingMeeting?.objective || 'Review SLA Performance Remediation & Sign-off on Enterprise License Renewal'}" 
                placeholder="e.g. Align on API v3 timeline and address latency SLA"
                required
              />
              <div class="preset-chips">
                <span style="font-size: 0.72rem; color: var(--text-tertiary); align-self: center; margin-right: 0.2rem;">Quick Presets:</span>
                ${OBJECTIVE_PRESETS.map(preset => `
                  <button type="button" class="preset-chip" data-objective="${preset.objective}">
                    ${preset.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Scheduled Date & Time -->
            <div class="form-group">
              <label class="form-label" for="gen-time-input">
                Scheduled Time
              </label>
              <input 
                type="text" 
                class="form-input" 
                id="gen-time-input" 
                value="${currentContact?.upcomingMeeting?.scheduledDate || 'Today at 3:00 PM'}" 
                placeholder="e.g. Tomorrow at 10:30 AM"
              />
            </div>

            <!-- Recommended Prep Focus / Specific Concerns -->
            <div class="form-group">
              <label class="form-label" for="gen-focus-input">
                Custom Focus / Specific Attention Area (Optional)
              </label>
              <textarea 
                class="form-textarea" 
                id="gen-focus-input" 
                placeholder="e.g. Focus on our delayed latency report; Elena will likely raise this within the first 5 minutes."
              >${currentContact?.upcomingMeeting?.prepFocus || ''}</textarea>
            </div>

            <!-- User Style Override -->
            <div class="form-group">
              <label class="form-label" for="gen-style-select">
                Briefing Persona & Meeting Style
              </label>
              <select class="form-select" id="gen-style-select">
                <option value="Direct & Action-Oriented" ${userProfile.meetingStyle === 'Direct & Action-Oriented' ? 'selected' : ''}>Direct & Action-Oriented (BLUF, Numbers first)</option>
                <option value="Executive High-Level" ${userProfile.meetingStyle === 'Executive High-Level' ? 'selected' : ''}>Executive High-Level (Macro strategic, ROI, Runway)</option>
                <option value="Analytical & Deep-Dive" ${userProfile.meetingStyle === 'Analytical & Deep-Dive' ? 'selected' : ''}>Analytical & Deep-Dive (Metrics, Architecture, Root Cause)</option>
                <option value="Collaborative & Relationship-First" ${userProfile.meetingStyle === 'Collaborative & Relationship-First' ? 'selected' : ''}>Collaborative & Relationship-First (Consensus, Shared ownership)</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.85rem;" id="btn-submit-generate">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Synthesize 9-Part Briefing Now
            </button>
          </form>
        </div>

        <!-- Right Side: Agent Verification Rules & Saved History -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Agent Protocol Card -->
          <div class="glass-card" style="padding: 1.5rem; border-color: rgba(99, 102, 241, 0.3);">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
              <div class="brand-logo" style="width: 30px; height: 30px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 700;">Meeting Prep Agent Protocols</h3>
            </div>
            
            <ul style="padding-left: 1.25rem; font-size: 0.82rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.45rem;">
              <li><strong>Zero Fabrication Rule:</strong> Uses only verified data from previous meetings, messages, and emails.</li>
              <li><strong>Accountability Enforcement:</strong> If you promised an item and no completion is recorded, it is marked OVERDUE with proactive talking points.</li>
              <li><strong>9-Part Deliverable:</strong> Generates Snapshot, Last Interaction, Open Loops, Relationship Context, Talking Points, Questions to Ask, Follow-up Check, Personalized Prep, and a 30-Second Pre-Call Brief.</li>
              <li><strong>Strict Chronology:</strong> Preserves exact timeline of commitments and flags conflicting records.</li>
            </ul>
          </div>

          <!-- Previously Saved Briefings -->
          <div class="glass-card" style="padding: 1.5rem;">
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
              <span>Saved Briefings History (${savedBriefings.length})</span>
            </h3>

            ${savedBriefings.length === 0 ? `
              <p style="font-size: 0.82rem; color: var(--text-tertiary); text-align: center; padding: 1.5rem 0;">
                No briefings saved yet. Generate your first briefing on the left!
              </p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                ${savedBriefings.slice(0, 5).map(b => {
                  const contact = contacts.find(c => c.id === b.contactId);
                  return `
                    <div 
                      class="saved-briefing-item" 
                      data-briefing-id="${b.id}"
                      style="
                        background: rgba(15, 20, 35, 0.5); 
                        border: 1px solid var(--border-subtle); 
                        border-radius: var(--radius-md); 
                        padding: 0.75rem 1rem; 
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        transition: all var(--transition-fast);
                      "
                    >
                      <div style="min-width: 0; flex: 1;">
                        <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          ${contact?.name || 'Contact'} — ${b.meetingSnapshot.meetingObjective}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-tertiary); font-family: var(--font-mono); margin-top: 0.15rem;">
                          ${new Date(b.generatedAt).toLocaleString()}
                        </div>
                      </div>
                      <button class="btn btn-secondary btn-sm btn-open-saved-briefing" data-briefing-id="${b.id}">
                        View
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

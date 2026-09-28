// Modals Component: Log Interaction, Add/Edit Contact, User Settings
export class Modals {
  static renderContainer() {
    return `<div id="modal-root" class="modal-backdrop"></div>`;
  }

  static getRoot() {
    return document.getElementById('modal-root');
  }

  static close() {
    const root = this.getRoot();
    if (root) {
      root.classList.remove('open');
      root.innerHTML = '';
    }
  }

  /**
   * Log Interaction Modal
   */
  static openLogInteraction({ contacts, selectedContactId, onSave }) {
    const root = this.getRoot();
    if (!root) return;

    const todayStr = new Date().toISOString().slice(0, 10);

    root.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 700;">Log Interaction</h3>
          <button class="btn btn-icon btn-sm" id="btn-modal-close" style="border: none;">✕</button>
        </div>

        <form id="form-modal-log-interaction">
          <div class="form-group">
            <label class="form-label" for="log-contact-select">Contact</label>
            <select class="form-select" id="log-contact-select" required>
              ${contacts.map(c => `
                <option value="${c.id}" ${selectedContactId === c.id ? 'selected' : ''}>
                  ${c.name} (${c.organization})
                </option>
              `).join('')}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label" for="log-date">Date</label>
              <input type="date" class="form-input" id="log-date" value="${todayStr}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="log-type">Interaction Type</label>
              <select class="form-select" id="log-type">
                <option value="Meeting">Meeting / Call</option>
                <option value="Email">Email Thread</option>
                <option value="Slack/Chat">Slack / Message</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="log-title">Title / Topic</label>
            <input type="text" class="form-input" id="log-title" placeholder="e.g. Q4 Architecture Sync & Budget Review" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="log-summary">Discussion Summary</label>
            <textarea class="form-textarea" id="log-summary" placeholder="What happened? What was discussed?" required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="log-decisions">Decisions Made (one per line)</label>
            <textarea class="form-textarea" id="log-decisions" style="min-height: 60px;" placeholder="Agreed to proceed with sandbox trial..."></textarea>
          </div>

          <!-- Commitments Section -->
          <div style="background: rgba(10, 14, 25, 0.4); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.82rem; text-transform: uppercase; color: var(--primary-light); margin-bottom: 0.75rem;">
              Commitments & Promises
            </h4>

            <div class="form-group">
              <label class="form-label" for="log-user-commitment">What YOU Promised (optional)</label>
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem;">
                <input type="text" class="form-input" id="log-user-commitment" placeholder="e.g. Send revised SLA document" />
                <input type="date" class="form-input" id="log-user-due" title="Due Date" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="log-contact-commitment">What THE CONTACT Promised (optional)</label>
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem;">
                <input type="text" class="form-input" id="log-contact-commitment" placeholder="e.g. Share traffic traces" />
                <input type="date" class="form-input" id="log-contact-due" title="Due Date" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="log-questions">Unresolved Questions (one per line)</label>
            <textarea class="form-textarea" id="log-questions" style="min-height: 60px;" placeholder="Can their legal team expedite by Friday?"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="log-quotes">Notable Quotes</label>
            <input type="text" class="form-input" id="log-quotes" placeholder='"We need this live before the holiday rush."' />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-modal-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save to Memory</button>
          </div>
        </form>
      </div>
    `;

    root.classList.add('open');

    // Event listeners
    document.getElementById('btn-modal-close')?.addEventListener('click', () => this.close());
    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => this.close());

    document.getElementById('form-modal-log-interaction')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const contactId = document.getElementById('log-contact-select').value;
      const date = document.getElementById('log-date').value;
      const type = document.getElementById('log-type').value;
      const title = document.getElementById('log-title').value.trim();
      const summary = document.getElementById('log-summary').value.trim();
      
      const rawDecisions = document.getElementById('log-decisions').value.split('\n').map(s => s.trim()).filter(Boolean);
      const rawQuestions = document.getElementById('log-questions').value.split('\n').map(s => s.trim()).filter(Boolean);
      const rawQuotes = document.getElementById('log-quotes').value.trim();

      const userCommitmentText = document.getElementById('log-user-commitment').value.trim();
      const userDue = document.getElementById('log-user-due').value;

      const contactCommitmentText = document.getElementById('log-contact-commitment').value.trim();
      const contactDue = document.getElementById('log-contact-due').value;

      const userCommitments = userCommitmentText ? [{
        id: `uc-${Date.now()}`,
        text: userCommitmentText,
        dueDate: userDue || null,
        status: 'pending',
        completedDate: null
      }] : [];

      const contactCommitments = contactCommitmentText ? [{
        id: `cc-${Date.now()}`,
        text: contactCommitmentText,
        dueDate: contactDue || null,
        status: 'pending',
        completedDate: null
      }] : [];

      const newInteraction = {
        id: `int-${Date.now()}`,
        contactId,
        date,
        type,
        title,
        summary,
        keyTopics: [title],
        decisionsMade: rawDecisions,
        userCommitments,
        contactCommitments,
        unresolvedQuestions: rawQuestions,
        importantQuotes: rawQuotes ? [rawQuotes] : [],
        sentimentOrTone: 'Productive'
      };

      onSave(newInteraction);
      this.close();
    });
  }

  /**
   * New / Edit Contact Modal
   */
  static openContactModal({ contact = null, onSave }) {
    const root = this.getRoot();
    if (!root) return;

    const isEdit = !!contact;

    root.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 700;">${isEdit ? 'Edit Contact Profile' : 'New Contact Profile'}</h3>
          <button class="btn btn-icon btn-sm" id="btn-modal-close" style="border: none;">✕</button>
        </div>

        <form id="form-modal-contact">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label" for="contact-name">Full Name</label>
              <input type="text" class="form-input" id="contact-name" value="${contact?.name || ''}" placeholder="e.g. Dr. Jordan Lee" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-role">Title / Role</label>
              <input type="text" class="form-input" id="contact-role" value="${contact?.role || ''}" placeholder="e.g. Chief Technology Officer" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label" for="contact-org">Organization</label>
              <input type="text" class="form-input" id="contact-org" value="${contact?.organization || ''}" placeholder="e.g. Horizon Labs" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-email">Email</label>
              <input type="email" class="form-input" id="contact-email" value="${contact?.email || ''}" placeholder="jordan@horizonlabs.com" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="contact-stage">Relationship Type</label>
            <select class="form-select" id="contact-stage">
              <option value="Key Strategic Client" ${contact?.relationshipStage === 'Key Strategic Client' ? 'selected' : ''}>Key Strategic Client</option>
              <option value="Board Observer / Strategic Investor" ${contact?.relationshipStage?.includes('Investor') ? 'selected' : ''}>Board Observer / Strategic Investor</option>
              <option value="Co-Development Partner" ${contact?.relationshipStage?.includes('Partner') ? 'selected' : ''}>Co-Development Partner</option>
              <option value="Enterprise Prospect" ${contact?.relationshipStage === 'Enterprise Prospect' ? 'selected' : ''}>Enterprise Prospect</option>
              <option value="Internal Executive" ${contact?.relationshipStage === 'Internal Executive' ? 'selected' : ''}>Internal Executive</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="contact-style">Communication Style & Temperament</label>
            <textarea class="form-textarea" id="contact-style" placeholder="e.g. Data-driven, impatient with vagueness, prefers pre-reads.">${contact?.communicationStyle || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="contact-concerns">Recurring Concerns (one per line)</label>
            <textarea class="form-textarea" id="contact-concerns" style="min-height: 55px;" placeholder="SLA guarantees, budget compliance...">${contact?.recurringConcerns?.join('\n') || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="contact-priorities">Top Priorities (one per line)</label>
            <textarea class="form-textarea" id="contact-priorities" style="min-height: 55px;" placeholder="Launch by Q4, cut infrastructure costs...">${contact?.priorities?.join('\n') || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="contact-prefs">Preferences & Sensitivities (one per line)</label>
            <textarea class="form-textarea" id="contact-prefs" style="min-height: 55px;" placeholder="Send agenda 24h prior, no long slide decks...">${contact?.preferences?.join('\n') || ''}</textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-modal-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Contact' : 'Create Contact'}</button>
          </div>
        </form>
      </div>
    `;

    root.classList.add('open');

    document.getElementById('btn-modal-close')?.addEventListener('click', () => this.close());
    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => this.close());

    document.getElementById('form-modal-contact')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const role = document.getElementById('contact-role').value.trim();
      const organization = document.getElementById('contact-org').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const relationshipStage = document.getElementById('contact-stage').value;
      const communicationStyle = document.getElementById('contact-style').value.trim();
      
      const recurringConcerns = document.getElementById('contact-concerns').value.split('\n').map(s => s.trim()).filter(Boolean);
      const priorities = document.getElementById('contact-priorities').value.split('\n').map(s => s.trim()).filter(Boolean);
      const preferences = document.getElementById('contact-prefs').value.split('\n').map(s => s.trim()).filter(Boolean);

      const updated = {
        ...(contact || {}),
        id: contact?.id || `c-${Date.now()}`,
        name,
        role,
        organization,
        email,
        relationshipStage,
        communicationStyle,
        recurringConcerns,
        priorities,
        preferences,
        initials: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CT',
        avatarColor: contact?.avatarColor || '#6366f1'
      };

      onSave(updated);
      this.close();
    });
  }

  /**
   * User Settings / Meeting Style Modal
   */
  static openSettings({ userProfile, onSave, onResetData }) {
    const root = this.getRoot();
    if (!root) return;

    root.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem; font-weight: 700;">Meeting Prep Agent Preferences</h3>
          <button class="btn btn-icon btn-sm" id="btn-modal-close" style="border: none;">✕</button>
        </div>

        <form id="form-modal-settings">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label" for="set-user-name">Your Name</label>
              <input type="text" class="form-input" id="set-user-name" value="${userProfile.name || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="set-user-role">Your Role</label>
              <input type="text" class="form-input" id="set-user-role" value="${userProfile.role || ''}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="set-meeting-style">Default Meeting Style</label>
            <select class="form-select" id="set-meeting-style">
              <option value="Direct & Action-Oriented" ${userProfile.meetingStyle === 'Direct & Action-Oriented' ? 'selected' : ''}>Direct & Action-Oriented (BLUF, Numbers first)</option>
              <option value="Executive High-Level" ${userProfile.meetingStyle === 'Executive High-Level' ? 'selected' : ''}>Executive High-Level (Macro strategic, ROI, Runway)</option>
              <option value="Analytical & Deep-Dive" ${userProfile.meetingStyle === 'Analytical & Deep-Dive' ? 'selected' : ''}>Analytical & Deep-Dive (Metrics, Architecture, Root Cause)</option>
              <option value="Collaborative & Relationship-First" ${userProfile.meetingStyle === 'Collaborative & Relationship-First' ? 'selected' : ''}>Collaborative & Relationship-First (Consensus, Shared ownership)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="set-prep-depth">Briefing Reading Depth</label>
            <select class="form-select" id="set-prep-depth">
              <option value="Quick Scan (2 min)" ${userProfile.prepDepth?.includes('2') ? 'selected' : ''}>Quick Scan (2 min)</option>
              <option value="Standard (3-5 min)" ${userProfile.prepDepth?.includes('Standard') ? 'selected' : ''}>Standard (3-5 min)</option>
              <option value="Deep Context (Detailed)" ${userProfile.prepDepth?.includes('Deep') ? 'selected' : ''}>Deep Context (Detailed analysis)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="set-proactivity">Proactivity & Accountability Watch</label>
            <select class="form-select" id="set-proactivity">
              <option value="High Accountability (Flag all unverified promises & delays)" selected>
                High Accountability (Strictly flag unverified promises & delays)
              </option>
              <option value="Balanced">Balanced (Standard tracking)</option>
            </select>
          </div>

          <div style="background: rgba(244, 63, 94, 0.06); border: 1px solid var(--rose-border); border-radius: var(--radius-md); padding: 1rem; margin-top: 1.5rem;">
            <strong style="color: var(--rose); font-size: 0.85rem; display: block; margin-bottom: 0.35rem;">
              Reset Sample Demonstration Data
            </strong>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
              Restore the rich preloaded test contacts (Dr. Elena Rostova, Marcus Vance, Sarah Chen) and all sample interaction logs.
            </p>
            <button type="button" class="btn btn-outline-danger btn-sm" id="btn-modal-reset-data">
              Reset to Demo Data
            </button>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-modal-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Preferences</button>
          </div>
        </form>
      </div>
    `;

    root.classList.add('open');

    document.getElementById('btn-modal-close')?.addEventListener('click', () => this.close());
    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => this.close());

    document.getElementById('btn-modal-reset-data')?.addEventListener('click', () => {
      if (confirm("Reset all contacts, interactions, and briefings to original sample data?")) {
        onResetData();
        this.close();
      }
    });

    document.getElementById('form-modal-settings')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        ...userProfile,
        name: document.getElementById('set-user-name').value.trim(),
        role: document.getElementById('set-user-role').value.trim(),
        meetingStyle: document.getElementById('set-meeting-style').value,
        prepDepth: document.getElementById('set-prep-depth').value,
        proactivityMode: document.getElementById('set-proactivity').value
      };
      onSave(updated);
      this.close();
    });
  }
}

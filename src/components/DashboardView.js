// Dashboard View Component
export function renderDashboard({ contacts, interactions, userProfile, onSelectContact, onGenerateForContact, onToggleCommitment }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Compute key stats
  let totalOpenLoops = 0;
  let overdueCommitments = 0;
  let myPendingCommitments = 0;

  const criticalLoops = [];

  interactions.forEach(interaction => {
    (interaction.userCommitments || []).forEach(c => {
      if (c.status !== 'completed') {
        totalOpenLoops++;
        myPendingCommitments++;
        const isOverdue = c.status === 'missed' || (c.dueDate && c.dueDate < todayStr);
        if (isOverdue) overdueCommitments++;
        
        criticalLoops.push({
          ...c,
          interactionId: interaction.id,
          isUser: true,
          contactId: interaction.contactId,
          isOverdue,
          interactionTitle: interaction.title,
          interactionDate: interaction.date
        });
      }
    });

    (interaction.contactCommitments || []).forEach(c => {
      if (c.status !== 'completed') {
        totalOpenLoops++;
        const isOverdue = c.status === 'missed' || (c.dueDate && c.dueDate < todayStr);
        if (isOverdue) overdueCommitments++;

        criticalLoops.push({
          ...c,
          interactionId: interaction.id,
          isUser: false,
          contactId: interaction.contactId,
          isOverdue,
          interactionTitle: interaction.title,
          interactionDate: interaction.date
        });
      }
    });
  });

  // Sort critical loops: overdue first, then by date
  criticalLoops.sort((a, b) => (b.isOverdue ? 1 : 0) - (a.isOverdue ? 1 : 0));

  return `
    <div class="dashboard-wrapper">
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Executive Preparation Cockpit</h1>
          <p class="page-subtitle">
            Welcome back, <strong>${userProfile.name || 'Executive'}</strong>. Briefings are dynamically tailored to your <strong>${userProfile.meetingStyle}</strong> style.
          </p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-secondary" id="btn-export-data" title="Export local history">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export JSON
          </button>
          <button class="btn btn-primary" id="btn-dash-new-contact">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Contact
          </button>
        </div>
      </div>

      <!-- Stats Banner -->
      <div class="stats-banner">
        <div class="glass-card stat-card">
          <div class="stat-icon primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">${contacts.length}</span>
            <span class="stat-label">Active Contacts</span>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon rose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value" style="color: var(--rose);">${overdueCommitments}</span>
            <span class="stat-label">Overdue Follow-ups</span>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value" style="color: var(--amber);">${totalOpenLoops}</span>
            <span class="stat-label">Open Loop Items</span>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value" style="color: var(--emerald);">${interactions.length}</span>
            <span class="stat-label">Logged Interactions</span>
          </div>
        </div>
      </div>

      <!-- Main Two Column Grid -->
      <div class="dashboard-grid">
        <!-- Left: Upcoming Meetings & High Priority Contacts -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="section-header">
            <h2 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Upcoming Meetings Ready for Briefing
            </h2>
            <span class="badge badge-primary">One-Click Prep</span>
          </div>

          <div class="contacts-grid" style="grid-template-columns: 1fr;">
            ${contacts.filter(c => c.upcomingMeeting).map(contact => {
              const contactInteractions = interactions.filter(i => i.contactId === contact.id);
              const uncompletedUserPromises = contactInteractions
                .flatMap(i => i.userCommitments || [])
                .filter(c => c.status !== 'completed');
              
              const hasOverdue = uncompletedUserPromises.some(c => c.status === 'missed' || (c.dueDate && c.dueDate < todayStr));

              return `
                <div class="contact-card" data-contact-id="${contact.id}">
                  <div class="contact-card-top">
                    <div class="avatar" style="background-color: ${contact.avatarColor || '#6366f1'};">
                      ${contact.initials || contact.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div class="contact-meta">
                      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                        <h3 class="contact-name">${contact.name}</h3>
                        <span class="badge ${hasOverdue ? 'badge-rose' : 'badge-emerald'}">
                          ${hasOverdue ? 'Overdue Liability' : 'Clean Slate'}
                        </span>
                      </div>
                      <p class="contact-role">${contact.role}</p>
                      <p class="contact-org">${contact.organization}</p>
                    </div>
                  </div>

                  <div class="contact-upcoming-box">
                    <div class="contact-upcoming-label">
                      <span>Target: ${contact.upcomingMeeting.scheduledDate}</span>
                      <span style="color: var(--text-tertiary); font-family: var(--font-mono);">${contactInteractions.length} logs on record</span>
                    </div>
                    <div class="contact-upcoming-objective">
                      🎯 ${contact.upcomingMeeting.objective}
                    </div>
                  </div>

                  <div class="contact-actions-bar">
                    <span style="font-size: 0.78rem; color: var(--text-secondary);">
                      <strong>Prep Focus:</strong> ${contact.upcomingMeeting.prepFocus ? contact.upcomingMeeting.prepFocus.slice(0, 50) + '...' : 'General Alignment'}
                    </span>
                    <button class="btn btn-primary btn-sm btn-generate-prep" data-contact-id="${contact.id}">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                      Generate 9-Part Briefing
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Urgent Open Loops & Accountability Watch -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="section-header">
            <h2 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Accountability Watch (Open Loops)
            </h2>
            <span class="badge ${overdueCommitments > 0 ? 'badge-rose' : 'badge-emerald'}">
              ${overdueCommitments} Overdue
            </span>
          </div>

          <div class="glass-card" style="padding: 1.25rem;">
            <p style="font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 1rem;">
              Enforcing Rule: <em>"Never assume an action was completed unless available records indicate it."</em> Click status pill to toggle.
            </p>

            <div class="loops-list">
              ${criticalLoops.slice(0, 6).map(loop => {
                const contact = contacts.find(c => c.id === loop.contactId);
                return `
                  <div class="loop-item ${loop.isOverdue ? 'overdue' : ''}">
                    <div class="loop-content">
                      <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
                        <span class="badge ${loop.isUser ? 'badge-primary' : 'badge-cyan'}" style="font-size: 0.65rem;">
                          ${loop.isUser ? 'You Promised' : (contact?.name || 'Contact') + ' Promised'}
                        </span>
                        ${loop.isOverdue ? `<span class="badge badge-rose" style="font-size: 0.65rem;">Overdue</span>` : ''}
                      </div>
                      <div class="loop-title">${loop.text}</div>
                      <div class="loop-meta">
                        <span>Due: ${loop.dueDate || 'Unspecified'}</span>
                        <span>•</span>
                        <span>Logged: ${loop.interactionDate}</span>
                      </div>
                    </div>
                    <div class="loop-actions">
                      <button 
                        class="status-pill ${loop.status}" 
                        data-interaction-id="${loop.interactionId}"
                        data-commitment-id="${loop.id}"
                        data-is-user="${loop.isUser}"
                        data-current-status="${loop.status}"
                        title="Click to advance status"
                      >
                        ${loop.status.toUpperCase()}
                      </button>
                    </div>
                  </div>
                `;
              }).join('') || `
                <div style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
                  🎉 All open loops and commitments are resolved!
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

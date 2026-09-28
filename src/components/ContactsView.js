// Contacts Directory & Detail View Component
export function renderContactsView({ contacts, interactions, selectedContactId, onSelectContact, onNewContact, onLogInteraction, onGenerateForContact }) {
  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0] || null;
  const contactInteractions = selectedContact 
    ? interactions.filter(i => i.contactId === selectedContact.id).sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  const todayStr = new Date().toISOString().slice(0, 10);

  return `
    <div class="contacts-page-wrapper">
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Contacts & Interaction Ledger</h1>
          <p class="page-subtitle">Complete historical memory, decisions, and commitment verification.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-secondary" id="btn-contacts-log-interaction">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Log Interaction
          </button>
          <button class="btn btn-primary" id="btn-contacts-add">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            New Contact
          </button>
        </div>
      </div>

      <!-- Two-column Master-Detail Layout -->
      <div style="display: grid; grid-template-columns: 340px 1fr; gap: 1.75rem; align-items: start;">
        <!-- Left: Contact Selector Sidebar -->
        <div class="glass-card" style="padding: 1.25rem;">
          <div style="margin-bottom: 1rem;">
            <input 
              type="text" 
              class="form-input" 
              id="contact-search-input" 
              placeholder="Search contacts..." 
              style="width: 100%; font-size: 0.85rem;"
            />
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.6rem;" id="contact-list-container">
            ${contacts.map(c => {
              const count = interactions.filter(i => i.contactId === c.id).length;
              const isSelected = selectedContact && selectedContact.id === c.id;
              return `
                <div 
                  class="contact-selector-item ${isSelected ? 'active' : ''}" 
                  data-contact-id="${c.id}"
                  style="
                    display: flex; 
                    align-items: center; 
                    gap: 0.75rem; 
                    padding: 0.75rem; 
                    border-radius: var(--radius-md); 
                    border: 1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}; 
                    background: ${isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 20, 35, 0.5)'}; 
                    cursor: pointer;
                    transition: all var(--transition-fast);
                  "
                >
                  <div class="avatar" style="width: 36px; height: 36px; font-size: 0.85rem; background-color: ${c.avatarColor || '#6366f1'};">
                    ${c.initials || c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${c.name}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${c.organization}
                    </div>
                  </div>
                  <span class="badge badge-primary" style="font-size: 0.65rem;">${count}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Contact Detail Dossier -->
        ${selectedContact ? `
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Profile Card -->
            <div class="glass-card" style="padding: 1.75rem;">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 1.25rem;">
                  <div class="avatar" style="width: 64px; height: 64px; font-size: 1.5rem; background-color: ${selectedContact.avatarColor || '#6366f1'};">
                    ${selectedContact.initials || selectedContact.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <h2 style="font-size: 1.5rem; font-weight: 800;">${selectedContact.name}</h2>
                      <span class="badge badge-primary">${selectedContact.relationshipStage || 'Active Stakeholder'}</span>
                    </div>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.15rem;">
                      ${selectedContact.role} • <strong>${selectedContact.organization}</strong>
                    </p>
                    <p style="font-size: 0.8rem; color: var(--text-tertiary); font-family: var(--font-mono); margin-top: 0.2rem;">
                      ${selectedContact.email || 'No email on file'}
                    </p>
                  </div>
                </div>

                <div style="display: flex; gap: 0.6rem;">
                  <button class="btn btn-primary" id="btn-detail-generate-briefing" data-contact-id="${selectedContact.id}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Generate Briefing
                  </button>
                  <button class="btn btn-secondary btn-icon" id="btn-edit-contact" data-contact-id="${selectedContact.id}" title="Edit Profile">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button class="btn btn-outline-danger btn-icon" id="btn-delete-contact" data-contact-id="${selectedContact.id}" title="Delete Contact">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Interpersonal Intelligence Sub-grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
                <div>
                  <h4 style="font-size: 0.78rem; text-transform: uppercase; color: var(--accent-cyan); letter-spacing: 0.05em; margin-bottom: 0.35rem;">
                    Communication Style & Behavioral Traits
                  </h4>
                  <p style="font-size: 0.88rem; color: var(--text-primary);">
                    ${selectedContact.communicationStyle || 'Direct and professional.'}
                  </p>
                </div>

                <div>
                  <h4 style="font-size: 0.78rem; text-transform: uppercase; color: var(--accent-amber); letter-spacing: 0.05em; margin-bottom: 0.35rem;">
                    Top Recurring Concerns
                  </h4>
                  <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
                    ${(selectedContact.recurringConcerns || []).map(rc => `<li>${rc}</li>`).join('') || '<li>None noted.</li>'}
                  </ul>
                </div>

                <div>
                  <h4 style="font-size: 0.78rem; text-transform: uppercase; color: var(--emerald); letter-spacing: 0.05em; margin-bottom: 0.35rem;">
                    Current Priorities
                  </h4>
                  <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
                    ${(selectedContact.priorities || []).map(p => `<li>${p}</li>`).join('') || '<li>None recorded.</li>'}
                  </ul>
                </div>

                <div>
                  <h4 style="font-size: 0.78rem; text-transform: uppercase; color: var(--primary-light); letter-spacing: 0.05em; margin-bottom: 0.35rem;">
                    Preferences & Sensitivities
                  </h4>
                  <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
                    ${(selectedContact.preferences || []).map(pref => `<li>${pref}</li>`).join('') || '<li>Standard business etiquette.</li>'}
                  </ul>
                </div>
              </div>
            </div>

            <!-- Interaction History Timeline -->
            <div class="glass-card" style="padding: 1.75rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Interaction Timeline (${contactInteractions.length})
                </h3>
                <button class="btn btn-secondary btn-sm" id="btn-timeline-add-interaction" data-contact-id="${selectedContact.id}">
                  + Add Log
                </button>
              </div>

              ${contactInteractions.length === 0 ? `
                <div style="text-align: center; padding: 3rem 1rem; color: var(--text-tertiary);">
                  <p>No interactions logged yet for this contact.</p>
                  <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" id="btn-empty-log-interaction" data-contact-id="${selectedContact.id}">
                    Log First Interaction
                  </button>
                </div>
              ` : `
                <div class="timeline">
                  ${contactInteractions.map(interaction => {
                    return `
                      <div class="timeline-entry">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                          <div class="timeline-header">
                            <div>
                              <span class="badge badge-primary" style="margin-right: 0.5rem;">${interaction.type}</span>
                              <strong style="font-size: 0.95rem;">${interaction.title}</strong>
                            </div>
                            <span class="timeline-date">${interaction.date}</span>
                          </div>

                          <p style="font-size: 0.88rem; color: var(--text-primary); margin-bottom: 0.75rem;">
                            ${interaction.summary}
                          </p>

                          ${interaction.decisionsMade?.length ? `
                            <div style="margin-bottom: 0.6rem;">
                              <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--emerald);">Decisions Made:</strong>
                              <ul style="padding-left: 1.2rem; font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.2rem;">
                                ${interaction.decisionsMade.map(d => `<li>${d}</li>`).join('')}
                              </ul>
                            </div>
                          ` : ''}

                          <!-- User commitments -->
                          ${interaction.userCommitments?.length ? `
                            <div style="margin-bottom: 0.6rem;">
                              <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--primary-light);">You Promised:</strong>
                              <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.25rem;">
                                ${interaction.userCommitments.map(c => `
                                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; background: rgba(10, 14, 25, 0.4); padding: 0.35rem 0.6rem; border-radius: var(--radius-sm);">
                                    <span>${c.text} <em style="color: var(--text-tertiary);">(Due: ${c.dueDate || 'Unspecified'})</em></span>
                                    <button 
                                      class="status-pill ${c.status}" 
                                      data-interaction-id="${interaction.id}" 
                                      data-commitment-id="${c.id}" 
                                      data-is-user="true"
                                      data-current-status="${c.status}"
                                    >
                                      ${c.status.toUpperCase()}
                                    </button>
                                  </div>
                                `).join('')}
                              </div>
                            </div>
                          ` : ''}

                          <!-- Contact commitments -->
                          ${interaction.contactCommitments?.length ? `
                            <div style="margin-bottom: 0.6rem;">
                              <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--accent-cyan);">${selectedContact.name} Promised:</strong>
                              <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.25rem;">
                                ${interaction.contactCommitments.map(c => `
                                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; background: rgba(10, 14, 25, 0.4); padding: 0.35rem 0.6rem; border-radius: var(--radius-sm);">
                                    <span>${c.text} <em style="color: var(--text-tertiary);">(Due: ${c.dueDate || 'Unspecified'})</em></span>
                                    <button 
                                      class="status-pill ${c.status}" 
                                      data-interaction-id="${interaction.id}" 
                                      data-commitment-id="${c.id}" 
                                      data-is-user="false"
                                      data-current-status="${c.status}"
                                    >
                                      ${c.status.toUpperCase()}
                                    </button>
                                  </div>
                                `).join('')}
                              </div>
                            </div>
                          ` : ''}

                          <!-- Quotes -->
                          ${interaction.importantQuotes?.length ? `
                            <div style="margin-top: 0.6rem; border-left: 2px solid var(--accent-amber); padding-left: 0.75rem; font-style: italic; font-size: 0.82rem; color: var(--text-secondary);">
                              ${interaction.importantQuotes.map(q => `<div>${q}</div>`).join('')}
                            </div>
                          ` : ''}

                          <div style="display: flex; justify-content: flex-end; margin-top: 0.75rem;">
                            <button class="btn btn-outline-danger btn-sm btn-delete-interaction" data-interaction-id="${interaction.id}">
                              Delete Log
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>
          </div>
        ` : `
          <div class="glass-card" style="text-align: center; padding: 4rem;">
            <p>Select a contact from the list or create a new one.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

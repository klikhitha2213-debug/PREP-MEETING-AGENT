// Main Application Entrypoint for Meeting Prep Agent
import './style.css';
import { Storage } from './data/storage.js';
import { BriefingEngine } from './engine/briefingEngine.js';
import { Toast } from './components/Toast.js';
import { renderHeader } from './components/Header.js';
import { renderDashboard } from './components/DashboardView.js';
import { renderContactsView } from './components/ContactsView.js';
import { renderBriefingGenerator } from './components/BriefingGeneratorView.js';
import { renderBriefingDisplay } from './components/BriefingDisplayView.js';
import { Modals } from './components/Modals.js';

// Application State
const state = {
  currentView: 'dashboard', // 'dashboard' | 'contacts' | 'generator' | 'briefing'
  selectedContactId: 'c-1', // Default to Dr. Elena Rostova
  currentBriefing: null,
  contacts: [],
  interactions: [],
  userProfile: {},
  savedBriefings: []
};

// Initialize Application
function initApp() {
  Storage.init();
  refreshStateFromStorage();

  // If there are saved briefings, load the latest; otherwise generate default for first contact
  if (state.savedBriefings.length > 0) {
    state.currentBriefing = state.savedBriefings[0];
  } else if (state.contacts.length > 0) {
    generateBriefingForContact(state.contacts[0].id, false);
  }

  render();
  bindGlobalEvents();
}

function refreshStateFromStorage() {
  state.contacts = Storage.getContacts();
  state.interactions = Storage.getInteractions();
  state.userProfile = Storage.getUserProfile();
  state.savedBriefings = Storage.getSavedBriefings();
  
  if (!state.selectedContactId && state.contacts.length > 0) {
    state.selectedContactId = state.contacts[0].id;
  }
}

// Generate briefing engine orchestrator
function generateBriefingForContact(contactId, navigateToBriefing = true, customObjective = null, customFocus = null, styleOverride = null) {
  const contact = Storage.getContactById(contactId);
  if (!contact) return;

  const interactions = Storage.getInteractions(contactId);
  const userProfile = { ...state.userProfile };
  if (styleOverride) {
    userProfile.meetingStyle = styleOverride;
  }

  const meetingParams = {
    objective: customObjective || contact.upcomingMeeting?.objective || "Strategic Status & Alignment Review",
    scheduledDate: contact.upcomingMeeting?.scheduledDate || "Upcoming",
    customFocus: customFocus || contact.upcomingMeeting?.prepFocus || ""
  };

  const briefing = BriefingEngine.generate({
    contact,
    interactions,
    meetingParams,
    userProfile
  });

  state.currentBriefing = briefing;
  state.selectedContactId = contactId;
  Storage.saveBriefing(briefing);
  state.savedBriefings = Storage.getSavedBriefings();

  if (navigateToBriefing) {
    state.currentView = 'briefing';
    Toast.show(`9-Part Prep Briefing ready for ${contact.name}!`, 'success');
  }

  render();
}

// Render Master UI
function render() {
  const headerMount = document.getElementById('header-mount');
  const mainMount = document.getElementById('main-content');

  // Render Header
  if (headerMount) {
    headerMount.innerHTML = renderHeader({
      currentView: state.currentView
    });
  }

  // Render View
  if (mainMount) {
    switch (state.currentView) {
      case 'dashboard':
        mainMount.innerHTML = renderDashboard({
          contacts: state.contacts,
          interactions: state.interactions,
          userProfile: state.userProfile
        });
        break;

      case 'contacts':
        mainMount.innerHTML = renderContactsView({
          contacts: state.contacts,
          interactions: state.interactions,
          selectedContactId: state.selectedContactId
        });
        break;

      case 'generator':
        mainMount.innerHTML = renderBriefingGenerator({
          contacts: state.contacts,
          selectedContactId: state.selectedContactId,
          userProfile: state.userProfile,
          savedBriefings: state.savedBriefings
        });
        break;

      case 'briefing':
        mainMount.innerHTML = renderBriefingDisplay({
          briefing: state.currentBriefing
        });
        break;

      default:
        mainMount.innerHTML = renderDashboard({
          contacts: state.contacts,
          interactions: state.interactions,
          userProfile: state.userProfile
        });
    }
  }

  // Re-bind context-specific DOM listeners
  bindViewEvents();
}

// Global Event Listeners
function bindGlobalEvents() {
  document.addEventListener('click', (e) => {
    // Navigation tab switching
    const navBtn = e.target.closest('.nav-tab-btn');
    if (navBtn) {
      const view = navBtn.getAttribute('data-view');
      if (view) {
        state.currentView = view;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Brand logo returns to Dashboard
    if (e.target.closest('#btn-brand-home')) {
      state.currentView = 'dashboard';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Quick Log Interaction Header button
    if (e.target.closest('#btn-quick-log')) {
      Modals.openLogInteraction({
        contacts: state.contacts,
        selectedContactId: state.selectedContactId,
        onSave: (newInteraction) => {
          Storage.saveInteraction(newInteraction);
          refreshStateFromStorage();
          Toast.show('Interaction and commitments saved to record!');
          render();
        }
      });
      return;
    }

    // Settings Header button
    if (e.target.closest('#btn-open-settings')) {
      Modals.openSettings({
        userProfile: state.userProfile,
        onSave: (updatedProfile) => {
          Storage.saveUserProfile(updatedProfile);
          refreshStateFromStorage();
          Toast.show('Meeting prep preferences saved!');
          render();
        },
        onResetData: () => {
          Storage.resetToDefaults();
          refreshStateFromStorage();
          state.selectedContactId = 'c-1';
          generateBriefingForContact('c-1', false);
          Toast.show('Reset to sample data successfully!');
          render();
        }
      });
      return;
    }

    // Commitment status toggle pill (Pending -> Completed -> Missed -> Pending)
    const statusPill = e.target.closest('.status-pill');
    if (statusPill) {
      const interactionId = statusPill.getAttribute('data-interaction-id');
      const commitmentId = statusPill.getAttribute('data-commitment-id');
      const isUser = statusPill.getAttribute('data-is-user') === 'true';
      const currentStatus = statusPill.getAttribute('data-current-status');

      let nextStatus = 'completed';
      if (currentStatus === 'completed') nextStatus = 'missed';
      else if (currentStatus === 'missed') nextStatus = 'pending';
      else nextStatus = 'completed';

      const success = Storage.updateCommitmentStatus(interactionId, commitmentId, isUser, nextStatus);
      if (success) {
        refreshStateFromStorage();
        // If current briefing matches this contact, re-generate to reflect verified update
        if (state.currentBriefing) {
          const matchingInteraction = state.interactions.find(i => i.id === interactionId);
          if (matchingInteraction && matchingInteraction.contactId === state.currentBriefing.contactId) {
            generateBriefingForContact(state.currentBriefing.contactId, false, state.currentBriefing.meetingSnapshot.meetingObjective);
          }
        }
        Toast.show(`Commitment marked ${nextStatus.toUpperCase()}!`);
        render();
      }
      return;
    }
  });
}

// View-specific Event Bindings
function bindViewEvents() {
  // 1. Dashboard Events
  const btnDashNewContact = document.getElementById('btn-dash-new-contact');
  btnDashNewContact?.addEventListener('click', () => {
    Modals.openContactModal({
      onSave: (newContact) => {
        Storage.saveContact(newContact);
        refreshStateFromStorage();
        state.selectedContactId = newContact.id;
        Toast.show(`Contact ${newContact.name} created!`);
        render();
      }
    });
  });

  const btnExportData = document.getElementById('btn-export-data');
  btnExportData?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(Storage.exportAllData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `meeting_prep_records_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    Toast.show('Complete records exported as JSON!');
  });

  document.querySelectorAll('.btn-generate-prep').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const contactId = btn.getAttribute('data-contact-id');
      generateBriefingForContact(contactId, true);
    });
  });

  // Clicking anywhere on contact card in dashboard selects contact & goes to contacts view
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-generate-prep')) return;
      const contactId = card.getAttribute('data-contact-id');
      if (contactId) {
        state.selectedContactId = contactId;
        state.currentView = 'contacts';
        render();
      }
    });
  });

  // 2. Contacts View Events
  const btnContactsAdd = document.getElementById('btn-contacts-add');
  btnContactsAdd?.addEventListener('click', () => {
    Modals.openContactModal({
      onSave: (newContact) => {
        Storage.saveContact(newContact);
        refreshStateFromStorage();
        state.selectedContactId = newContact.id;
        Toast.show(`Contact ${newContact.name} added!`);
        render();
      }
    });
  });

  const btnContactsLogInteraction = document.getElementById('btn-contacts-log-interaction');
  const btnTimelineAddInteraction = document.getElementById('btn-timeline-add-interaction');
  const btnEmptyLogInteraction = document.getElementById('btn-empty-log-interaction');
  
  [btnContactsLogInteraction, btnTimelineAddInteraction, btnEmptyLogInteraction].forEach(btn => {
    btn?.addEventListener('click', () => {
      Modals.openLogInteraction({
        contacts: state.contacts,
        selectedContactId: state.selectedContactId,
        onSave: (newInteraction) => {
          Storage.saveInteraction(newInteraction);
          refreshStateFromStorage();
          Toast.show('Interaction saved to record!');
          render();
        }
      });
    });
  });

  const btnEditContact = document.getElementById('btn-edit-contact');
  btnEditContact?.addEventListener('click', () => {
    const contact = Storage.getContactById(state.selectedContactId);
    if (contact) {
      Modals.openContactModal({
        contact,
        onSave: (updated) => {
          Storage.saveContact(updated);
          refreshStateFromStorage();
          Toast.show('Contact profile updated!');
          render();
        }
      });
    }
  });

  const btnDeleteContact = document.getElementById('btn-delete-contact');
  btnDeleteContact?.addEventListener('click', () => {
    const contact = Storage.getContactById(state.selectedContactId);
    if (contact && confirm(`Permanently delete ${contact.name} and all associated interaction history?`)) {
      Storage.deleteContact(state.selectedContactId);
      refreshStateFromStorage();
      state.selectedContactId = state.contacts[0]?.id || null;
      Toast.show('Contact deleted.');
      render();
    }
  });

  const btnDetailGenerateBriefing = document.getElementById('btn-detail-generate-briefing');
  btnDetailGenerateBriefing?.addEventListener('click', () => {
    generateBriefingForContact(state.selectedContactId, true);
  });

  // Search input in Contacts sidebar
  const searchInput = document.getElementById('contact-search-input');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.contact-selector-item').forEach(item => {
      const contactId = item.getAttribute('data-contact-id');
      const contact = state.contacts.find(c => c.id === contactId);
      if (!contact) return;
      const match = contact.name.toLowerCase().includes(query) ||
                    contact.organization.toLowerCase().includes(query) ||
                    contact.role.toLowerCase().includes(query);
      item.style.display = match ? 'flex' : 'none';
    });
  });

  // Contact list item click in Contacts sidebar
  document.querySelectorAll('.contact-selector-item').forEach(item => {
    item.addEventListener('click', () => {
      const contactId = item.getAttribute('data-contact-id');
      if (contactId) {
        state.selectedContactId = contactId;
        render();
      }
    });
  });

  // Delete individual interaction log
  document.querySelectorAll('.btn-delete-interaction').forEach(btn => {
    btn.addEventListener('click', () => {
      const intId = btn.getAttribute('data-interaction-id');
      if (intId && confirm("Delete this interaction record?")) {
        Storage.deleteInteraction(intId);
        refreshStateFromStorage();
        Toast.show('Log entry removed.');
        render();
      }
    });
  });

  // 3. Briefing Generator Events
  const formGen = document.getElementById('form-generate-briefing');
  formGen?.addEventListener('submit', (e) => {
    e.preventDefault();
    const contactId = document.getElementById('gen-contact-select').value;
    const objective = document.getElementById('gen-objective-input').value.trim();
    const scheduledTime = document.getElementById('gen-time-input').value.trim();
    const customFocus = document.getElementById('gen-focus-input').value.trim();
    const styleOverride = document.getElementById('gen-style-select').value;

    const contact = Storage.getContactById(contactId);
    if (!contact) return;

    if (scheduledTime) {
      if (!contact.upcomingMeeting) contact.upcomingMeeting = {};
      contact.upcomingMeeting.scheduledDate = scheduledTime;
      contact.upcomingMeeting.objective = objective;
      Storage.saveContact(contact);
    }

    generateBriefingForContact(contactId, true, objective, customFocus, styleOverride);
  });

  // Generator Preset Chips
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const obj = chip.getAttribute('data-objective');
      const input = document.getElementById('gen-objective-input');
      if (input && obj) {
        input.value = obj;
        input.focus();
      }
    });
  });

  // Open saved briefing
  document.querySelectorAll('.btn-open-saved-briefing').forEach(btn => {
    btn.addEventListener('click', () => {
      const brfId = btn.getAttribute('data-briefing-id');
      const found = state.savedBriefings.find(b => b.id === brfId);
      if (found) {
        state.currentBriefing = found;
        state.currentView = 'briefing';
        render();
      }
    });
  });

  // 4. Briefing Display Events
  const btnEmptyGoGenerator = document.getElementById('btn-empty-go-generator');
  btnEmptyGoGenerator?.addEventListener('click', () => {
    state.currentView = 'generator';
    render();
  });

  const btnCopyFullBrief = document.getElementById('btn-copy-full-brief');
  btnCopyFullBrief?.addEventListener('click', async () => {
    if (!state.currentBriefing) return;
    const md = BriefingEngine.toMarkdown(state.currentBriefing);
    try {
      await navigator.clipboard.writeText(md);
      Toast.show('Full 9-Part Markdown copied to clipboard!');
    } catch {
      fallbackCopy(md);
      Toast.show('Briefing copied to clipboard!');
    }
  });

  const btnCopy30s = document.getElementById('btn-copy-30s-brief');
  const btnHeroCopy30s = document.getElementById('btn-hero-copy-30s');
  [btnCopy30s, btnHeroCopy30s].forEach(btn => {
    btn?.addEventListener('click', async () => {
      if (!state.currentBriefing) return;
      const tsb = state.currentBriefing.thirtySecondBrief;
      const text = `
30-SECOND PRE-CALL BRIEF:
Contact: ${tsb.contactSnippet}
Objective: ${tsb.objective}
${tsb.dangerZone}
${tsb.keyAskOrWin}
${tsb.quickRule}
      `.trim();

      try {
        await navigator.clipboard.writeText(text);
        Toast.show('30-Second Brief copied to clipboard!');
      } catch {
        fallbackCopy(text);
        Toast.show('30-Second Brief copied!');
      }
    });
  });

  const btnPrint = document.getElementById('btn-print-brief');
  btnPrint?.addEventListener('click', () => {
    window.print();
  });
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Storage manager for Meeting Prep Agent with localStorage persistence
import { INITIAL_USER_PROFILE, INITIAL_CONTACTS, INITIAL_INTERACTIONS } from './sampleData.js';

const STORAGE_KEYS = {
  USER_PROFILE: 'mpa_user_profile',
  CONTACTS: 'mpa_contacts',
  INTERACTIONS: 'mpa_interactions',
  BRIEFINGS: 'mpa_saved_briefings'
};

export const Storage = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_CONTACTS));
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(INITIAL_INTERACTIONS));
    localStorage.setItem(STORAGE_KEYS.BRIEFINGS, JSON.stringify([]));
  },

  getUserProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : { ...INITIAL_USER_PROFILE };
    } catch {
      return { ...INITIAL_USER_PROFILE };
    }
  },

  saveUserProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getContacts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : [...INITIAL_CONTACTS];
    } catch {
      return [...INITIAL_CONTACTS];
    }
  },

  getContactById(id) {
    const contacts = this.getContacts();
    return contacts.find(c => c.id === id) || null;
  },

  saveContact(contact) {
    const contacts = this.getContacts();
    const existingIndex = contacts.findIndex(c => c.id === contact.id);
    if (existingIndex >= 0) {
      contacts[existingIndex] = contact;
    } else {
      contacts.unshift(contact);
    }
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return contact;
  },

  deleteContact(id) {
    let contacts = this.getContacts();
    contacts = contacts.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));

    let interactions = this.getInteractions();
    interactions = interactions.filter(i => i.contactId !== id);
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
  },

  getInteractions(contactId = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTERACTIONS);
      const interactions = data ? JSON.parse(data) : [...INITIAL_INTERACTIONS];
      if (contactId) {
        return interactions
          .filter(i => i.contactId === contactId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return interactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch {
      return [];
    }
  },

  saveInteraction(interaction) {
    const interactions = this.getInteractions();
    const existingIndex = interactions.findIndex(i => i.id === interaction.id);
    if (existingIndex >= 0) {
      interactions[existingIndex] = interaction;
    } else {
      interactions.unshift(interaction);
    }
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
    return interaction;
  },

  deleteInteraction(id) {
    let interactions = this.getInteractions();
    interactions = interactions.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
  },

  updateCommitmentStatus(interactionId, commitmentId, isUser, newStatus) {
    const interactions = this.getInteractions();
    const interaction = interactions.find(i => i.id === interactionId);
    if (!interaction) return false;

    const list = isUser ? interaction.userCommitments : interaction.contactCommitments;
    const commitment = list?.find(c => c.id === commitmentId);
    if (commitment) {
      commitment.status = newStatus;
      commitment.completedDate = newStatus === 'completed' ? new Date().toISOString().slice(0, 10) : null;
      this.saveInteraction(interaction);
      return true;
    }
    return false;
  },

  getSavedBriefings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRIEFINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBriefing(briefing) {
    const briefings = this.getSavedBriefings();
    briefings.unshift(briefing);
    localStorage.setItem(STORAGE_KEYS.BRIEFINGS, JSON.stringify(briefings));
    return briefing;
  },

  deleteBriefing(id) {
    let briefings = this.getSavedBriefings();
    briefings = briefings.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BRIEFINGS, JSON.stringify(briefings));
  },

  exportAllData() {
    return JSON.stringify({
      userProfile: this.getUserProfile(),
      contacts: this.getContacts(),
      interactions: this.getInteractions(),
      briefings: this.getSavedBriefings()
    }, null, 2);
  },

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.userProfile) localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(parsed.userProfile));
      if (parsed.contacts) localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(parsed.contacts));
      if (parsed.interactions) localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(parsed.interactions));
      if (parsed.briefings) localStorage.setItem(STORAGE_KEYS.BRIEFINGS, JSON.stringify(parsed.briefings));
      return true;
    } catch {
      return false;
    }
  }
};

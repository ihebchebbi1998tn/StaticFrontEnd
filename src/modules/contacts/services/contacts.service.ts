// API-backed service layer for contacts
import { contactsApi, contactNotesApi, contactTagsApi, type Contact, type ContactNote } from '@/services/contactsApi';

export const ContactService = {
  async getNotes(contactId: string): Promise<ContactNote[]> {
    try {
      const response = await contactNotesApi.getNotesByContactId(parseInt(contactId));
      return response.notes;
    } catch (error) {
      console.error('Failed to load notes:', error);
      return [];
    }
  },

  async saveNotes(contactId: string, notes: ContactNote[]): Promise<void> {
    // Notes are saved individually through the API, so this method is no longer needed
    // but kept for compatibility
    console.log('saveNotes is deprecated - notes are saved individually via API');
  },

  async getTags(contactId: string): Promise<string[]> {
    try {
      const contact = await contactsApi.getContactById(parseInt(contactId));
      return contact.tags.map(tag => tag.name);
    } catch (error) {
      console.error('Failed to load tags:', error);
      return [];
    }
  },

  async saveTags(contactId: string, tags: string[]): Promise<void> {
    // Tags are managed through the contact API, so this method is no longer needed
    // but kept for compatibility
    console.log('saveTags is deprecated - tags are managed via contact API');
  },

  async getOffers(contactId: string): Promise<any[]> {
    // Offers functionality will be implemented later
    return [];
  },

  async saveOffers(contactId: string, offers: any[]): Promise<void> {
    // Offers functionality will be implemented later
    console.log('saveOffers not yet implemented');
  }
};

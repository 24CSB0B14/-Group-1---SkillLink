import api from './api';

const messageService = {
  // Start or get a conversation
  startConversation: async (receiverIdentifier, jobId = null, contractId = null) => {
    try {
      const response = await api.post('/messages/start', {
        receiverIdentifier,
        jobId,
        contractId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all conversations for the current user
  getUserConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send a message (REST fallback)
  sendMessage: async (conversationId, text, fileUrl = null) => {
    try {
      const response = await api.post('/messages/send', {
        conversationId,
        text,
        fileUrl,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default messageService;

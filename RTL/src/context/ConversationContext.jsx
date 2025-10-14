import React, { createContext, useContext, useState, useEffect } from 'react';
import { conversationsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const ConversationContext = createContext();

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
};

export const ConversationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    } else {
      setConversations([]);
      setCurrentConversation(null);
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationsAPI.getAll();
      setConversations(response.data);
      
      // Don't auto-select a conversation - let user start fresh or choose from sidebar
      // This ensures "New Chat" experience on login
      setCurrentConversation(null);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title = 'New Conversation') => {
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot create conversation');
      return null;
    }
    
    try {
      const response = await conversationsAPI.create(title);
      const newConv = response.data;
      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      return newConv;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  const startNewChat = () => {
    // Clear current conversation to show welcome screen
    // New conversation will be created when user sends first message
    setCurrentConversation(null);
  };

  const selectConversation = async (conversationId) => {
    try {
      const response = await conversationsAPI.getById(conversationId);
      setCurrentConversation(response.data);
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  const addMessage = async (role, content, imageUrl = null) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping message save');
      return null;
    }

    if (!currentConversation) {
      // Create a new conversation if none exists
      try {
        console.log('No current conversation, creating new one...');
        const newConv = await createConversation('New Chat');
        if (!newConv) {
          console.error('Failed to create conversation');
          return null;
        }
        console.log('New conversation created:', newConv._id);
        const response = await conversationsAPI.addMessage(newConv._id, role, content, imageUrl);
        setCurrentConversation(response.data);
        await loadConversations();
        return response.data;
      } catch (error) {
        console.error('Error creating conversation and adding message:', error);
        return null;
      }
    }

    try {
      const response = await conversationsAPI.addMessage(
        currentConversation._id,
        role,
        content,
        imageUrl
      );
      setCurrentConversation(response.data);
      
      // Update the conversation in the list
      setConversations(conversations.map(conv => 
        conv._id === response.data._id ? response.data : conv
      ));
      
      return response.data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  };

  const updateConversationTitle = async (conversationId, title) => {
    try {
      const response = await conversationsAPI.updateTitle(conversationId, title);
      setConversations(conversations.map(conv => 
        conv._id === conversationId ? { ...conv, title } : conv
      ));
      if (currentConversation?._id === conversationId) {
        setCurrentConversation({ ...currentConversation, title });
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await conversationsAPI.delete(conversationId);
      setConversations(conversations.filter(conv => conv._id !== conversationId));
      
      // If deleting current conversation, select another one
      if (currentConversation?._id === conversationId) {
        const remaining = conversations.filter(conv => conv._id !== conversationId);
        setCurrentConversation(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const getConversationContext = async (limit = 10) => {
    if (!currentConversation) return [];
    
    try {
      const response = await conversationsAPI.getContext(currentConversation._id, limit);
      return response.data.context;
    } catch (error) {
      console.error('Error getting context:', error);
      return [];
    }
  };

  const value = {
    conversations,
    currentConversation,
    loading,
    createConversation,
    startNewChat,
    selectConversation,
    addMessage,
    updateConversationTitle,
    deleteConversation,
    getConversationContext,
    loadConversations,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

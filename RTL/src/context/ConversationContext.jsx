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
  
  // Local messages buffer - stores messages before saving to DB
  const [localMessagesBuffer, setLocalMessagesBuffer] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    } else {
      setConversations([]);
      setCurrentConversation(null);
      setLocalMessagesBuffer([]);
      setHasUnsavedChanges(false);
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('Loading conversations...');
      const response = await conversationsAPI.getAll();
      console.log('Conversations loaded:', response.data.length, 'conversations');
      setConversations(response.data);
      
      // Don't auto-select a conversation - let user start fresh or choose from sidebar
      // This ensures "New Chat" experience on login
      setCurrentConversation(null);
    } catch (error) {
      console.error('Error loading conversations:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
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
      console.log('Creating conversation with title:', title);
      const response = await conversationsAPI.create(title);
      console.log('Conversation created successfully:', response.data);
      const newConv = response.data;
      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      return newConv;
    } catch (error) {
      console.error('Error creating conversation:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  };

  const saveCurrentConversation = async () => {
    if (!isAuthenticated || !hasUnsavedChanges || localMessagesBuffer.length === 0) {
      console.log('Nothing to save');
      return null;
    }

    try {
      console.log('Saving current conversation with', localMessagesBuffer.length, 'messages');
      
      // Generate title from first user message
      const firstUserMessage = localMessagesBuffer.find(msg => msg.role === 'user');
      const title = firstUserMessage 
        ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
        : 'New Chat';

      // Create conversation with all messages
      const response = await conversationsAPI.create(title);
      const newConv = response.data;
      console.log('Conversation created:', newConv._id);

      // Add all messages to the conversation
      for (const msg of localMessagesBuffer) {
        await conversationsAPI.addMessage(newConv._id, msg.role, msg.content, msg.imageUrl);
      }

      // Reload to get updated conversation with all messages
      const updatedConv = await conversationsAPI.getById(newConv._id);
      
      // Add to conversations list
      setConversations([updatedConv.data, ...conversations]);
      
      // Clear buffer
      setLocalMessagesBuffer([]);
      setHasUnsavedChanges(false);
      
      console.log('Conversation saved successfully');
      return updatedConv.data;
    } catch (error) {
      console.error('Error saving conversation:', error);
      console.error('Error details:', error.response?.data);
      return null;
    }
  };

  const startNewChat = async () => {
    // Save current conversation before starting new one
    if (hasUnsavedChanges) {
      console.log('Saving current conversation before starting new chat...');
      await saveCurrentConversation();
    }
    
    // Clear current conversation to show welcome screen
    setCurrentConversation(null);
    setLocalMessagesBuffer([]);
    setHasUnsavedChanges(false);
  };

  const selectConversation = async (conversationId) => {
    try {
      // Save current conversation before switching
      if (hasUnsavedChanges) {
        console.log('Saving current conversation before switching...');
        await saveCurrentConversation();
      }
      
      // Load selected conversation
      const response = await conversationsAPI.getById(conversationId);
      setCurrentConversation(response.data);
      
      // Clear buffer since we're loading saved conversation
      setLocalMessagesBuffer([]);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  const addMessage = (role, content, imageUrl = null) => {
    console.log('Adding message to buffer:', { role, content: content.substring(0, 50), hasImage: !!imageUrl });

    const newMessage = {
      role,
      content,
      imageUrl,
      timestamp: new Date(),
    };

    // Add to local buffer
    setLocalMessagesBuffer(prev => [...prev, newMessage]);
    setHasUnsavedChanges(true);
    
    console.log('Message added to buffer. Total messages:', localMessagesBuffer.length + 1);
    return newMessage;
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

  const getCurrentMessages = () => {
    // If viewing a saved conversation, return its messages
    if (currentConversation && !hasUnsavedChanges) {
      return currentConversation.messages || [];
    }
    // Otherwise return buffer
    return localMessagesBuffer;
  };

  const getConversationContext = (limit = 10) => {
    const messages = getCurrentMessages();
    return messages.slice(-limit);
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
    getCurrentMessages,
    saveCurrentConversation,
    loadConversations,
    hasUnsavedChanges,
    localMessagesBuffer,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

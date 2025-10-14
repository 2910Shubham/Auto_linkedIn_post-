import express from 'express';
import jwt from 'jsonwebtoken';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Get all conversations for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      userId: req.userId,
      isActive: true 
    })
    .sort({ lastMessageAt: -1 })
    .select('title lastMessageAt metadata messages')
    .lean();

    // Add preview of last message
    const conversationsWithPreview = conversations.map(conv => ({
      ...conv,
      lastMessage: conv.messages.length > 0 
        ? conv.messages[conv.messages.length - 1].content.substring(0, 100) 
        : '',
    }));

    res.json(conversationsWithPreview);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get a specific conversation
router.get('/:conversationId', authenticateToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      userId: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Create a new conversation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    const conversation = await Conversation.create({
      userId: req.userId,
      title: title || 'New Conversation',
      messages: [],
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Add a message to a conversation
router.post('/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { role, content, imageUrl } = req.body;

    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      userId: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.messages.push({
      role,
      content,
      imageUrl,
      timestamp: new Date(),
    });

    // Auto-generate title from first user message
    if (conversation.messages.length === 1 && role === 'user') {
      conversation.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
    }

    // Increment posts generated counter if it's an assistant message
    if (role === 'assistant') {
      conversation.metadata.postsGenerated += 1;
    }

    await conversation.save();

    res.json(conversation);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update conversation title
router.patch('/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.conversationId,
        userId: req.userId,
      },
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Delete a conversation (soft delete)
router.delete('/:conversationId', authenticateToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.conversationId,
        userId: req.userId,
      },
      { isActive: false },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Get conversation context (last N messages for AI)
router.get('/:conversationId/context', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      userId: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get last N messages for context
    const contextMessages = conversation.messages.slice(-limit);

    res.json({
      conversationId: conversation._id,
      title: conversation.title,
      context: contextMessages,
    });
  } catch (error) {
    console.error('Error fetching context:', error);
    res.status(500).json({ error: 'Failed to fetch context' });
  }
});

export default router;

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
  },
  messages: [messageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  metadata: {
    totalMessages: {
      type: Number,
      default: 0,
    },
    postsGenerated: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Index for faster queries
conversationSchema.index({ userId: 1, lastMessageAt: -1 });

// Auto-update lastMessageAt when messages are added
conversationSchema.pre('save', function(next) {
  if (this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
    this.metadata.totalMessages = this.messages.length;
  }
  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;

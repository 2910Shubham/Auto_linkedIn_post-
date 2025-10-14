import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  linkedinId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  linkedinPostId: {
    type: String,
  },
  linkedinPostUrl: {
    type: String,
  },
  generatedBy: {
    type: String,
    default: 'gemini',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'failed'],
    default: 'published',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;

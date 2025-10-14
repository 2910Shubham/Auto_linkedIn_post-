import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import LinkedInService from '../services/linkedinService.js';
import Post from '../models/Post.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Create a LinkedIn post
router.post('/create', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;

    if (!content) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    // Initialize LinkedIn service with user's access token
    const linkedinService = new LinkedInService(user.accessToken);

    let linkedinResponse;
    let imageUrl = null;

    // Create post with or without image
    if (req.file) {
      linkedinResponse = await linkedinService.createImagePost(
        content,
        req.file.buffer,
        req.file.originalname
      );
      imageUrl = 'uploaded'; // You can store the actual URL if needed
    } else {
      linkedinResponse = await linkedinService.createTextPost(content);
    }

    // Extract post ID from LinkedIn response
    const linkedinPostId = linkedinResponse.id || linkedinResponse;

    // Save post to database
    const post = await Post.create({
      userId: user._id,
      linkedinId: user.linkedinId,
      content: content,
      imageUrl: imageUrl,
      linkedinPostId: linkedinPostId,
      status: 'published',
      publishedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Post created successfully on LinkedIn',
      post: {
        id: post._id,
        content: post.content,
        linkedinPostId: linkedinPostId,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating LinkedIn post:', error);
    res.status(500).json({
      error: 'Failed to create LinkedIn post',
      details: error.message,
    });
  }
});

// Get user's posts
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      posts: posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      error: 'Failed to fetch posts',
      details: error.message,
    });
  }
});

// Get post by ID
router.get('/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      userId: req.user._id,
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      post: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      details: error.message,
    });
  }
});

// Delete post from database (Note: This doesn't delete from LinkedIn)
router.delete('/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.postId,
      userId: req.user._id,
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      message: 'Post deleted from database',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      error: 'Failed to delete post',
      details: error.message,
    });
  }
});

export default router;

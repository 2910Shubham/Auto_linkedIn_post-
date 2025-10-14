import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Posts API
export const postsAPI = {
  createPost: (content, imageFile) => {
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return api.post('/api/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getMyPosts: () => api.get('/api/posts/my-posts'),
  getPost: (postId) => api.get(`/api/posts/${postId}`),
  deletePost: (postId) => api.delete(`/api/posts/${postId}`),
};

// Conversations API
export const conversationsAPI = {
  getAll: () => api.get('/api/conversations'),
  getById: (conversationId) => api.get(`/api/conversations/${conversationId}`),
  create: (title) => api.post('/api/conversations', { title }),
  addMessage: (conversationId, role, content, imageUrl = null) => 
    api.post(`/api/conversations/${conversationId}/messages`, { role, content, imageUrl }),
  updateTitle: (conversationId, title) => 
    api.patch(`/api/conversations/${conversationId}`, { title }),
  delete: (conversationId) => api.delete(`/api/conversations/${conversationId}`),
  getContext: (conversationId, limit = 10) => 
    api.get(`/api/conversations/${conversationId}/context?limit=${limit}`),
};

export default api;

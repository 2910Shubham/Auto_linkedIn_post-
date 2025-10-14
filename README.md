# RTL - AI-Powered Social Media Manager

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Integration-0077B5)](https://linkedin.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://mongodb.com)

A professional social media management platform leveraging **Google Gemini AI** to generate and automate LinkedIn posts with enterprise-grade capabilities.

## Key Features

- **AI Content Generation** - Powered by Gemini Flash 2.5
- **Advanced Image Analysis** - Context-aware post creation
- **OAuth Integration** - Secure LinkedIn authentication
- **Automated Publishing** - Direct LinkedIn integration
- **Analytics & History** - MongoDB-based tracking
- **Modern Interface** - Responsive Tailwind CSS design

---

## System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄───────►│  Express Backend │◄───────►│  MongoDB Atlas  │
│  (Port 5173)    │         │  (Port 3001)     │         │                 │
│                 │         │                  │         │                 │
└────────┬────────┘         └────────┬─────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│                 │         │                  │
│  Gemini AI API  │         │  LinkedIn API    │
│  (Flash 2.5)    │         │  (OAuth + Posts) │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
```

## Getting Started

### Installation

1. **Start Backend Server**
```bash
cd D:\15OCT\Sever
npm start
```

2. **Start Frontend Server**
```bash
cd D:\15OCT\RTL
npm run dev
```

3. **Access Application**
Navigate to: `http://localhost:5173`

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- LinkedIn Developer credentials
- Gemini API key

## Configuration

### Environment Setup

**Backend** (`D:\15OCT\Sever\.env`):
- MongoDB Atlas connection string
- LinkedIn OAuth credentials
- JWT and session secrets

**Frontend** (`D:\15OCT\RTL\.env`):
- Backend API URL
- Gemini API key

## Usage Guide

1. **Authentication**
   - Use LinkedIn OAuth for secure login
   - Authorize application access

2. **Content Creation**
   - Input post content or project description
   - Upload relevant images (optional)
   - Submit for AI processing

3. **Review and Publication**
   - Review AI-generated content
   - Edit if necessary
   - Publish directly to LinkedIn

4. **Verification**
   - Monitor post status
   - View analytics and engagement

## Technical Stack

### Frontend Technologies
- React 19 with Vite
- Tailwind CSS for styling
- Lucide React Icons
- Axios for HTTP requests
- React Router DOM for navigation

### Backend Technologies
- Node.js with Express.js
- MongoDB with Mongoose ORM
- Passport.js OAuth2 integration
- JWT Authentication
- Multer for file handling

### External Services
- Google Gemini 2.0 Flash API
- LinkedIn REST API v2

## Project Structure

```
D:\15OCT\
│
├── RTL\                          # Frontend Application
│   ├── src\
│   │   ├── components\           # React components
│   │   │   ├── AiInterface.jsx   # Main AI interface
│   │   │   ├── LoginButton.jsx   # LinkedIn login
│   │   │   └── UserProfile.jsx   # User profile display
│   │   ├── context\
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   ├── pages\
│   │   │   └── AuthSuccess.jsx   # OAuth callback page
│   │   ├── utils\
│   │   │   └── api.js            # API client
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
├── Sever\                        # Backend Application
│   ├── config\
│   │   ├── database.js           # MongoDB connection
│   │   └── passport.js           # LinkedIn OAuth config
│   ├── models\
│   │   ├── User.js               # User schema
│   │   └── Post.js               # Post schema
│   ├── routes\
│   │   ├── auth.js               # Authentication routes
│   │   └── posts.js              # Post management routes
│   ├── services\
│   │   └── linkedinService.js    # LinkedIn API integration
│   ├── middleware\
│   │   └── auth.js               # JWT authentication
│   ├── server.js                 # Main server file
│   ├── .env                      # Environment variables
│   └── package.json
│
├── SETUP_GUIDE.md                # Detailed setup instructions
├── LINKEDIN_SETUP.md             # LinkedIn app configuration
├── START_SERVERS.md              # Quick start commands
└── README.md                     # This file
```

---

## Security Implementation

- JWT token-based authentication
- Secure OAuth 2.0 implementation
- Environment-based secret management
- CORS protection mechanisms
- Secure session handling
- Encrypted token storage

## API Reference

### **Authentication**
- `GET /auth/linkedin` - Initiate LinkedIn OAuth
- `GET /auth/linkedin/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### **Posts**
- `POST /api/posts/create` - Create LinkedIn post
- `GET /api/posts/my-posts` - Get user's posts
- `GET /api/posts/:postId` - Get specific post
- `DELETE /api/posts/:postId` - Delete post

---

## 🗄️ Database Schema

### **Users Collection**
```javascript
{
  linkedinId: String,
  email: String,
  firstName: String,
  lastName: String,
  profilePicture: String,
  accessToken: String,
  linkedinProfile: Object,
  createdAt: Date
}
```

### **Posts Collection**
```javascript
{
  userId: ObjectId,
  content: String,
  imageUrl: String,
  linkedinPostId: String,
  status: String,
  publishedAt: Date
}
```

---

## Troubleshooting Guide

### Backend Issues
- Verify MongoDB connection string
- Ensure port 3001 is available
- Execute `npm install` in Server directory

### Frontend Issues
- Confirm port 5173 availability
- Run `npm install` in RTL directory
- Validate .env configuration

### OAuth Integration
- Verify LinkedIn redirect URLs
- Validate OAuth credentials
- Consult LINKEDIN_SETUP.md

### Post Publication
- Confirm authentication status
- Verify API scope permissions
- Check server logs

## Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions
- **[LinkedIn Setup](LINKEDIN_SETUP.md)** - LinkedIn app configuration
- **[Quick Start](START_SERVERS.md)** - Fast startup commands

---

## 🚀 Deployment

### **Before Production:**
1. Update environment variables
2. Configure production MongoDB
3. Set up HTTPS
4. Update LinkedIn redirect URLs
5. Enable rate limiting
6. Set up monitoring

---

## Development Roadmap

- [ ] Multi-platform integration (Twitter, Facebook)
- [ ] Advanced post scheduling
- [ ] Analytics dashboard
- [ ] Team collaboration features
- [ ] Content calendar management
- [ ] A/B testing capabilities
- [ ] Engagement metrics tracking

## Contributing

This is a private project. Please contact the development team for any questions or issues.

## License

Proprietary - All rights reserved

## Support

Technical Support Process:
1. Review documentation
2. Check system logs
3. Verify configurations
4. Validate LinkedIn settings

---

**Built with React, Node.js, MongoDB, and Google Gemini AI**

## Deployment Checklist

Verify the following functionality:
- LinkedIn authentication
- User profile access
- AI content generation
- Image processing
- LinkedIn post integration
- Analytics tracking

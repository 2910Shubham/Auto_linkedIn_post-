# 🚀 RTL - AI-Powered Social Media Manager

An intelligent social media management platform that uses **Google Gemini AI** to generate professional LinkedIn posts with automatic posting capabilities.

---

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Gemini Flash 2.5 creates engaging posts
- 📸 **Image Analysis** - Upload images for context-aware post creation
- 🔐 **LinkedIn OAuth** - Secure authentication with LinkedIn
- 📤 **Auto-Posting** - Directly post to LinkedIn from the app
- 💾 **Post History** - Track all your posts in MongoDB
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS

---

## 🏗️ Architecture

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

---

## 🚀 Quick Start

### **1. Start Backend Server**
```bash
cd D:\15OCT\Sever
npm start
```

### **2. Start Frontend Server**
```bash
cd D:\15OCT\RTL
npm run dev
```

### **3. Open Browser**
Navigate to: `http://localhost:5173`

---

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (already configured)
- LinkedIn Developer App (credentials provided)
- Gemini API key (already configured)

---

## 🔧 Configuration

### **Backend Environment Variables**
Located in `D:\15OCT\Sever\.env`:
- MongoDB Atlas connection
- LinkedIn OAuth credentials
- JWT and session secrets

### **Frontend Environment Variables**
Located in `D:\15OCT\RTL\.env`:
- Backend API URL
- Gemini API key

---

## 📖 How to Use

### **Step 1: Login**
Click "Login with LinkedIn" and authorize the app

### **Step 2: Create Content**
- Type your post idea or project description
- Optionally upload an image for context
- Press Enter or click Send

### **Step 3: Review & Post**
- Gemini generates a professional post
- Review the content
- Click "Post to LinkedIn" to publish

### **Step 4: Verify**
Check your LinkedIn profile - your post is live! 🎉

---

## 🛠️ Tech Stack

### **Frontend**
- React 19
- Vite
- Tailwind CSS
- Lucide React Icons
- Axios
- React Router DOM

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js (LinkedIn OAuth2)
- JWT Authentication
- Multer (File Uploads)

### **AI & APIs**
- Google Gemini 2.0 Flash
- LinkedIn REST API v2

---

## 📁 Project Structure

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

## 🔐 Security

- ✅ JWT token-based authentication
- ✅ Secure OAuth 2.0 flow
- ✅ Environment variables for secrets
- ✅ CORS protection
- ✅ Session management
- ✅ Encrypted token storage

---

## 🎯 API Endpoints

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

## 🐛 Troubleshooting

### **Backend won't start**
- Check MongoDB connection string
- Verify port 3001 is available
- Run `npm install` in Sever folder

### **Frontend won't start**
- Verify port 5173 is available
- Run `npm install` in RTL folder
- Check .env file exists

### **LinkedIn OAuth fails**
- Verify redirect URL in LinkedIn app
- Check credentials in .env
- See LINKEDIN_SETUP.md for details

### **Posts not appearing on LinkedIn**
- Verify user is authenticated
- Check LinkedIn API scopes
- Review backend logs

---

## 📚 Documentation

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

## 📊 Features Roadmap

- [ ] Multi-platform support (Twitter, Facebook)
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] Team collaboration
- [ ] Content calendar
- [ ] A/B testing
- [ ] Engagement tracking

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

## 📄 License

Proprietary - All rights reserved

---

## 👨‍💻 Support

For technical support:
1. Check documentation files
2. Review backend logs
3. Verify configuration
4. Check LinkedIn app settings

---

**Built with 💜 using React, Node.js, MongoDB, and Google Gemini AI**

---

## 🎉 Success Checklist

After setup, you should be able to:
- ✅ Login with LinkedIn
- ✅ See your profile in the app
- ✅ Generate posts with Gemini AI
- ✅ Upload images for context
- ✅ Post directly to LinkedIn
- ✅ View post history

**Enjoy creating amazing content! 🚀**

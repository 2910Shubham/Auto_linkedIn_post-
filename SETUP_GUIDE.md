# RTL Social Media Manager - Complete Setup Guide

## 🎯 Project Overview

RTL is an AI-powered social media manager that:
- Uses **Gemini Flash 2.5** to generate professional social media posts
- Supports **image uploads** for context-aware post creation
- Integrates with **LinkedIn OAuth** for seamless authentication
- **Automatically posts** to LinkedIn on behalf of users
- Stores users and posts in **MongoDB Atlas**

---

## 📁 Project Structure

```
D:\15OCT\
├── RTL\                    # Frontend (React + Vite + Tailwind)
│   ├── src\
│   │   ├── components\     # UI components
│   │   ├── context\        # Auth context
│   │   ├── pages\          # Route pages
│   │   ├── utils\          # API utilities
│   │   └── App.jsx
│   └── .env
│
└── Sever\                  # Backend (Node.js + Express)
    ├── config\             # Database & Passport config
    ├── models\             # MongoDB models
    ├── routes\             # API routes
    ├── services\           # LinkedIn API service
    ├── middleware\         # Auth middleware
    ├── server.js
    └── .env
```

---

## 🚀 Setup Instructions

### **Step 1: Start the Backend**

```bash
cd D:\15OCT\Sever
npm start
```

The backend will run on `http://localhost:3001`

You should see:
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Server running on http://localhost:3001
📱 Frontend URL: http://localhost:5173
🔐 LinkedIn OAuth configured
```

### **Step 2: Start the Frontend**

Open a new terminal:

```bash
cd D:\15OCT\RTL
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🔐 LinkedIn App Configuration

### **IMPORTANT: Update LinkedIn App Settings**

Go to your LinkedIn Developer App: https://www.linkedin.com/developers/apps

1. **Authorized Redirect URLs**:
   - Add: `http://localhost:3001/auth/linkedin/callback`

2. **Required Products**:
   - Request access to: **"Sign In with LinkedIn using OpenID Connect"**
   - Request access to: **"Share on LinkedIn"**

3. **OAuth 2.0 Scopes** (should include):
   - `openid`
   - `profile`
   - `email`
   - `w_member_social`

---

## 📝 How It Works

### **User Flow:**

1. **User visits app** → Sees "Login with LinkedIn" button
2. **Clicks login** → Redirected to LinkedIn OAuth
3. **Authorizes app** → LinkedIn redirects back with auth code
4. **Backend processes** → Creates/updates user in MongoDB
5. **JWT token generated** → Sent to frontend
6. **User authenticated** → Can now use all features

### **Post Creation Flow:**

1. **User enters text/uploads image** → Describes what they want to post about
2. **Gemini generates post** → Creates professional social media content
3. **User reviews post** → Sees generated content with hashtags
4. **Clicks "Post to LinkedIn"** → Backend receives request
5. **Backend authenticates user** → Verifies JWT token
6. **LinkedIn API called** → Post created on user's LinkedIn
7. **Post saved to DB** → Stored for history/analytics

---

## 🧪 Testing the Application

### **1. Test Authentication:**
- Click "Login with LinkedIn"
- Authorize the app
- You should be redirected back and see your profile

### **2. Test Post Generation:**
- Type: "I just launched a new AI project"
- Press Enter or click Send
- Gemini generates a professional post

### **3. Test Image Upload:**
- Click the image icon
- Select an image
- Add description or leave blank
- Gemini creates a post based on the image

### **4. Test LinkedIn Posting:**
- After generating a post, click "Post to LinkedIn"
- Check your LinkedIn profile - the post should appear!

---

## 🔧 API Endpoints

### **Authentication:**
- `GET /auth/linkedin` - Start LinkedIn OAuth
- `GET /auth/linkedin/callback` - OAuth callback
- `GET /auth/me` - Get current user (requires token)
- `POST /auth/logout` - Logout

### **Posts:**
- `POST /api/posts/create` - Create LinkedIn post
- `GET /api/posts/my-posts` - Get user's posts
- `GET /api/posts/:postId` - Get specific post
- `DELETE /api/posts/:postId` - Delete post

---

## 🗄️ Database Schema

### **User Collection:**
```javascript
{
  linkedinId: String,
  email: String,
  firstName: String,
  lastName: String,
  profilePicture: String,
  accessToken: String (encrypted),
  refreshToken: String,
  linkedinProfile: Object,
  createdAt: Date,
  lastLogin: Date
}
```

### **Post Collection:**
```javascript
{
  userId: ObjectId (ref: User),
  linkedinId: String,
  content: String,
  imageUrl: String,
  linkedinPostId: String,
  status: String (draft/published/failed),
  createdAt: Date,
  publishedAt: Date
}
```

---

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ LinkedIn access tokens stored securely in MongoDB
- ✅ CORS enabled for frontend origin only
- ✅ Environment variables for sensitive data
- ✅ Session-based OAuth flow
- ✅ Token expiry and refresh handling

---

## 🐛 Troubleshooting

### **MongoDB Connection Error:**
- Check internet connection
- Verify MongoDB Atlas credentials in `.env`
- Ensure IP whitelist includes your IP

### **LinkedIn OAuth Error:**
- Verify redirect URL matches exactly
- Check LinkedIn app credentials
- Ensure required scopes are approved

### **Post Creation Fails:**
- Check if user is authenticated
- Verify LinkedIn access token is valid
- Check backend logs for detailed error

### **Gemini API Error:**
- Verify API key in frontend `.env`
- Check API quota/limits
- Ensure model name is correct

---

## 📊 Environment Variables

### **Backend (.env):**
```env
PORT=3001
MONGODB_URI=mongodb+srv://...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
LINKEDIN_CALLBACK_URL=http://localhost:3001/auth/linkedin/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=...
JWT_SECRET=...
```

### **Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_KEY=...
```

---

## 🎨 Features

- ✅ LinkedIn OAuth authentication
- ✅ AI-powered post generation with Gemini
- ✅ Image upload and analysis
- ✅ Direct LinkedIn posting
- ✅ Post history tracking
- ✅ User profile management
- ✅ Responsive modern UI
- ✅ Real-time loading states

---

## 📱 Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Lucide Icons
- Axios
- React Router

**Backend:**
- Node.js
- Express
- MongoDB + Mongoose
- Passport.js (LinkedIn OAuth)
- JWT
- Multer (file uploads)

**AI:**
- Google Gemini 2.0 Flash

**Database:**
- MongoDB Atlas

---

## 🚀 Production Deployment

### **Before deploying:**

1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Update CORS origins
4. Update LinkedIn redirect URLs
5. Use HTTPS for all endpoints
6. Enable secure cookies
7. Set up proper logging
8. Configure rate limiting

---

## 📞 Support

If you encounter any issues:
1. Check the backend logs
2. Check browser console
3. Verify all environment variables
4. Ensure LinkedIn app is properly configured
5. Check MongoDB connection

---

**Built with 💜 by RTL Team**

# Quick Start Commands

## Start Both Servers

### Terminal 1 - Backend:
```bash
cd D:\15OCT\Sever
npm start
```

### Terminal 2 - Frontend:
```bash
cd D:\15OCT\RTL
npm run dev
```

---

## What to Expect

### Backend (Terminal 1):
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Server running on http://localhost:3001
📱 Frontend URL: http://localhost:5173
🔐 LinkedIn OAuth configured
```

### Frontend (Terminal 2):
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Access the App

Open your browser and go to:
**http://localhost:5173**

---

## First Time Setup Checklist

- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 5173
- [ ] MongoDB connection successful
- [ ] LinkedIn app redirect URL configured: `http://localhost:3001/auth/linkedin/callback`
- [ ] LinkedIn app has required scopes: `openid`, `profile`, `email`, `w_member_social`

---

## Test the Flow

1. Click "Login with LinkedIn"
2. Authorize the app
3. Type a post idea or upload an image
4. Let Gemini generate the post
5. Click "Post to LinkedIn"
6. Check your LinkedIn profile!

---

## Stop Servers

Press `Ctrl + C` in each terminal window

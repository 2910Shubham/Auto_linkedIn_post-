# RTL Social Media Manager - Backend

Backend API for RTL Social Media Manager with LinkedIn OAuth integration and automated post creation.

## Features

- ✅ LinkedIn OAuth 2.0 Authentication
- ✅ MongoDB User Management
- ✅ JWT Token-based Authorization
- ✅ Automated LinkedIn Post Creation
- ✅ Image Upload Support
- ✅ Post History Tracking

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The `.env` file is already configured with your credentials:
- MongoDB Atlas connection
- LinkedIn OAuth credentials
- Session and JWT secrets

### 3. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `GET /auth/linkedin` - Initiate LinkedIn OAuth login
- `GET /auth/linkedin/callback` - LinkedIn OAuth callback
- `GET /auth/me` - Get current user (requires JWT token)
- `POST /auth/logout` - Logout user

### Posts

- `POST /api/posts/create` - Create LinkedIn post (with optional image)
- `GET /api/posts/my-posts` - Get user's post history
- `GET /api/posts/:postId` - Get specific post
- `DELETE /api/posts/:postId` - Delete post from database

## Authentication Flow

1. User clicks "Login with LinkedIn" in frontend
2. User is redirected to LinkedIn OAuth
3. After authorization, LinkedIn redirects to callback URL
4. Backend creates/updates user in MongoDB
5. JWT token is generated and sent to frontend
6. Frontend stores token and uses it for authenticated requests

## Creating Posts

### Text Post
```javascript
POST /api/posts/create
Headers: Authorization: Bearer <JWT_TOKEN>
Body: {
  "content": "Your post content here"
}
```

### Post with Image
```javascript
POST /api/posts/create
Headers: Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
Body: {
  "content": "Your post content here",
  "image": <file>
}
```

## Database Schema

### User Model
- linkedinId
- email
- firstName, lastName
- profilePicture
- accessToken (encrypted)
- linkedinProfile

### Post Model
- userId (reference to User)
- content
- imageUrl
- linkedinPostId
- status (draft/published/failed)
- timestamps

## Security

- JWT tokens for API authentication
- LinkedIn access tokens stored securely
- CORS enabled for frontend origin only
- Session-based OAuth flow
- Environment variables for sensitive data

## LinkedIn API Permissions Required

Your LinkedIn app needs these scopes:
- `openid` - Basic profile access
- `profile` - Read profile data
- `email` - Access email address
- `w_member_social` - Create posts on behalf of user

## Notes

- Access tokens are stored in MongoDB for automated posting
- Posts are tracked in database for history
- Image uploads limited to 5MB
- Supports common image formats (JPEG, PNG, GIF, etc.)

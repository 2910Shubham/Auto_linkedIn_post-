# 💬 Conversation & Context Window Feature

## Overview
The RTL Social Media Manager now includes a powerful conversation system that maintains context across multiple interactions, similar to ChatGPT and other AI chatbots.

---

## ✨ Key Features

### **1. Multiple Conversations**
- Create unlimited conversation threads
- Each conversation maintains its own history
- Switch between conversations seamlessly
- Conversations are saved in MongoDB

### **2. Context Awareness**
- AI remembers previous messages in the conversation
- Can reference and edit previously generated posts
- Understands conversation flow and context
- Last 5-10 messages used as context for AI

### **3. Conversation Management**
- **Create**: Start new conversations
- **Rename**: Edit conversation titles
- **Delete**: Remove conversations (soft delete)
- **Switch**: Move between different conversations
- **Auto-title**: First message becomes conversation title

### **4. Message History**
- View all messages in a conversation
- User messages displayed on the right (blue)
- AI responses displayed on the left (gray)
- Timestamps for each message
- Image attachments shown inline

---

## 🎯 User Workflows

### **Workflow 1: Create and Refine Posts**
```
User: "Create a post about my new AI project"
AI: [Generates professional post]

User: "Make it shorter"
AI: [Generates shorter version, remembering the original]

User: "Add more technical details"
AI: [Updates with technical details, maintaining context]

User: Ready to Post? → Post to LinkedIn
```

### **Workflow 2: Edit Previous Posts**
```
[User switches to older conversation]

User: "Edit the post about the AI project to mention React"
AI: [Finds the previous post in context and updates it]

User: "Also add hashtags for web development"
AI: [Updates the post with new hashtags]
```

### **Workflow 3: Multiple Projects**
```
Conversation 1: "Marketing Campaign Ideas"
Conversation 2: "Product Launch Posts"
Conversation 3: "Personal Brand Building"

[User can switch between these and maintain separate contexts]
```

---

## 🏗️ Technical Architecture

### **Backend Components**

#### **1. Conversation Model** (`models/Conversation.js`)
```javascript
{
  userId: ObjectId,
  title: String,
  messages: [
    {
      role: 'user' | 'assistant',
      content: String,
      imageUrl: String,
      timestamp: Date
    }
  ],
  lastMessageAt: Date,
  isActive: Boolean,
  metadata: {
    totalMessages: Number,
    postsGenerated: Number
  }
}
```

#### **2. Conversation API** (`routes/conversations.js`)
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:id` - Get specific conversation
- `POST /api/conversations` - Create new conversation
- `POST /api/conversations/:id/messages` - Add message
- `PATCH /api/conversations/:id` - Update title
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/:id/context` - Get context for AI

### **Frontend Components**

#### **1. ConversationContext** (`context/ConversationContext.jsx`)
Global state management for conversations:
- `conversations` - List of all conversations
- `currentConversation` - Active conversation
- `createConversation()` - Create new
- `selectConversation()` - Switch conversation
- `addMessage()` - Add message to conversation
- `getConversationContext()` - Get context for AI

#### **2. ConversationSidebar** (`components/ConversationSidebar.jsx`)
Sidebar UI showing:
- List of all conversations
- "New Chat" button
- Conversation titles (editable)
- Last message preview
- Message count and timestamp
- Delete button per conversation
- Mobile-responsive with overlay

#### **3. Updated AiInterface** (`components/AiInterface.jsx`)
Enhanced with:
- Conversation history display
- Context-aware AI responses
- Message saving to database
- Auto-loading previous messages
- Reference to previous posts

---

## 🎨 UI/UX Features

### **Sidebar**
- **Desktop**: Always visible on the left
- **Mobile**: Hamburger menu to toggle
- **Hover effects**: Edit and delete buttons appear
- **Active state**: Highlighted current conversation
- **Empty state**: Friendly message when no conversations

### **Chat History**
- **User messages**: Right-aligned, blue background
- **AI messages**: Left-aligned, gray background
- **Images**: Displayed inline with messages
- **Timestamps**: Show time of each message
- **Auto-scroll**: Scrolls to latest message
- **Max height**: Scrollable area to prevent overflow

### **Input Area**
- Same as before, but now saves to conversation
- Context automatically included in AI prompts

---

## 💡 Example Use Cases

### **Use Case 1: Iterative Post Creation**
```
Conversation: "Product Launch Post"

Message 1:
User: "Create a post announcing our new SaaS product"
AI: [Generates initial post]

Message 2:
User: "Make it more exciting and add a call-to-action"
AI: [Updates post with excitement and CTA]

Message 3:
User: "Change the tone to be more professional"
AI: [Adjusts tone while keeping the content]

Message 4:
User: Ready to Post? → Posts to LinkedIn
```

### **Use Case 2: Managing Multiple Campaigns**
```
Sidebar shows:
1. "Q1 Marketing Campaign" (15 messages)
2. "Product Updates" (8 messages)
3. "Personal Branding" (23 messages)
4. "Event Announcements" (5 messages)

User switches between them as needed.
```

### **Use Case 3: Editing Old Posts**
```
User selects old conversation: "Conference Recap"

User: "Update the conference post to include the award we won"
AI: [Finds the conference post in history and adds award info]

User: "Also mention the keynote speaker"
AI: [Updates with speaker info, maintaining context]
```

---

## 🔄 Context Flow

### **How Context Works**

1. **User sends message** → Saved to conversation
2. **System fetches context** → Last 5-10 messages
3. **Context sent to AI** → As part of prompt
4. **AI generates response** → With full context awareness
5. **Response saved** → Added to conversation
6. **UI updates** → Shows new message

### **Context Format for AI**
```
System Prompt: [Social media manager instructions]

Previous conversation:
user: Create a post about my project
assistant: [Generated post]
user: Make it shorter
assistant: [Shorter version]

User request: Add more hashtags
```

---

## 📊 Database Schema

### **Conversations Collection**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  title: "Product Launch Post",
  messages: [
    {
      role: "user",
      content: "Create a post about...",
      imageUrl: null,
      timestamp: ISODate("2025-01-14T...")
    },
    {
      role: "assistant",
      content: "🚀 Excited to announce...",
      imageUrl: null,
      timestamp: ISODate("2025-01-14T...")
    }
  ],
  lastMessageAt: ISODate("2025-01-14T..."),
  isActive: true,
  metadata: {
    totalMessages: 6,
    postsGenerated: 3
  },
  createdAt: ISODate("2025-01-14T..."),
  updatedAt: ISODate("2025-01-14T...")
}
```

---

## 🚀 How to Use

### **Starting a New Conversation**
1. Click "New Chat" button in sidebar
2. Type your first message
3. AI responds and conversation is created
4. Title is auto-generated from first message

### **Switching Conversations**
1. Click on any conversation in the sidebar
2. Chat history loads automatically
3. Continue where you left off
4. Context is maintained

### **Editing Conversation Title**
1. Hover over conversation in sidebar
2. Click edit icon (pencil)
3. Type new title
4. Press Enter or click checkmark

### **Deleting a Conversation**
1. Hover over conversation in sidebar
2. Click delete icon (trash)
3. Confirm deletion
4. Conversation is soft-deleted (not permanently removed)

### **Using Context for Edits**
1. Select conversation with previous post
2. Type: "Edit the previous post to..."
3. AI finds the post in context and updates it
4. New version is generated

---

## 🎯 Benefits

### **For Users**
- ✅ Never lose conversation history
- ✅ Organize posts by project/campaign
- ✅ Easily reference and edit old posts
- ✅ Maintain context across sessions
- ✅ Switch between multiple projects

### **For AI**
- ✅ Better understanding of user intent
- ✅ Can reference previous messages
- ✅ More accurate refinements
- ✅ Consistent tone across iterations
- ✅ Smarter suggestions

### **For Workflow**
- ✅ Faster post creation
- ✅ Less repetition
- ✅ Better organization
- ✅ Improved collaboration
- ✅ Historical reference

---

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Search within conversations
- [ ] Export conversation as PDF/Markdown
- [ ] Share conversations with team members
- [ ] Conversation templates
- [ ] Pin important conversations
- [ ] Archive old conversations
- [ ] Conversation tags/labels
- [ ] Bulk operations (delete multiple)
- [ ] Conversation analytics
- [ ] Voice input for messages

### **Advanced Context Features**
- [ ] Semantic search across all conversations
- [ ] AI suggests related past posts
- [ ] Auto-categorize conversations
- [ ] Smart context selection (most relevant messages)
- [ ] Cross-conversation references
- [ ] Conversation summaries

---

## 🧪 Testing the Feature

### **Test Scenario 1: Basic Flow**
```bash
1. Login to the app
2. Click "New Chat"
3. Type: "Create a post about AI"
4. See AI response
5. Type: "Make it shorter"
6. See updated response with context
7. Check sidebar shows conversation
```

### **Test Scenario 2: Multiple Conversations**
```bash
1. Create conversation "Project A"
2. Generate a post
3. Click "New Chat"
4. Create conversation "Project B"
5. Generate different post
6. Switch back to "Project A"
7. Verify context is maintained
8. Ask AI to edit the Project A post
```

### **Test Scenario 3: Persistence**
```bash
1. Create conversation and add messages
2. Logout
3. Login again
4. Verify conversation is still there
5. Verify messages are intact
6. Continue conversation
```

---

## 🎊 Success!

Your RTL Social Media Manager now has a full-featured conversation system with context awareness! Users can:
- ✅ Create multiple conversation threads
- ✅ Switch between conversations
- ✅ Maintain context across messages
- ✅ Edit previous posts using context
- ✅ Organize posts by project
- ✅ Never lose conversation history

**Enjoy the enhanced workflow! 🚀**

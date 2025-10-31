import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImagePlus, Send, Loader2, X, Share2, Sparkles, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useConversation } from "../context/ConversationContext";
import { postsAPI } from "../utils/api";
import PromptSuggestions from "./PromptSuggestions";
import { useSettings } from '../hooks/useSettings';

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [refineInput, setRefineInput] = useState("");
  const [selectedPostForPublish, setSelectedPostForPublish] = useState(null);
  const [selectedImageForPost, setSelectedImageForPost] = useState(null); // Track image for posting
  const [dialogImagePreview, setDialogImagePreview] = useState(null); // Separate preview for dialog
  
  // Local messages for non-authenticated users
  const [localMessages, setLocalMessages] = useState([]);
  
  const fileInputRef = useRef(null);
  const dialogFileInputRef = useRef(null); // Separate ref for dialog
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  const { isAuthenticated, user } = useAuth();
  const { 
    currentConversation, 
    addMessage, 
    getConversationContext, 
    getCurrentMessages
  } = useConversation();

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const { settings } = useSettings();
  const isLight = settings?.theme === 'light';

  const lengthMap = {
    short: 'Keep total length 80-120 words',
    medium: 'Keep total length 150-250 words',
    long: 'Keep total length 300-450 words',
  };
  const getLengthInstruction = () => lengthMap[settings?.responseLength] || lengthMap.medium;

  // Get messages from context (handles both buffer and saved conversations)
  const messages = isAuthenticated 
    ? getCurrentMessages() 
    : localMessages;

  // Clear local messages when conversation changes (for authenticated users)
  useEffect(() => {
    if (isAuthenticated && currentConversation) {
      setLocalMessages([]);
    }
  }, [currentConversation, isAuthenticated]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDialogImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageForPost(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDialogImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeDialogImage = () => {
    setSelectedImageForPost(null);
    setDialogImagePreview(null);
    if (dialogFileInputRef.current) {
      dialogFileInputRef.current.value = "";
    }
  };

  const fileToGenerativePart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const formatAIResponse = (text) => {
    // Remove markdown bold markers
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Split into paragraphs
    const paragraphs = formatted.split('\n\n');
    
    return paragraphs.map((para, index) => {
      // Check if it's a hashtag line
      if (para.trim().startsWith('#')) {
        return (
          <div key={index} className="text-indigo-400 text-sm mt-3">
            {para.trim()}
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-2 last:mb-0">
          {para.trim()}
        </p>
      );
    });
  };

  const handleSubmit = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = input.trim() || "[Image uploaded]";
    setLoading(true);

    try {
      // Add user message
      const userMsg = {
        role: 'user',
        content: userMessage,
        imageUrl: imagePreview,
        timestamp: new Date()
      };

      if (isAuthenticated) {
        // Add to buffer (will be saved when user clicks New Chat or switches conversation)
        addMessage('user', userMessage, imagePreview);
      } else {
        // Save to local state if not authenticated
        setLocalMessages(prev => [...prev, userMsg]);
      }

      // Get conversation context for AI
      const context = isAuthenticated 
        ? getConversationContext(5) 
        : localMessages.slice(-5); // Use last 5 local messages as context
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const systemPrompt = `You are an expert LinkedIn content strategist and professional copywriter.

🎯 YOUR TASK:
Generate ONE polished, publish-ready LinkedIn post. Do NOT provide multiple options or ask questions.

📝 STRUCTURE:
1. Hook: Start with a compelling question, insight, or statement
2. Story/Context: Share the main idea with personal perspective
3. Value: Provide actionable insight or key takeaway
4. Engagement: End with a thought-provoking question or reflection

✍️ WRITING STYLE:
- Write in first person ("I" or "we")
- Use short paragraphs (2-3 lines max)
- Natural, conversational tone - like a human thought leader
- Professional but approachable
- NO markdown formatting (no ** or __ or ###)
- NO phrases like "Here are options" or "Let me know which one"
- NO meta-commentary about the post itself

🎨 FORMAT:
- Use line breaks for readability
- Add 3-5 relevant hashtags at the end
- ${getLengthInstruction()}

📸 IF IMAGE PROVIDED:
- Reference it naturally (e.g., "In this visualization..." or "This diagram shows...")
- Don't explicitly say "(Image: ...)" - that's metadata, not post content

🚫 AVOID:
- Overly enthusiastic language
- Robotic or template-like phrasing
- Multiple post options
- Asking user to choose

OUTPUT FORMAT:
[Post content with natural line breaks]

[Hashtags]`;

      // Build context string
      let contextString = '';
      if (context.length > 0) {
        contextString = '\n\nPrevious conversation:\n' + 
          context.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      }

      let result;

      if (selectedImage) {
        const imagePart = await fileToGenerativePart(selectedImage);
        const prompt = `${systemPrompt}${contextString}\n\nUser request: ${input}`;
        result = await model.generateContent([prompt, imagePart]);
      } else {
        const prompt = `${systemPrompt}${contextString}\n\nUser request: ${input}`;
        result = await model.generateContent(prompt);
      }

      const text = result.response.text();
      
      // Store the image for posting later
      if (selectedImage) {
        setSelectedImageForPost(selectedImage);
      }
      
      // Add AI response
      const aiMsg = {
        role: 'assistant',
        content: text,
        timestamp: new Date()
      };

      if (isAuthenticated) {
        // Add to buffer
        addMessage('assistant', text);
      } else {
        // Save to local state if not authenticated
        setLocalMessages(prev => [...prev, aiMsg]);
      }
      
      setInput("");
      // Don't remove image yet - keep it for posting
      // removeImage();
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMsg = {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date()
      };
      
      if (isAuthenticated) {
        addMessage('assistant', errorMsg.content);
      } else {
        setLocalMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostToLinkedIn = (postContent) => {
    setSelectedPostForPublish(postContent);
    // Set dialog preview to current image if available
    if (selectedImageForPost && imagePreview) {
      setDialogImagePreview(imagePreview);
    }
    setShowConfirmDialog(true);
  };

  const extractPostContent = (aiResponse) => {
    // Remove any meta-commentary or instructions from AI response
    // Extract just the post content
    let content = aiResponse;
    
    // Remove common AI meta-phrases
    content = content.replace(/Here's a LinkedIn post.*?:/gi, '');
    content = content.replace(/Here are.*?options.*?:/gi, '');
    content = content.replace(/Let me know.*?prefer/gi, '');
    content = content.replace(/\(Image:.*?\)/g, ''); // Remove image references like (Image: ...)
    
    return content.trim();
  };

  const handleConfirmPost = async () => {
    if (!selectedPostForPublish || !isAuthenticated) return;

    setPosting(true);
    
    try {
      // Extract clean post content and upload with image if available
      const cleanContent = extractPostContent(selectedPostForPublish);
      
      // Upload image if available (image upload implementation can be added here)
      if (selectedImageForPost) {
        const formData = new FormData();
        formData.append('image', selectedImageForPost);
        // You'll need to implement image upload endpoint
        // For now, we'll pass the image file directly to postsAPI.createPost
      }
      
      await postsAPI.createPost(cleanContent, selectedImageForPost);
      
      const successMsg = {
        role: 'assistant',
        content: '✅ Successfully posted to LinkedIn!',
        timestamp: new Date()
      };
      
      if (isAuthenticated) {
        addMessage('assistant', successMsg.content);
      } else {
        setLocalMessages(prev => [...prev, successMsg]);
      }
      
      // Close dialog after successful post
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      
      const errorMsg = {
        role: 'assistant',
        content: '❌ Failed to post to LinkedIn. Please try again.',
        timestamp: new Date()
      };
      
      if (isAuthenticated) {
        addMessage('assistant', errorMsg.content);
      } else {
        setLocalMessages(prev => [...prev, errorMsg]);
      }
      
      // Close dialog even on error
      setShowConfirmDialog(false);
    } finally {
      setPosting(false);
      setSelectedPostForPublish(null);
      setSelectedImageForPost(null);
      setDialogImagePreview(null);
      removeImage(); // Now remove the image after posting
    }
  };

  const handleRefine = async () => {
    if (!refineInput.trim()) return;

    setLoading(true);
    setShowConfirmDialog(false);

    try {
      // Add user refinement request
      const userMsg = {
        role: 'user',
        content: refineInput,
        timestamp: new Date()
      };
      
      if (isAuthenticated) {
        addMessage('user', refineInput);
      } else {
        setLocalMessages(prev => [...prev, userMsg]);
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      // Include image context if available
  let prompt = `You are refining a LinkedIn post based on user feedback.

Current post:
${selectedPostForPublish}

User feedback: ${refineInput}

${selectedImageForPost ? 'Note: This post includes an image. Keep your refinement relevant to the visual context.' : ''}

Provide ONLY the refined post content - no meta-commentary, no options, just the improved post ready to publish. ${getLengthInstruction()}`;

      let result;
      if (selectedImageForPost) {
        // Include image in refinement context
        const imagePart = await fileToGenerativePart(selectedImageForPost);
        result = await model.generateContent([prompt, imagePart]);
      } else {
        result = await model.generateContent(prompt);
      }
      const text = result.response.text();
      
      // Add AI refined response
      const aiMsg = {
        role: 'assistant',
        content: text,
        timestamp: new Date()
      };
      
      if (isAuthenticated) {
        addMessage('assistant', text);
      } else {
        setLocalMessages(prev => [...prev, aiMsg]);
      }
      
      setRefineInput("");
      setSelectedPostForPublish(text);
    } catch (error) {
      console.error("Error refining content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Check if there are any messages
  const hasMessages = messages.length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Welcome Screen - Show only when no messages */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-32">
          <div className="animate-fadeIn space-y-6">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles size={32} className="text-indigo-400" />
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-bold">
              Welcome to <span className="text-indigo-400">RTL</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Your AI-powered social media manager. Create professional LinkedIn posts with context-aware conversations.
            </p>
            {!isAuthenticated && (
              <p className="text-yellow-400/80 text-sm">
                💡 Login with LinkedIn to post directly to your profile
              </p>
            )}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {hasMessages && (
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-indigo-100/70' : 'bg-indigo-500/20'} flex items-center justify-center flex-shrink-0`}>
                  <Sparkles size={16} className={isLight ? 'text-indigo-600' : 'text-indigo-400'} />
                </div>
              )}
              
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white'
                      : (isLight ? 'bg-gray-100 text-zinc-900 border border-zinc-200' : 'bg-zinc-800/80 text-zinc-100 border border-zinc-700/50')
                  }`}
                >
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded"
                      className="max-w-sm rounded-lg mb-3"
                    />
                  )}
                  <div className="text-sm leading-relaxed">
                    {msg.role === 'assistant' ? formatAIResponse(msg.content) : msg.content}
                  </div>
                </div>
                
                {/* Post to LinkedIn button for assistant messages */}
                {msg.role === 'assistant' && isAuthenticated && !msg.content.includes('✅') && !msg.content.includes('❌') && (
                  <button
                    onClick={() => handlePostToLinkedIn(msg.content)}
                    disabled={posting}
                    className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <Share2 size={12} />
                    Post to LinkedIn
                  </button>
                )}
                
                <span className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mt-1`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {msg.role === 'user' && user && (
                <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-zinc-200' : 'bg-zinc-700'} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={16} className={isLight ? 'text-zinc-600' : 'text-zinc-400'} />
                  )}
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-indigo-100/70' : 'bg-indigo-500/20'} flex items-center justify-center flex-shrink-0`}>
                <Sparkles size={16} className={isLight ? 'text-indigo-600' : 'text-indigo-400'} />
              </div>
              <div className={`${isLight ? 'bg-white border border-zinc-200' : 'bg-zinc-800/80 border border-zinc-700/50'} rounded-2xl px-4 py-3`}>
                <div className={`flex items-center gap-2 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area - Fixed at bottom */}
      <div className={`${isLight ? 'border-t border-zinc-200 bg-white/60' : 'border-t border-zinc-700/50 bg-zinc-900/50'} backdrop-blur-sm p-4`}>
        <div className="max-w-4xl mx-auto">
          {/* Prompt Suggestions - Only show when no messages */}
          {!hasMessages && (
            <PromptSuggestions onSelect={(prompt) => setInput(prompt)} />
          )}
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={`max-h-32 rounded-xl ${isLight ? 'border border-zinc-200' : 'border-2 border-indigo-500/30'}`}
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all flex-shrink-0"
              title="Upload image"
            >
              <ImagePlus size={20} />
            </label>

            <textarea
              ref={textareaRef}
              className={`flex-1 ${isLight ? 'bg-white text-zinc-900 border border-zinc-200' : 'bg-zinc-800 text-white'} rounded-xl px-4 py-3 outline-none resize-none max-h-32 placeholder:${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={loading}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || (!input.trim() && !selectedImage)}
              className="p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all flex-shrink-0 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-3xl border border-zinc-700 shadow-2xl max-w-2xl w-full p-6 relative">
            {/* Posting Overlay */}
            {posting && (
              <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10">
                <Loader2 size={48} className="text-indigo-400 animate-spin mb-4" />
                <p className="text-white text-lg font-semibold">Posting to LinkedIn...</p>
                <p className="text-zinc-400 text-sm mt-2">Please wait, this may take a few seconds</p>
              </div>
            )}
            
            <h3 className="text-white text-xl font-bold mb-4">Ready to post to LinkedIn?</h3>
            
            {/* Image Preview and Upload */}
            <div className="mb-4">
              {selectedImageForPost && dialogImagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={dialogImagePreview}
                    alt="Post attachment"
                    className="max-h-48 rounded-xl border border-zinc-700"
                  />
                  <button
                    onClick={removeDialogImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    ref={dialogFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDialogImageSelect}
                    className="hidden"
                    id="dialog-image-upload"
                  />
                  <label
                    htmlFor="dialog-image-upload"
                    className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-all"
                  >
                    <ImagePlus size={18} />
                    <span className="text-sm">Add Image to Post</span>
                  </label>
                  <p className="text-xs text-zinc-500 mt-2">Optional: Attach an image to your LinkedIn post</p>
                </div>
              )}
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
              <div className="text-zinc-300 text-sm leading-relaxed">
                {formatAIResponse(extractPostContent(selectedPostForPublish))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-zinc-400 text-sm mb-2 block">Want to refine the post?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                  placeholder="E.g., 'Make it shorter' or 'Add more emojis'"
                  className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded-xl outline-none border border-zinc-700 focus:border-indigo-500 transition-colors"
                />
                <button
                  onClick={handleRefine}
                  disabled={!refineInput.trim() || loading}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-2 rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Refine'}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setSelectedPostForPublish(null);
                  setDialogImagePreview(null);
                }}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPost}
                disabled={posting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 disabled:opacity-70 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {posting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Posting to LinkedIn...</span>
                  </>
                ) : (
                  <>
                    <Share2 size={18} />
                    Post to LinkedIn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;

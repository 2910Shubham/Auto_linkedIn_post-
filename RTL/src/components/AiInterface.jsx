import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImagePlus, Send, Loader2, X, Sparkles, CheckCircle, Share2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { postsAPI } from "../utils/api";

const AiInterface = () => {
  const [input, setInput] = useState("");
  const [height, setHeight] = useState("32px");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [refineInput, setRefineInput] = useState("");
  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

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

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const handleSubmit = async () => {
    if (!input.trim() && !selectedImage) return;

    setLoading(true);
    setResponse("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const systemPrompt = `You are a professional social media manager AI. Your task is to create engaging, professional social media posts based on the user's input and/or images. 

Guidelines:
- Create posts that are attention-grabbing and professional
- Use appropriate emojis sparingly for engagement
- Include relevant hashtags (3-5 max)
- Keep the tone professional yet conversational
- Optimize for different platforms (LinkedIn, Twitter, Instagram, Facebook)
- If an image is provided, describe what you see and incorporate it into the post
- Suggest multiple variations if appropriate
- Focus on value, storytelling, and engagement

Format your response with:
1. A compelling post caption
2. Relevant hashtags
3. Optional: Platform-specific variations`;

      let result;

      if (selectedImage) {
        const imagePart = await fileToGenerativePart(selectedImage);
        const prompt = input.trim()
          ? `${systemPrompt}\n\nUser request: ${input}`
          : `${systemPrompt}\n\nUser request: Create a professional social media post based on this image.`;
        
        result = await model.generateContent([prompt, imagePart]);
      } else {
        const prompt = `${systemPrompt}\n\nUser request: ${input}`;
        result = await model.generateContent(prompt);
      }

      const text = result.response.text();
      setResponse(text);
      setInput("");
      setHeight("32px");
      setPosted(false);
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("❌ Error generating post. Please try again or check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskToPost = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmPost = async () => {
    if (!response || !isAuthenticated) return;

    setPosting(true);
    setShowConfirmDialog(false);
    try {
      await postsAPI.createPost(response, selectedImage);
      setPosted(true);
      removeImage();
      setTimeout(() => {
        setResponse("");
        setPosted(false);
      }, 3000);
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      alert("Failed to post to LinkedIn. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleRefine = async () => {
    if (!refineInput.trim()) return;

    setLoading(true);
    setShowConfirmDialog(false);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = `You are a professional social media manager. The user has a draft post and wants to refine it.

Current post:
${response}

User's refinement request: ${refineInput}

Please update the post according to the user's request while maintaining professionalism and engagement.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
      setRefineInput("");
    } catch (error) {
      console.error("Error refining content:", error);
      alert("Failed to refine post. Please try again.");
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

  return (
    <div className="w-full space-y-6">
      {/* Input Section */}
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-3xl border border-zinc-700/50 shadow-2xl">
        {/* Image Preview */}
        {imagePreview && (
          <div className="p-4 border-b border-zinc-700/50">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 rounded-xl border-2 border-indigo-500/30"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-3 p-4">
          <textarea
            className="font-mono w-full bg-transparent outline-none resize-none text-white placeholder:text-zinc-500"
            style={{ height }}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your project, idea, or what you want to post about..."
            rows={1}
            disabled={loading}
          />

          <div className="flex items-center gap-2">
            {/* Image Upload Button */}
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
              className={`cursor-pointer p-2.5 rounded-xl transition-all ${
                selectedImage
                  ? "bg-indigo-500 text-white"
                  : "bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              <ImagePlus size={20} />
            </label>

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || (!input.trim() && !selectedImage)}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white p-2.5 rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Response Section */}
      {response && (
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-3xl border border-zinc-700/50 shadow-2xl p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={20} />
              <h3 className="font-semibold text-lg">Generated Post</h3>
            </div>
            {isAuthenticated && !posted && !posting && (
              <button
                onClick={handleAskToPost}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all"
              >
                <Share2 size={18} />
                Ready to Post?
              </button>
            )}
            {posting && (
              <div className="flex items-center gap-2 text-blue-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="font-semibold">Posting...</span>
              </div>
            )}
            {posted && (
              <div className="flex items-center gap-2 text-green-400 font-semibold">
                <CheckCircle size={20} />
                Posted Successfully!
              </div>
            )}
          </div>
          <div className="text-white whitespace-pre-wrap font-light leading-relaxed">
            {response}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-3xl border border-zinc-700 shadow-2xl max-w-2xl w-full p-6 animate-fadeIn">
            <h3 className="text-white text-xl font-bold mb-4">Ready to post to LinkedIn?</h3>
            
            <div className="bg-zinc-900/50 rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
              <p className="text-zinc-300 whitespace-pre-wrap">{response}</p>
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
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPost}
                disabled={posting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {posting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Posting...
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

export default AiInterface;

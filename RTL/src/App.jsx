import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useConversation } from "./context/ConversationContext";
import { SettingsProvider } from "./context/SettingsProvider";
import ChatInterface from "./components/ChatInterface";
import LoginButton from "./components/LoginButton";
import ConversationSidebar from "./components/ConversationSidebar";
import AuthSuccess from "./pages/AuthSuccess";
import AuthFailure from "./pages/AuthFailure";
import { Loader2, Menu } from "lucide-react";

function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const { 
    conversations, 
    currentConversation, 
    startNewChat,
    selectConversation,
    deleteConversation,
    updateConversationTitle 
  } = useConversation();
  // Default to open but allow toggling on all screen sizes
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full min-h-screen flex flex-col justify-center items-center">
        <Loader2 size={48} className="text-indigo-400 animate-spin mb-4" />
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full h-screen flex overflow-hidden">
      {/* Conversation Sidebar - Only show when authenticated */}
      {isAuthenticated && (
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversation?._id}
          onSelectConversation={selectConversation}
          onNewConversation={startNewChat}
          onDeleteConversation={deleteConversation}
          onUpdateTitle={updateConversationTitle}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main Content */}
  <div className={`flex-1 flex flex-col h-screen transition-all ${isAuthenticated && sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'}`}>
        {/* Header */}
        <div className="border-b border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm px-6 py-4">
          <div className="flex justify-between items-center">
            {isAuthenticated && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                title="Toggle conversations"
              >
                <Menu size={24} />
              </button>
            )}
            <div className={`${isAuthenticated ? '' : 'w-full flex justify-end'}`}>
              {isAuthenticated ? null : <LoginButton />}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/failure" element={<AuthFailure />} />
      </Routes>
    </SettingsProvider>
  );
}

export default App;

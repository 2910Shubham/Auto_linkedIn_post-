import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Edit2, Check, X, Settings as SettingsIcon } from 'lucide-react';
// import { conversationsAPI } from '../utils/api';
import UserProfile from './UserProfile';
import Settings from './Settings';
import { useSettings } from '../hooks/useSettings';

const ConversationSidebar = ({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewConversation,
  onDeleteConversation,
  onUpdateTitle,
  isOpen,
  onToggle
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { settings } = useSettings();
  const isLight = settings?.theme === 'light';

  const handleStartEdit = (conv) => {
    setEditingId(conv._id);
    setEditTitle(conv.title);
  };

  const handleSaveEdit = async (convId) => {
    if (editTitle.trim()) {
      await onUpdateTitle(convId, editTitle);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className={`${isLight ? 'fixed inset-0 bg-black/30' : 'fixed inset-0 bg-black/50'} backdrop-blur-sm z-40 lg:hidden`}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        w-80 ${isLight ? 'bg-white/95 border-r border-zinc-200' : 'bg-zinc-900/95 border-r border-zinc-700/50'} backdrop-blur-sm
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
  <div className={`p-4 ${isLight ? 'border-b border-zinc-200' : 'border-b border-zinc-700/50'}`}>
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold transition-all"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className={`text-center ${isLight ? 'text-zinc-600' : 'text-zinc-500'} py-8`}>
              <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`
                  group relative rounded-xl p-3 cursor-pointer transition-all
                  ${currentConversationId === conv._id 
                    ? 'bg-indigo-500/20 border border-indigo-500/50' 
                    : (isLight ? 'hover:bg-zinc-100/60 border border-transparent' : 'hover:bg-zinc-800/50 border border-transparent')
                  }
                `}
                onClick={() => onSelectConversation(conv._id)}
              >
                {editingId === conv._id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(conv._id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className={`flex-1 ${isLight ? 'bg-gray-100 text-zinc-900' : 'bg-zinc-800 text-white'} text-sm px-2 py-1 rounded outline-none border border-indigo-500`}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(conv._id)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${isLight ? 'text-zinc-900' : 'text-white'} text-sm font-medium truncate`}>
                          {conv.title}
                        </h3>
                        <p className={`${isLight ? 'text-zinc-600' : 'text-zinc-400'} text-xs truncate mt-1`}>
                          {conv.lastMessage}
                        </p>
                        <div className={`flex items-center gap-2 mt-2 text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                          <span>{formatDate(conv.lastMessageAt)}</span>
                          <span>•</span>
                          <span>{conv.metadata.totalMessages} msgs</span>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(conv);
                          }}
                          className={`p-1 ${isLight ? 'text-zinc-600 hover:text-indigo-500 hover:bg-indigo-100' : 'text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10'} rounded`}
                          title="Rename"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this conversation?')) {
                              onDeleteConversation(conv._id);
                            }
                          }}
                          className={`p-1 ${isLight ? 'text-zinc-600 hover:text-red-500 hover:bg-red-100' : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'} rounded`}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer with user profile and settings */}
        <div className={`mt-auto ${isLight ? 'border-t border-zinc-200' : 'border-t border-zinc-700/50'}`}>
          <div className="p-2">
            <UserProfile variant="sidebar" />
          </div>
          <div className={`flex items-center justify-between px-4 py-2 ${isLight ? 'border-t border-zinc-200' : 'border-t border-zinc-700/50'}`}>
            <span className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowSettings(true)}
              className={`p-1.5 ${isLight ? 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'} rounded-lg transition-all`}
              title="Settings"
            >
              <SettingsIcon size={16} />
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </div>
    </>
  );
};

export default ConversationSidebar;

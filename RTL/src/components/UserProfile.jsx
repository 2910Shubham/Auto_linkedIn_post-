import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, isLight }) => {
  if (!isOpen) return null;
  
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[99999]" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div 
        className={`${isLight ? 'bg-white' : 'bg-zinc-900'} rounded-2xl border ${isLight ? 'border-zinc-200' : 'border-zinc-700'} max-w-sm w-full mx-4 p-6 shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={`text-lg font-semibold ${isLight ? 'text-zinc-900' : 'text-white'} mb-2`}>Confirm logout</h3>
        <p className={`text-sm ${isLight ? 'text-zinc-600' : 'text-zinc-300'} mb-4`}>Are you sure you want to log out?</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
};

const UserProfile = ({ variant = 'default' }) => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const isLight = settings?.theme === 'light';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  if (variant === 'sidebar') {
    return (
      <>
        <div className={`flex items-center justify-between w-full ${isLight ? 'hover:bg-gray-100' : 'hover:bg-zinc-800/50'} rounded-xl p-2 transition-colors`}>
          <div className="flex items-center gap-2">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className={`w-8 h-8 rounded-full ${isLight ? 'border border-zinc-200' : 'border border-indigo-500/50'}`}
              />
            ) : (
              <div className={`w-8 h-8 rounded-full ${isLight ? 'bg-indigo-100/60 border border-zinc-200' : 'bg-indigo-500/20 border border-indigo-500/50'} flex items-center justify-center`}>
                <User size={16} className={isLight ? 'text-indigo-600' : 'text-indigo-400'} />
              </div>
            )}
            <div className="text-left min-w-0">
              <p className={`${isLight ? 'text-zinc-900' : 'text-zinc-200'} font-medium text-sm truncate`}>
                {user.firstName} {user.lastName}
              </p>
              <p className={`${isLight ? 'text-zinc-600' : 'text-zinc-500'} text-xs truncate`}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`p-1.5 ${isLight ? 'text-zinc-600 hover:text-red-600 hover:bg-red-100' : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'} rounded-lg transition-all ml-2`}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
        <LogoutConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          isLight={isLight}
        />
      </>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-4 ${isLight ? 'bg-white/60' : 'bg-zinc-800/50'} backdrop-blur-sm rounded-2xl px-4 py-3 border ${isLight ? 'border-zinc-200' : 'border-zinc-700/50'}`}>
        <div className="flex items-center gap-3">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={`${user.firstName} ${user.lastName}`}
              className={`w-10 h-10 rounded-full ${isLight ? 'border border-zinc-200' : 'border-2 border-indigo-500'}`}
            />
          ) : (
            <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-indigo-100/70' : 'bg-indigo-500'} flex items-center justify-center`}>
              <User size={20} className={isLight ? 'text-indigo-600' : 'text-white'} />
            </div>
          )}
          <div className="text-left">
            <p className={`${isLight ? 'text-zinc-900' : 'text-white'} font-semibold text-sm`}>{user.firstName} {user.lastName}</p>
            <p className={`${isLight ? 'text-zinc-600' : 'text-zinc-400'} text-xs`}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`ml-auto p-2 ${isLight ? 'text-zinc-600 hover:text-red-600 hover:bg-red-100' : 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'} rounded-lg transition-all`}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        isLight={isLight}
      />
    </>
  );
};

export default UserProfile;

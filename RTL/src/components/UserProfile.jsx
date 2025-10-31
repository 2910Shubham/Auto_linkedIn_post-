import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = ({ variant = 'default' }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  if (variant === 'sidebar') {
    return (
      <div className="flex items-center justify-between w-full hover:bg-zinc-800/50 rounded-xl p-2 transition-colors">
        <div className="flex items-center gap-2">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-8 h-8 rounded-full border border-indigo-500/50"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
              <User size={16} className="text-indigo-400" />
            </div>
          )}
          <div className="text-left min-w-0">
            <p className="text-zinc-200 font-medium text-sm truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-zinc-500 text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-2"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-zinc-800/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-zinc-700/50">
      <div className="flex items-center gap-3">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full border-2 border-indigo-500"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        )}
        <div className="text-left">
          <p className="text-white font-semibold text-sm">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-zinc-400 text-xs">{user.email}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="ml-auto p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
};

export default UserProfile;

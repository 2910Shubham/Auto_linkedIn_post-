import React from 'react';
import { LogIn } from 'lucide-react';

const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
    >
      <LogIn size={20} />
      Login with LinkedIn
    </button>
  );
};

export default LoginButton;

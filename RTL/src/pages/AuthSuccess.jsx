import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      login(token);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      navigate('/');
    }
  }, [login, navigate]);

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full h-screen flex flex-col justify-center items-center">
      <Loader2 size={48} className="text-indigo-400 animate-spin mb-4" />
      <h2 className="text-white text-2xl font-semibold">Authenticating...</h2>
      <p className="text-zinc-400 mt-2">Please wait while we log you in</p>
    </div>
  );
};

export default AuthSuccess;

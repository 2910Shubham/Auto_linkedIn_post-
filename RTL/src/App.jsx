import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AiInterface from "./components/AiInterface";
import LoginButton from "./components/LoginButton";
import UserProfile from "./components/UserProfile";
import AuthSuccess from "./pages/AuthSuccess";
import AuthFailure from "./pages/AuthFailure";
import { Loader2 } from "lucide-react";

function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full min-h-screen flex flex-col justify-center items-center">
        <Loader2 size={48} className="text-indigo-400 animate-spin mb-4" />
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full min-h-screen flex flex-col items-center text-center px-6 py-12">
      
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* User Profile or Login */}
        <div className="w-full flex justify-end mb-6 animate-fadeIn">
          {isAuthenticated ? <UserProfile /> : <LoginButton />}
        </div>

        <div className="flex flex-col justify-center items-center space-y-4 animate-fadeIn">
          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-indigo-400">RTL</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl font-light max-w-2xl">
            Your intelligent social media manager — create professional posts with AI and images.
          </p>
          {!isAuthenticated && (
            <p className="text-yellow-400 text-sm mt-2">
              👆 Login with LinkedIn to post directly to your profile
            </p>
          )}
        </div>

        <div className="mt-10 w-32 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-fadeIn delay-200" /> 

        <div className="mt-12 w-full px-4 animate-fadeIn delay-300">
          <AiInterface />
        </div>
      </div>

      <footer className="mt-12 text-zinc-500 text-sm font-mono animate-fadeIn delay-500">
        © {new Date().getFullYear()} RTL — Built with 💜 React & Tailwind
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/auth/failure" element={<AuthFailure />} />
    </Routes>
  );
}

export default App;

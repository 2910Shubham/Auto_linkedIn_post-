import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

const AuthFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    // Get error details from URL params if available
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error || errorDescription) {
      setErrorDetails({
        error,
        description: errorDescription
      });
    }

    console.error('LinkedIn OAuth Failed:', { error, errorDescription });
  }, [searchParams]);

  const handleRetry = () => {
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full h-screen flex flex-col justify-center items-center px-6">
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-3xl border border-red-500/30 shadow-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-500/20 p-4 rounded-full mb-4">
            <AlertCircle size={48} className="text-red-400" />
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">
            Authentication Failed
          </h2>
          
          <p className="text-zinc-300 mb-6">
            We couldn't log you in with LinkedIn. This might be due to:
          </p>

          <div className="bg-zinc-900/50 rounded-xl p-4 mb-6 w-full text-left">
            <ul className="text-zinc-400 text-sm space-y-2">
              <li>• LinkedIn app permissions not approved</li>
              <li>• Required scopes not authorized</li>
              <li>• OAuth callback URL mismatch</li>
              <li>• You denied the authorization request</li>
            </ul>
          </div>

          {errorDetails && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6 w-full text-left">
              <p className="text-red-400 text-xs font-mono mb-1">
                <strong>Error:</strong> {errorDetails.error || 'Unknown'}
              </p>
              {errorDetails.description && (
                <p className="text-red-400 text-xs font-mono">
                  <strong>Details:</strong> {errorDetails.description}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <Home size={18} />
            </button>
          </div>

          <div className="mt-6 text-zinc-500 text-xs">
            <p>Need help? Check the backend logs for more details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFailure;

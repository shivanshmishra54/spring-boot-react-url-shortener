import React, { useState, useEffect } from 'react';
import { X, Link2, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ mode, onClose, setGlobalUsername }) {
  // mode can be 'login' or 'signup'
  const [activeTab, setActiveTab] = useState(mode || 'login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sync tab when parent changes mode prop
  useEffect(() => {
    if (mode) {
      setActiveTab(mode);
      setError('');
    }
  }, [mode]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const isValid = activeTab === 'login' 
      ? email.trim() && password.trim()
      : username.trim() && email.trim() && password.trim();

    if (isValid) {
      try {
        setLoading(true);
        const endpoint = activeTab === 'login' ? 'login' : 'register';
        const payload = {
          email: email.trim(),
          password
        };
        if (activeTab === 'signup') {
          payload.username = username.trim();
        }

        const response = await fetch(`http://localhost:8082/auth/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error(errMsg || 'Authentication failed');
        }
        
        const data = await response.json();
        // data contains token, username, message
        localStorage.setItem('token', data.token);
        setGlobalUsername(data.username);
        onClose();
        navigate('/dashboard');
      } catch (err) {
        // Simple error parsing if it's JSON from a Spring exception
        try {
          const parsed = JSON.parse(err.message);
          setError(parsed.message || 'Authentication failed');
        } catch {
          setError(err.message || 'Authentication failed');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Floating Premium Pop Alert for Duplicate Email/Errors */}
        {error && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-red-600 text-white rounded-xl shadow-lg p-3.5 flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-white" />
              <span className="text-xs font-semibold leading-snug">{error}</span>
            </div>
            <button onClick={() => setError('')} className="p-1 hover:bg-white/20 rounded cursor-pointer transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 pt-8 pb-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <Link2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-8">
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {activeTab === 'login' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            {activeTab === 'login'
              ? 'Log in to manage and track your short links.'
              : 'Join thousands of users shortening links every day.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'signup' && (
              <div>
                <label htmlFor="modal-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  id="modal-username"
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-sm transition"
                />
              </div>
            )}

            <div>
              <label htmlFor="modal-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="modal-email"
                type="email"
                required
                autoFocus={activeTab === 'login'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="modal-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="modal-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full px-4 py-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer mt-2 disabled:opacity-70"
            >
              {loading ? 'Please wait...' : (activeTab === 'login' ? 'Sign in' : 'Create account')}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>

          {/* Footer toggle */}
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {activeTab === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setActiveTab('signup'); setError(''); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">Sign up free</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setActiveTab('login'); setError(''); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">Log in</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

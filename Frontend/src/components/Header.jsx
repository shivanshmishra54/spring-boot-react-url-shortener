import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Bell, HelpCircle, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ username, onLogout, onOpenAuth, onOpenInfo }) {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const notifications = [
    { id: 1, text: "🎉 Welcome to ShortUrl! Create an account to track detailed click history.", time: "Just now" },
    { id: 2, text: "🚀 Rebranded from LinkPrecision to ShortUrl for a cleaner look.", time: "1 day ago" }
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded p-1">
                <Link2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">ShortUrl</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/features" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
              <Link to="/analysis" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Analytics</Link>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 relative">

            {/* ── Theme Toggle Button ── */}
            <button
              onClick={toggleTheme}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                bg-slate-100 dark:bg-slate-700
                text-slate-500 dark:text-yellow-400
                hover:bg-slate-200 dark:hover:bg-slate-600
                border border-slate-200 dark:border-slate-600
                shadow-sm mr-1"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {username ? (
              <>
                <Link to="/dashboard" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Dashboard</Link>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{username}</span>
                <button onClick={handleLogout} className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 font-medium cursor-pointer">Log out</button>
              </>
            ) : (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer relative"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 transition-colors duration-300">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                        <button onClick={() => setShowNotifications(false)} className="text-[10px] text-blue-600 hover:underline">Close</button>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal">{n.text}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Help button */}
                <button 
                  onClick={() => onOpenInfo('help')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-sm text-slate-700 dark:text-slate-200 font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-1.5 rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Create Link
                </button>
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="p-1.5 border border-slate-200 dark:border-slate-600 rounded-md text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

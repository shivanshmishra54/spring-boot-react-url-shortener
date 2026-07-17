import React, { useState } from 'react';
import Header from '../components/Header';
import { BarChart3, Search, Calendar, Globe, MousePointerClick, ExternalLink, ShieldAlert, BarChart2 } from 'lucide-react';

export default function Analysis({ username, onLogout, onOpenAuth, onOpenInfo }) {
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setAnalytics(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please sign in or register to search and view URL analytics.");
      return;
    }

    const code = shortCode.trim().split('/').pop(); // Extract code if they paste the full URL
    if (!code) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8082/api/v1/analytics/${code}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          throw new Error("Access denied: You do not own this URL mapping.");
        }
        throw new Error("URL Analytics not found. Check the code and try again.");
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header username={username} onLogout={onLogout} onOpenAuth={onOpenAuth} onOpenInfo={onOpenInfo} />
      
      <main className="flex-grow py-12 px-4 max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl mb-3">
            Link Analytics Lookup
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Search for your shortened links to monitor click events, creation timestamps, and redirection health.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-2 p-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm">
            <div className="pl-3 flex items-center text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              required
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              placeholder="Enter short code or URL (e.g. xyzabc)"
              className="flex-grow px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-75"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-2">
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Lookup Results */}
        {analytics ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Clicks</span>
                  <MousePointerClick className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{analytics.clicks}</span>
              </div>
              <div className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Created Date</span>
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-2">
                  {new Date(analytics.createdAt).toLocaleDateString()}
                </span>
                <span className="text-[10px] text-slate-400">At {new Date(analytics.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* URL Meta Card */}
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Short Link</span>
                <a href={`http://localhost:8082/${analytics.shortUrl}`} target="_blank" rel="noreferrer" className="flex items-center text-sm font-bold text-blue-600 hover:underline mt-1">
                  http://localhost:8082/{analytics.shortUrl}
                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Original Destination</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate mt-1" title={analytics.url}>
                  {analytics.url}
                </p>
              </div>
            </div>

            {/* Simulated charts for high-fidelity feel */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-blue-500" /> Click Distribution (Demographics)
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Direct/Search Referral</span>
                    <span className="text-slate-900 dark:text-white font-bold">60%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Social Traffic</span>
                    <span className="text-slate-900 dark:text-white font-bold">30%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Organic campaigns</span>
                    <span className="text-slate-900 dark:text-white font-bold">10%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Default dashboard overview stats */
          <div className="max-w-xl mx-auto text-center border border-slate-200 dark:border-slate-700 rounded-2xl p-10 bg-slate-50/50 dark:bg-slate-800/40">
            <BarChart3 className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Platform Overview</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 max-w-sm mx-auto">
              You are currently viewing mock global system capacity stats. Login to see analytics of your individual links.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">1.2M+</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Links</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">12.9M+</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Clicks</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">99.9%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Uptime</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

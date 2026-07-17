import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import UrlShortenerForm from '../components/UrlShortenerForm';
import { ExternalLink, BarChart2, Calendar, MousePointerClick, Link2, Trash2, Copy, Check } from 'lucide-react';

export default function Dashboard({ username, onLogout, onOpenAuth, onOpenInfo }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (username) {
      fetchHistory();
    }
  }, [username]);

  const handleCopy = (shortCode) => {
    const fullUrl = `http://localhost:8082/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (shortCode) => {
    if (!window.confirm("Are you sure you want to delete this short URL?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/v1/delete/${shortCode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete URL');
      fetchHistory();
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8082/api/v1/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header username={username} onLogout={onLogout} onOpenAuth={onOpenAuth} onOpenInfo={onOpenInfo} />
      
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {username}!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Create a new short link below.</p>
          <UrlShortenerForm username={username} />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Link History</h3>
            </div>
            <button onClick={fetchHistory} className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Refresh</button>
          </div>
          
          {loading ? (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400 font-medium">Loading your links...</div>
          ) : error ? (
            <div className="p-10 text-center text-red-500 font-medium">{error}</div>
          ) : history.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                <Link2 className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No links yet</h4>
              <p className="text-slate-500 dark:text-slate-400">You haven't shortened any links yet. Use the form above to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-left">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Original URL</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Short URL</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clicks</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 max-w-[240px] truncate" title={item.url}>
                        {item.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`http://localhost:8082/${item.shortUrl}`} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-600 hover:underline">
                          http://localhost:8082/{item.shortUrl}
                          <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4 text-slate-400" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white text-center font-medium">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                          <MousePointerClick className="mr-1 h-3 w-3" />
                          {item.clicks}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleCopy(item.shortUrl)}
                            title="Copy link"
                            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                              copiedId === item.shortUrl
                                ? 'bg-green-50 border-green-200 text-green-600'
                                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600'
                            }`}
                          >
                            {copiedId === item.shortUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(item.shortUrl)}
                            title="Delete link"
                            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-slate-600 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

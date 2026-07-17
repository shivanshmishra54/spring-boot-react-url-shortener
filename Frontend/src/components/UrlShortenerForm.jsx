import React, { useState } from 'react';
import { Link2, ArrowRight, Copy, Check } from 'lucide-react';

export default function UrlShortenerForm({ username }) {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl(null);
    setCopied(false);
    if (!longUrl) return;
    try {
      setLoading(true);
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch('http://localhost:8082/api/v1/shorten', {
        method: 'POST',
        headers,
        body: JSON.stringify({ longUrl })
      });
      if (!response.ok) throw new Error('Failed to shorten URL');
      const data = await response.json();
      setShortUrl(data.shortUrl ? data.shortUrl.replace('8081', '8082') : '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleShorten}>
        <div className="flex items-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm overflow-hidden max-w-xl mx-auto transition-colors duration-300">
          <div className="pl-4 flex items-center">
            <Link2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
          </div>
          <input
            type="url"
            required
            className="flex-grow px-3 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-sm bg-transparent"
            placeholder="Enter long link here"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center m-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            {loading ? 'Shortening...' : (
              <>Shorten URL <ArrowRight className="ml-1.5 h-4 w-4" /></>
            )}
          </button>
        </div>
      </form>

      {error && <p className="mt-3 text-red-500 text-sm text-center">{error}</p>}

      {shortUrl && (
        <div className="mt-4 max-w-xl mx-auto p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between gap-3">
          <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate">
            {shortUrl}
          </a>
          <button
            onClick={copyToClipboard}
            className={`flex items-center text-xs font-medium px-3 py-1.5 rounded-md flex-shrink-0 cursor-pointer transition-colors ${copied ? 'bg-green-200 text-green-800' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {copied ? <><Check className="mr-1 h-3 w-3" /> Copied!</> : <><Copy className="mr-1 h-3 w-3" /> Copy</>}
          </button>
        </div>
      )}
    </div>
  );
}

// Central API configuration
// In production (Netlify), set VITE_API_URL env var to your Cloudflare Tunnel URL
// For local dev, defaults to localhost:8082
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

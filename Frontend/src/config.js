// Central API configuration
// Production (Netlify): uses '' so fetch('/api/...') goes to Netlify Proxy → Tunnel
// Local dev: defaults to localhost:8082
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8082';

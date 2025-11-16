import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// attach bearer token from localStorage (if present)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// Global response handler: if 401/403 -> clear auth and redirect to /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverMsg = (error?.response?.data?.message ?? '') + '';

    // helper: detect auth-related text
    const authKeywords = ['token', 'unauthor', 'invalid token', 'expired', 'credentials', 'login', 'authentication', 'permission', 'not authorized'];
    const isAuthMessage = authKeywords.some(k => serverMsg.toLowerCase().includes(k));

    
    if (status === 401 || (status === 403 && isAuthMessage)) {
      try {
        if (typeof window !== 'undefined' && !(window as any).__redirectingToLogin) {
          (window as any).__redirectingToLogin = true;
          try { localStorage.removeItem('token'); } catch {}
          try { localStorage.removeItem('user'); } catch {}
          // clear axios default auth header
          if ((api.defaults.headers as any)?.common) delete (api.defaults.headers as any).common.Authorization;
          const current = window.location.pathname + window.location.search;
          setTimeout(() => { window.location.href = `/login?redirect=${encodeURIComponent(current)}`; }, 80);
        }
      } catch (_) {}
    }

    return Promise.reject(error);
  }
);

export default api;
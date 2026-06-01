import axios from 'axios';

// Auth, dashboard, bookmarks and progress are served by this app's own Next.js
// route handlers under `/api/*` (same origin) — no separate backend required.
// Set NEXT_PUBLIC_AUTH_API_URL only if you intentionally point auth at an
// external service.
const API_BASE = (process.env.NEXT_PUBLIC_AUTH_API_URL ?? '') + '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true, // send/receive the httpOnly session cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optional: redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

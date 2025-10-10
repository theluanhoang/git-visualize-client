import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8001';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: request/response interceptors placeholder for auth, errors, etc.
// api.interceptors.request.use((config) => config);
// api.interceptors.response.use((res) => res, (err) => Promise.reject(err));

export default api;



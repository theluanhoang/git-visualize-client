import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8001';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;

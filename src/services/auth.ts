import api from '@/lib/api/axios';

export interface AuthUser { id: string; email: string; role: 'USER' | 'ADMIN' }
export interface AuthTokens { accessToken: string; refreshToken: string }

export const authApi = {
  register: async (email: string, password: string) => {
    const res = await api.post<{ id: string; email: string; role: string }>(`/api/v1/auth/register`, { email, password });
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await api.post<{ user: AuthUser } & AuthTokens>(`/api/v1/auth/login`, { email, password });
    return res.data;
  },
  refresh: async (userId: string, refreshToken: string) => {
    const res = await api.post<AuthTokens>(`/api/v1/auth/refresh`, { userId, refreshToken });
    return res.data;
  },
};

export const authStorage = {
  save(tokens: AuthTokens, user: AuthUser) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth:access', tokens.accessToken);
      localStorage.setItem('auth:refresh', tokens.refreshToken);
      localStorage.setItem('auth:user', JSON.stringify(user));
    }
  },
  load(): { tokens: AuthTokens | null; user: AuthUser | null } {
    if (typeof window === 'undefined') {
      return { tokens: null, user: null };
    }
    const accessToken = localStorage.getItem('auth:access');
    const refreshToken = localStorage.getItem('auth:refresh');
    const userStr = localStorage.getItem('auth:user');
    return {
      tokens: accessToken && refreshToken ? { accessToken, refreshToken } : null,
      user: userStr ? JSON.parse(userStr) : null,
    };
  },
  clear() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth:access');
      localStorage.removeItem('auth:refresh');
      localStorage.removeItem('auth:user');
    }
  }
}



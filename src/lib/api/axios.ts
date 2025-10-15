import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8001';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tokenUtils = {
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  getTokenExpirationTime(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  },

  shouldRefreshToken(token: string, bufferSeconds = 30): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp - currentTime < bufferSeconds;
    } catch {
      return true;
    }
  }
};

const authState: {
  isRefreshing: boolean;
  refreshPromise: Promise<string> | null;
  failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: unknown) => void;
  }>;
} = {
  isRefreshing: false,
  refreshPromise: null,
  failedQueue: []
};

const processQueue = (error: unknown, token: string | null = null) => {
  authState.failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  authState.failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth:access');
      if (token) {
        if (tokenUtils.isTokenExpired(token) || tokenUtils.shouldRefreshToken(token)) {
          if (!authState.isRefreshing) {
            authState.isRefreshing = true;
            authState.refreshPromise = refreshToken();
          }
          
          try {
            const newToken = await authState.refreshPromise;
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${newToken}`;
          } catch (error) {
            clearAuthState();
            throw error;
          }
        } else {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
  } catch (error) {
    console.error('Request interceptor error:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (authState.isRefreshing) {
        return new Promise((resolve, reject) => {
          authState.failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      authState.isRefreshing = true;
      authState.refreshPromise = refreshToken();

      try {
        const newToken = await authState.refreshPromise;
        processQueue(null, newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthState();
        if (typeof window !== 'undefined') {
          const refreshErrorStatus = (refreshError as { response?: { status?: number } })?.response?.status;
          if (refreshErrorStatus === 401) {
            window.dispatchEvent(new CustomEvent('auth:session-expired'));
          }
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshToken(): Promise<string> {
  try {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('auth:refresh') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('auth:user') : null;
    const userId = userStr ? JSON.parse(userStr)?.id : undefined;
    
    if (!refreshToken || !userId) {
      throw new Error('No refresh token or user ID available');
    }

    const response = await axios.post(`${baseURL}/api/v1/auth/refresh`, 
      { userId, refreshToken }, 
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data || {};
    
    if (!accessToken) {
      throw new Error('No access token received from refresh');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth:access', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('auth:refresh', newRefreshToken);
      }
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  } finally {
    authState.isRefreshing = false;
    authState.refreshPromise = null;
  }
}

function clearAuthState() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth:access');
    localStorage.removeItem('auth:refresh');
    localStorage.removeItem('auth:user');
    localStorage.removeItem('auth:oauth-session');
  }
  delete api.defaults.headers.common['Authorization'];
  authState.isRefreshing = false;
  authState.refreshPromise = null;
  authState.failedQueue = [];
}

export { clearAuthState };

export default api;

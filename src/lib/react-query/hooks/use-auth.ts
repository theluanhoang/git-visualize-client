import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api, { clearAuthState, tokenUtils } from '@/lib/api/axios'
import { authApi, authStorage, AuthUser } from '@/services/auth'

export const useCurrentUser = () => {
  const queryClient = useQueryClient()
  const stored = authStorage.load()
  
  const hasAccessToken = !!stored.tokens?.accessToken
  const hasRefreshToken = !!stored.tokens?.refreshToken
  const isAccessTokenExpired = hasAccessToken ? tokenUtils.isTokenExpired(stored.tokens!.accessToken) : true
  const isRefreshTokenExpired = hasRefreshToken ? tokenUtils.isTokenExpired(stored.tokens!.refreshToken) : true
  
  const shouldEnableQuery = hasAccessToken && hasRefreshToken && (!isAccessTokenExpired || !isRefreshTokenExpired)
  
  const query = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getCurrentUser,
    enabled: shouldEnableQuery,
    staleTime: 0,
    gcTime: 0,
    retry: (failureCount, error: unknown) => {
      if ((error as { response?: { status?: number } })?.response?.status === 401) return false
      return failureCount < 2
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  useEffect(() => {
    const handleAuthLogout = () => {
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.removeQueries({ queryKey: ['auth'], exact: false })
    }

    window.addEventListener('auth:logout', handleAuthLogout)
    return () => window.removeEventListener('auth:logout', handleAuthLogout)
  }, [queryClient])

  return query
};

export const useLogin = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: ({ user, accessToken, refreshToken }) => {
      authStorage.save({ accessToken, refreshToken }, user as AuthUser)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      qc.setQueryData(['auth', 'user'], user)
      qc.invalidateQueries({ queryKey: ['auth'] })
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error)
    }
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.register(email, password),
    onError: (error: unknown) => {
      console.error('Registration failed:', error)
    }
  })
}

export const useLogout = () => {
  const qc = useQueryClient()
  const router = useRouter()
  
  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout?.()
      } catch (error) {
        console.warn('Logout API call failed:', error)
      }
    },
    onSuccess: () => {
      clearAuthState()
      qc.setQueryData(['auth', 'user'], null)
      qc.removeQueries({ queryKey: ['auth'], exact: false })
      qc.clear()
      
      router.replace('/')
    },
    onError: () => {
      clearAuthState()
      qc.setQueryData(['auth', 'user'], null)
      qc.removeQueries({ queryKey: ['auth'], exact: false })
      router.replace('/')
    }
  })
}

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Pick<AuthUser, 'firstName'|'lastName'|'avatar'>>) => authApi.updateCurrentUser(payload),
    onSuccess: (user) => {
      qc.setQueryData(['auth', 'user'], user)
      const stored = authStorage.load()
      if (stored.tokens) {
        authStorage.save(stored.tokens, user)
      }
    },
    onError: (error: unknown) => {
      console.error('Profile update failed:', error)
    }
  })
}

export const useIsAuthenticated = () => {
  const { data: user, isLoading, error } = useCurrentUser()
  const stored = authStorage.load()
  
  const hasAccessToken = !!stored.tokens?.accessToken
  const hasRefreshToken = !!stored.tokens?.refreshToken
  const isAccessTokenExpired = hasAccessToken ? tokenUtils.isTokenExpired(stored.tokens!.accessToken) : true
  const isRefreshTokenExpired = hasRefreshToken ? tokenUtils.isTokenExpired(stored.tokens!.refreshToken) : true
  
  const isAuthenticated = !!(user && stored.tokens && (!isAccessTokenExpired || !isRefreshTokenExpired))
  
  return {
    isAuthenticated,
    isLoading,
    user,
    error
  }
}

export const useTokenInfo = () => {
  const stored = authStorage.load()
  
  if (!stored.tokens?.accessToken) {
    return { isExpired: true, expiresAt: null, timeUntilExpiry: null, shouldRefresh: false }
  }
  
  const token = stored.tokens.accessToken
  const isExpired = tokenUtils.isTokenExpired(token)
  const expiresAt = tokenUtils.getTokenExpirationTime(token)
  const timeUntilExpiry = expiresAt ? expiresAt - Date.now() : null
  
  return {
    isExpired,
    expiresAt,
    timeUntilExpiry,
    shouldRefresh: tokenUtils.shouldRefreshToken(token)
  }
}



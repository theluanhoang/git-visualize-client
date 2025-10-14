import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import api from '@/lib/api/axios'
import { authApi, authStorage, AuthUser } from '@/services/auth'

export const useCurrentUser = () => {
  const stored = authStorage.load()
  const query = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getCurrentUser,
    enabled: !!stored.tokens,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: stored.user ?? undefined,
    initialDataUpdatedAt: stored.user ? Date.now() : undefined,
  })

  return query
};

export const useLogin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: ({ user, accessToken, refreshToken }) => {
      authStorage.save({ accessToken, refreshToken }, user as AuthUser)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      qc.setQueryData(['auth','user'], user)
    },
    onError: () => {}
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.register(email, password),
  })
}

export const useLogout = () => {
  const qc = useQueryClient()
  return () => {
    authStorage.clear()
    delete api.defaults.headers.common['Authorization']
    qc.setQueryData(['auth','user'], null)
    qc.removeQueries({ queryKey: ['auth'], exact: false })
  }
}

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Pick<AuthUser, 'firstName'|'lastName'|'avatar'>>) => authApi.updateCurrentUser(payload),
    onSuccess: (user) => {
      qc.setQueryData(['auth','user'], user)
    }
  })
}



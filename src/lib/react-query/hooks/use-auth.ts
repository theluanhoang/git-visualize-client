import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api/axios'
import { authApi, authStorage, AuthUser } from '@/services/auth'

export const useLogin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: ({ user, accessToken, refreshToken }) => {
      authStorage.save({ accessToken, refreshToken }, user as AuthUser)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      qc.setQueryData(['auth','user'], user)
    },
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



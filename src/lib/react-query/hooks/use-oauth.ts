import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { oauthService, OAuthProvider } from '@/services/oauth';
import { authStorage } from '@/services/auth';
import { toast } from 'sonner';

export const useOAuthLogin = () => {
  const login = (provider: OAuthProvider, locale: string = 'en') => {
    oauthService.initiateOAuth(provider, locale);
  };

  return { login };
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ['oauth', 'sessions', 'active'],
    queryFn: () => oauthService.getActiveSessions(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useOAuthSessions = () => {
  return useQuery({
    queryKey: ['oauth', 'sessions', 'oauth'],
    queryFn: () => oauthService.getOAuthSessions(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useCurrentDeviceInfo = () => {
  return useQuery({
    queryKey: ['oauth', 'device-info'],
    queryFn: () => oauthService.getCurrentDeviceInfo(),
    staleTime: 10 * 60 * 1000, 
    retry: 1,
  });
};

export const useOAuthProviderStatus = () => {
  return useQuery({
    queryKey: ['oauth', 'provider-status'],
    queryFn: () => oauthService.getProviderStatus(),
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
};

export const useUnlinkProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: string) => oauthService.unlinkProvider(provider),
    onSuccess: (data, provider) => {
      toast.success(`Successfully unlinked ${provider} account`);
      
      queryClient.invalidateQueries({ queryKey: ['oauth', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to unlink provider');
    },
  });
};

export const useOAuthCallback = () => {
  const queryClient = useQueryClient();

  const handleCallback = async (accessToken: string, refreshToken: string, isNewUser: boolean) => {
    try {
      const userInfo = {
        id: 'temp-id',
        email: 'loading...',
        firstName: '',
        lastName: '',
        avatar: '',
        role: 'USER' as const,
      };

      authStorage.save(
        { accessToken, refreshToken },
        userInfo
      );

      const { api } = await import('@/lib/api/axios');
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      queryClient.setQueryData(['auth', 'user'], userInfo);

      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['oauth'] });

      return { success: true, isNewUser };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return { success: false, error };
    }
  };

  return { handleCallback };
};

export const useOAuthProviderInfo = () => {
  const getProviderInfo = (provider: OAuthProvider, t?: (key: string) => string) => ({
    name: oauthService.getProviderDisplayName(provider, t),
    icon: oauthService.getProviderIcon(provider),
    color: oauthService.getProviderColor(provider),
    textColor: oauthService.getProviderTextColor(provider),
  });

  return { getProviderInfo };
};

export const useAvailableOAuthProviders = () => {
  const { data: providerStatus } = useOAuthProviderStatus();
  
  const availableProviders: OAuthProvider[] = [];
  
  if (providerStatus?.google) availableProviders.push('google');
  if (providerStatus?.github) availableProviders.push('github');
  if (providerStatus?.facebook) availableProviders.push('facebook');

  return {
    providers: availableProviders,
    isLoading: !providerStatus,
  };
};

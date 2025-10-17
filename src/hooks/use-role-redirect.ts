import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/lib/react-query/hooks/use-auth';

export const useRoleRedirect = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      const currentPath = window.location.pathname;
      
      if (user.role === 'ADMIN') {
        if (!currentPath.startsWith('/admin')) {
          router.replace('/admin');
        }
      } else {
        if (currentPath.startsWith('/admin')) {
          router.replace('/');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  return {
    isAuthenticated,
    user,
    isLoading,
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER'
  };
};

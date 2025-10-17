'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/lib/react-query/hooks/use-auth';
import { Loader2, Shield, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PrivateRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  requireRole?: 'ADMIN' | 'USER';
  showAccessDenied?: boolean;
}

export function PrivateRoute({ 
  children, 
  fallback,
  redirectTo = '/auth/login',
  requireAuth = true,
  requireRole,
  showAccessDenied = true
}: PrivateRouteProps) {
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  const router = useRouter();

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    React.useEffect(() => {
      router.replace(redirectTo);
    }, [router, redirectTo]);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (requireRole && user?.role !== requireRole) {
    React.useEffect(() => {
      if (user?.role === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }, [router, user]);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {user?.role === 'ADMIN' ? 'Redirecting to admin panel...' : 'Redirecting to home...'}
          </p>
        </div>
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    router.replace('/');
    return null;
  }

  return <>{children}</>;
}

export function withPrivateRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<PrivateRouteProps, 'children'>
) {
  return function PrivateRouteComponent(props: P) {
    return (
      <PrivateRoute {...options}>
        <Component {...props} />
      </PrivateRoute>
    );
  };
}

export function usePrivateRoute(requireAuth = true, requireRole?: 'ADMIN' | 'USER') {
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();
  
  const canAccess = React.useMemo(() => {
    if (isLoading) return { canAccess: false, isLoading: true };
    
    if (requireAuth && !isAuthenticated) return { canAccess: false, isLoading: false };
    
    if (requireRole && user?.role !== requireRole) return { canAccess: false, isLoading: false };
    
    return { canAccess: true, isLoading: false };
  }, [isAuthenticated, user, isLoading, requireAuth, requireRole]);

  return {
    ...canAccess,
    isAuthenticated,
    user,
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER'
  };
}

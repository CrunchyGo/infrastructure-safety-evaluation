'use client';
import React, { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { usePathname, useRouter } from 'next/navigation';

const privateRoutes = ['/'];

const RouterAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (privateRoutes.includes(pathname)) {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [pathname, isAuthenticated]);

  return (
    <>{children}</>
  )
}

export default RouterAuth
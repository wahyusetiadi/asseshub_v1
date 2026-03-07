'use client';

import { useEffect, Suspense } from 'react'; // Tambah Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '@/app/api/services/authService';
import {
  clearSession,
  getHomeRouteByRole,
  setStoredToken,
  setStoredUser,
  type SessionUser,
} from '@/helpers/auth';

// 1. Pindahkan logika utama ke komponen internal ini
function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.replace('/users');
      return;
    }

    const handleLogin = async (token: string) => {
      try {
        setStoredToken(token);
        const meResponse = await authService.getMe();
        const user = meResponse.data as SessionUser;

        setStoredUser(user);
        router.replace(getHomeRouteByRole(user.role));
      } catch (error) {
        console.error(error);
        clearSession();
        router.replace('/users');
      }
    };

    handleLogin(token);
  }, [router, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-sm text-slate-500">
        Memverifikasi akun, mohon tunggu...
      </p>
    </div>
  );
}

// 2. Export utama yang membungkus komponen tadi dengan Suspense
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Memuat...</p>
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}

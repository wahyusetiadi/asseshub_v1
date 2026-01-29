'use client';

import { useEffect, Suspense } from 'react'; // Tambah Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '@/app/api/services/authService';

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
        localStorage.setItem('token', token);
        const meResponse = await authService.getMe();
        const user = meResponse.data;

        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'USER') {
          router.replace('/dashboard');
        } else {
          // Tambahkan fallback redirect jika role bukan USER
          router.replace('/users');
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
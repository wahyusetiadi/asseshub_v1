'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import Topbar from '@/components/Layout/Topbar';
import authService from '@/app/api/services/authService';
import {
  clearSession,
  getHomeRouteByRole,
  getStoredToken,
  isTokenExpired,
  setStoredUser,
  type SessionUser,
} from '@/helpers/auth';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const token = getStoredToken();

      if (!token || isTokenExpired(token)) {
        clearSession();
        router.replace('/users');
        return;
      }

      try {
        const meResponse = await authService.getMe();
        const currentUser = meResponse.data as SessionUser;

        if (currentUser.role !== 'USER') {
          setStoredUser(currentUser);
          router.replace(getHomeRouteByRole(currentUser.role));
          return;
        }

        setStoredUser(currentUser);

        if (!isMounted) return;

        setUser(currentUser);
        setIsCheckingSession(false);
      } catch {
        clearSession();
        router.replace('/users');
      }
    };

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.replace('/users');
  };

  if (isCheckingSession || !user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Memverifikasi sesi pengguna...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col text-black">
        <Topbar
          left={
            <div className="flex items-center gap-2 px-4">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-lg">AssesHub</span>
            </div>
          }
          center={
            <div className="hidden md:block text-gray-500 font-semibold">
              Halaman Persiapan Ujian
            </div>
          }
          right={
            <div className="flex items-center gap-3 px-4">
              <span className="text-sm font-medium text-gray-600">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600"
                title="Keluar"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          }
        />

        <main className="flex-1 p-4 bg-slate-100">{children}</main>
      </div>
    </div>
  );
}

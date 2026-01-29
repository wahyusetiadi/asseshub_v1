'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser } from 'react-icons/fi';
import Topbar from '@/components/Layout/Topbar';

interface UserData {
  id: string;
  username: string;
  role: string;
  position: string;
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.replace('/users');
      return;
    }

    setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/users');
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Memuat data pengguna...
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

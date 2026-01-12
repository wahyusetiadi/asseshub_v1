"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiHome,
  FiBell,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";
import avatar from "@/public/avatar.jpg";
import { SidebarGroup } from "@/helpers/sidebar.helper";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import { useRouter } from "next/navigation";

// 1. Definisikan tipe data agar tidak error 'username does not exist'
interface UserData {
  id: string;
  username: string;
  role: string;
  position: string;
}

export default function LayoutExample({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  
  // 2. State dengan tipe data UserData
  const [user, setUser] = useState<UserData | null>(null);

  const groups: SidebarGroup[] = [
    {
      key: "main",
      title: "Main",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
          icon: <FiHome />,
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user"); // Hapus data saat logout
    router.push("/users");
  };

  // 3. Ambil data HANYA saat komponen pertama kali dimuat
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const parsed: UserData = JSON.parse(data);
        setUser(parsed);
      } catch (error) {
        console.error("Gagal parse data user", error);
      }
    }
  }, []); // Dependency array kosong [] menjamin TIDAK AKAN LOOP

  return (
    <div className="flex">
      <Sidebar
        groups={groups}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        logo={
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600" />
            {!collapsed && <span className="font-semibold text-black">AssesHub</span>}
          </div>
        }
        footer={
          <div className="p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <FiLogOut size={20} />
              {!collapsed && (
                <span className="font-medium text-sm">Keluar</span>
              )}
            </button>
          </div>
        }
      />

      <div className="flex min-h-screen flex-1 flex-col text-black">
        <Topbar
          left={
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <FiMenu />
            </button>
          }
          // 4. Menampilkan username di tengah Topbar
          center={
            <div className="w-full flex items-center justify-center text-center font-semibold text-xl">
               {user ? user.username : "Loading..."}
            </div>
          }
          right={
            <>
              <button
                className="relative inline-flex h-9 w-9 items-center justify-center rounded hover:bg-gray-100"
                aria-label="Notifications"
              >
                <FiBell />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <Image
                src={avatar}
                alt="User avatar"
                className="w-9 h-9 rounded-full object-cover"
                width={36}
                height={36}
              />
            </>
          }
        />

        <main className="flex-1 p-4 bg-slate-100">{children}</main>
      </div>
    </div>
  );
}
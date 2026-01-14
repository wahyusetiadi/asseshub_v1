"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiHome, FiBell, FiMenu, FiLogOut, FiUser } from "react-icons/fi";
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
    localStorage.removeItem("user"); 
    router.push("/users");
  };
  return (
    <div className="flex">
      <div className="flex min-h-screen flex-1 flex-col text-black">
        <Topbar
          left={
            <div className="flex items-center gap-2 px-4">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-bold text-lg tracking-tight">AssesHub</span>
            </div>
          }
          center={
            <div className="w-full text-center hidden md:block text-gray-500 font-semibold">
              Halaman Persiapan Ujian
            </div>
          }
          right={
            <div className="flex items-center gap-3 px-4">
              <div className="flex items-center gap-2">
                <div className="hidden h-9 w-9 rounded-full bg-blue-100 items-center justify-center border border-blue-200">
                  <FiUser className="text-blue-600" size={18} />
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Keluar"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            </div>
          }
        />

        <main className="flex-1 p-4 bg-slate-100">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { SidebarGroup } from "@/helpers/sidebar.helper";
import Image from "next/image";
import { useState } from "react";
import { FiHome, FiBell, FiMenu, FiLogOut } from "react-icons/fi";
import { BiBookAdd, BiBarChartAlt2, BiEnvelope } from "react-icons/bi"; // Icon hasil yang lebih cocok
import { HiOutlineUserGroup } from "react-icons/hi";
import avatar from "@/public/avatar.jpg";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import { useRouter, usePathname } from "next/navigation"; // Gunakan next/navigation untuk App Router

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // Untuk mendeteksi halaman aktif
  const [collapsed, setCollapsed] = useState(false);

  const groups: SidebarGroup[] = [
    {
      key: "main",
      title: "Main Menu",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          href: "/admin-dashboard",
          icon: <FiHome />,
          // Pastikan komponen Sidebar Anda menerima prop 'active' atau menangani href secara internal
        },
        {
          key: "test",
          label: "Manajemen Tes",
          href: "/tests",
          icon: <BiBookAdd />,
        },
        {
          key: "candidates",
          label: "Kandidat",
          href: "/candidates",
          icon: <HiOutlineUserGroup />,
        },
        {
          key: "result",
          label: "Hasil Ujian",
          href: "/results",
          icon: <BiBarChartAlt2 />,
        },
        {
          key: "invitations",
          label: "Kirim Undangan",
          href: "/invitations",
          icon: <BiEnvelope />,
        },
      ],
    },
  ];

  const handleLogout = () => {
    // Tambahkan logic hapus cookie/session jika ada
    router.push("/login");
  };

  return (
    <div className="flex">
      <Sidebar
        groups={groups}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        // Tambahkan logic agar Sidebar tahu link mana yang aktif berdasarkan 'pathname'
        activeKey={pathname}
        logo={
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded bg-blue-600 shrink-0" />
            {!collapsed && (
              <span className="font-bold text-lg tracking-tight">AssesHub</span>
            )}
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
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="text-sm font-semibold text-gray-500 capitalize">
                {pathname.split("/").pop()?.replace("-", " ")}
              </h1>
            </div>
          }
          right={
            <div className="flex items-center gap-3">
              <button
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Notifications"
              >
                <FiBell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-gray-200 mx-1" />
              <div className="flex items-center gap-3 pl-2">
                {!collapsed && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold leading-none">
                      Admin Dante
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Super Admin
                    </p>
                  </div>
                )}
                <Image
                  src={avatar}
                  alt="User avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  width={36}
                  height={36}
                />
              </div>
            </div>
          }
        />

        {/* Gunakan bg-slate-50 atau bg-gray-100 agar kontras dengan card putih */}
        <main className="flex-1 p-6 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

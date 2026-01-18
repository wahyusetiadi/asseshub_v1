"use client";

import { SidebarGroup } from "@/helpers/sidebar.helper";
import Image from "next/image";
import { useState } from "react";
import { FiHome, FiBell, FiMenu, FiLogOut } from "react-icons/fi";
import { BiBookAdd, BiBarChartAlt2, BiEnvelope } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import avatar from "@/public/avatar.jpg";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import { useRouter, usePathname } from "next/navigation";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // md+ only
  const [collapsed, setCollapsed] = useState(false);

  // mobile only
  const [mobileOpen, setMobileOpen] = useState(false);

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
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden">
      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          transform bg-white transition-transform duration-300
          md:static md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          groups={groups}
          collapsed={collapsed}
          activeKey={pathname}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          logo={
            <div className="flex items-center gap-2 px-2">
              <div className="h-8 w-8 rounded bg-blue-600 shrink-0" />
              {!collapsed && (
                <span className="font-bold text-lg tracking-tight">
                  AssesHub
                </span>
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
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-1 flex-col min-w-0 max-w-full">
        <Topbar
          left={
            <div className="flex text-slate-500 items-center gap-2 md:gap-4 min-w-0">
              <button
                type="button"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setMobileOpen(true);
                  } else {
                    setCollapsed((v) => !v);
                  }
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-gray-100 shrink-0"
                aria-label="Toggle sidebar"
              >
                <FiMenu size={20} />
              </button>

              <h1
                className="
                  text-xs md:text-sm font-semibold text-gray-500 capitalize
                  truncate min-w-0
                "
              >
                {pathname.split("/").pop()?.replace("-", " ")}
              </h1>
            </div>
          }
          right={
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              {/* <button
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 shrink-0"
                aria-label="Notifications"
              >
                <FiBell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
              </button> */}

              <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block shrink-0" />

              <div className="flex items-center gap-2 md:gap-3 pl-0 sm:pl-2 min-w-0">
                <div className="text-right hidden lg:block min-w-0 max-w-30">
                  <p className="text-xs font-bold leading-none truncate">
                    Admin Dante
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    Super Admin
                  </p>
                </div>

                <Image
                  src={avatar}
                  alt="User avatar"
                  width={36}
                  height={36}
                  className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border border-gray-200 shrink-0"
                />
              </div>
            </div>
          }
        />

        <main className="flex-1 w-full min-w-0 bg-slate-50 p-3 md:p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
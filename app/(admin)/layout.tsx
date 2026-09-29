"use client";

import { SidebarGroup } from "@/helpers/sidebar.helper";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiHome, FiMenu, FiLogOut } from "react-icons/fi";
import { BiBookAdd, BiBarChartAlt2, BiEnvelope } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import { useRouter, usePathname } from "next/navigation";
import authService from "@/app/api/services/authService";
import {
  clearSession,
  getHomeRouteByRole,
  getStoredToken,
  isTokenExpired,
  setStoredUser,
  type SessionUser,
} from "@/helpers/auth";
import logo from "../../public/logo.png";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

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
    clearSession();
    router.replace("/login");
  };

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const token = getStoredToken();

      if (!token || isTokenExpired(token)) {
        clearSession();
        router.replace("/login");
        return;
      }

      try {
        const meResponse = await authService.getMe();
        const user = meResponse.data as SessionUser;

        if (user.role !== "ADMIN") {
          setStoredUser(user);
          router.replace(getHomeRouteByRole(user.role));
          return;
        }

        setStoredUser(user);

        if (!isMounted) return;

        setCurrentUser(user);
        setIsCheckingSession(false);
      } catch {
        clearSession();
        router.replace("/login");
      }
    };

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, []); // ✅ Ubah dari [router] ke []

  // ✅ PERUBAHAN UTAMA: Layout tetap render, loading hanya di children
  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden bg-slate-50 text-slate-900">
      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          transform border-r border-slate-200 bg-white transition-transform duration-300
          md:static md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          groups={groups}
          collapsed={collapsed}
          currentPath={pathname}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          logo={
            <div className="flex items-center gap-2 px-2">
              <Image
                src={logo}
                alt="Logo"
                width={32}
                height={32}
                className="shrink-0 rounded-lg"
              />
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
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Toggle sidebar"
              >
                <FiMenu size={20} />
              </button>

              <h1
                className="
                  text-xs font-semibold capitalize text-slate-500 md:text-sm
                  truncate min-w-0
                "
              >
                {pathname.split("/").pop()?.replace("-", " ")}
              </h1>
            </div>
          }
          right={
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block shrink-0" />

              <div className="flex items-center gap-2 md:gap-3 pl-0 sm:pl-2 min-w-0">
                <div className="text-right hidden lg:block min-w-0 max-w-30">
                  <p className="text-xs font-bold leading-none truncate">
                    {currentUser?.username || "Loading..."}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    {currentUser?.role || "..."}
                  </p>
                </div>

                <Image
                  src={logo}
                  alt="Logo"
                  width={32}
                  height={32}
                className="shrink-0 rounded-full ring-2 ring-indigo-100"
                />
              </div>
            </div>
          }
        />

        {/* ✅ LOADING STATE HANYA DI CHILDREN */}
        <main className="w-full min-w-0 flex-1 overflow-x-hidden bg-slate-50 p-4 md:p-6 lg:p-8">
          {isCheckingSession || !currentUser ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="mb-4 inline-block h-9 w-9 animate-spin rounded-full border-[3px] border-indigo-600 border-t-transparent"></div>
                <p className="text-sm font-medium text-slate-500">
                  Memverifikasi sesi admin...
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

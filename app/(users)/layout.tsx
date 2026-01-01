"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiHome,
  FiShoppingCart,
  FiUsers,
  FiBell,
  FiSearch,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";
import avatar from "@/public/avatar.jpg";
import { SidebarGroup } from "@/helpers/sidebar.helper";
import Sidebar from "@/components/Layout/Sidebar";
import Topbar from "@/components/Layout/Topbar";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoDocumentTextOutline } from "react-icons/io5";

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
        {
          key: "exam",
          label: "Exam",
          href: "/exam",
          icon: <FaChalkboardTeacher />,
        },
        {
          key: "result_exam",
          label: "Hasil Tes",
          href: "/result-exam",
          icon: <IoDocumentTextOutline />,
        },
      ],
    },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex">
      <Sidebar
        groups={groups}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        logo={
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600" />
            {!collapsed && <span className="font-semibold">AssesHub</span>}
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
          // center={
          //   <div className="relative max-w-md w-full">
          //     <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          //     <input
          //       className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          //       placeholder="Search..."
          //     />
          //   </div>
          // }
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

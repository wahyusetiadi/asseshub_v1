"use client";

import { JSX, useEffect, useState } from "react";
import adminService from "@/app/api/services/adminService";
import examService from "@/app/api/services/examService";

import ParticipationChart from "@/components/Dashboard/ParticipanChart";
import StatCard from "@/components/ui/Card";

import { participationMockData } from "@/mockData/DashboardMock/ParticipationData";
import { recentActivities } from "@/mockData/DashboardMock/RecentActivity";

import { BiCheckCircle } from "react-icons/bi";
import { CgLock } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { RiMvAiLine } from "react-icons/ri";

/* ================= TYPES ================= */

type StatIcon = "users" | "file" | "email" | "check";

interface DynamicStat {
  id: number;
  icon: StatIcon;
  label: string;
  value: number;
  bg: string;
  color: string;
}

/* ================= COMPONENT ================= */

export default function AdminDashboard() {
  /* ===== Icon Map ===== */
  const iconStatsMap: Record<StatIcon, JSX.Element> = {
    users: <FaUsers className="size-4 md:size-6 " />,
    file: <FiFileText className="size-4 md:size-6 " />,
    email: <RiMvAiLine className="size-4 md:size-6 " />,
    check: <BiCheckCircle className="size-4 md:size-6 " />,
  };

  /* ===== State ===== */
  const [totalCandidates, setTotalCandidates] = useState<number>(0);
  const [totalExams, setTotalExams] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  /* ===== Fetch Candidates ===== */
  const fetchCandidates = async () => {
    try {
      const response = await adminService.getAllCandicates();
      const data = response?.data?.data ?? [];
      setTotalCandidates(data.length);
    } catch (error) {
      console.error("Error fetch Candidates:", error);
    }
  };

  /* ===== Fetch Exams ===== */
  const fetchExams = async () => {
    try {
      const response = await examService.getAllExams();
      const data = response?.data?.data ?? [];
      setTotalExams(data.length);
    } catch (error) {
      console.error("Error fetch Exams:", error);
    }
  };

  /* ===== Lifecycle ===== */
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCandidates(), fetchExams()]).finally(() =>
      setLoading(false)
    );
  }, []);

  /* ===== Dynamic Stats ===== */
  const dynamicStats: DynamicStat[] = [
    {
      id: 1,
      icon: "users",
      label: "Total Kandidat",
      value: totalCandidates,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      id: 2,
      icon: "file",
      label: "Total Ujian",
      value: totalExams,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      id: 3,
      icon: "check",
      label: "Ujian Selesai",
      value: 0, // nanti dari endpoint result
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      id: 4,
      icon: "email",
      label: "Undangan Terkirim",
      value: 0, // placeholder
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 px-6 py-7 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-9">
        <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-14 h-44 w-44 rounded-full border border-white/10" />
        <div className="relative">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">Admin workspace</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Selamat Datang, Admin
        </h1>
        <p className="mt-2 text-sm text-indigo-100 md:text-base">
          Berikut adalah ringkasan performa rekrutmen AssessHub hari ini.
        </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {dynamicStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={iconStatsMap[stat.icon]}
            label={stat.label}
            value={String(loading ? "..." : stat.value)}
            bg={stat.bg}
            color={stat.color}
            showGrowth={false}
          />
        ))}
      </div>

      {/* Chart & Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <ParticipationChart data={participationMockData} />

        <div className="hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="mb-6 font-bold tracking-tight text-slate-900">Aktivitas Terbaru</h3>

          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                </div>

                <div>
                  <p className="text-sm text-gray-800 font-medium leading-none mb-1">
                    {activity.user}{" "}
                    <span className="font-normal text-gray-500">
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <CgLock size={12} /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-2 text-sm text-blue-600 font-semibold border border-blue-100 rounded-xl hover:bg-blue-50 transition">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
}

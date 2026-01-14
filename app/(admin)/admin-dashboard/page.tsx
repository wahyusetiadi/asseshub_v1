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
    users: <FaUsers size={24} />,
    file: <FiFileText size={24} />,
    email: <RiMvAiLine size={24} />,
    check: <BiCheckCircle size={24} />,
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Selamat Datang, Admin
        </h1>
        <p className="text-gray-500">
          Berikut adalah ringkasan performa rekrutmen AssessHub hari ini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={iconStatsMap[stat.icon]}
            label={stat.label}
            value={String(loading ? "..." : stat.value)}
            bg={stat.bg}
            color={stat.color}
            showGrowth
          />
        ))}
      </div>

      {/* Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ParticipationChart data={participationMockData} />

        <div className="hidden bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Aktivitas Terbaru</h3>

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

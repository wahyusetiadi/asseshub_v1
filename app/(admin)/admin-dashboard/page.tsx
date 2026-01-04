"use client";
import ParticipationChart from "@/components/Dashboard/ParticipanChart";
import StatCard from "@/components/ui/Card";
import { participationMockData } from "@/mockData/DashboardMock/ParticipationData";
import { recentActivities } from "@/mockData/DashboardMock/RecentActivity";
import { stats } from "@/mockData/DashboardMock/Stats";
import { BiCheckCircle } from "react-icons/bi";
import { CgLock } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { RiMvAiLine } from "react-icons/ri";

export default function AdminDashboard() {
  const iconStatsMap = {
    users: <FaUsers size={24} />,
    file: <FiFileText size={24} />,
    email: <RiMvAiLine size={24} />,
    check: <BiCheckCircle size={24} />,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Selamat Datang, Admin
        </h1>
        <p className="text-gray-500">
          Berikut adalah ringkasan performa rekrutmen AssessHub hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={iconStatsMap[stat.icon]}
            label={stat.label}
            value={stat.value}
            bg={stat.bg}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ParticipationChart data={participationMockData} />
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
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

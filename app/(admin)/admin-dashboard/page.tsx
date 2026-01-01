"use client";
import React from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { BsArrowUpRight } from 'react-icons/bs';
import { CgLock } from 'react-icons/cg';
import { FaUsers } from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';
import { RiMvAiLine } from 'react-icons/ri';

export default function AdminDashboard() {
  // Mock Data untuk Statistik
  const stats = [
    { id: 1, label: 'Total Kandidat', value: '1,240', icon: <FaUsers size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, label: 'Tes Aktif', value: '12', icon: <FiFileText size={24} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 3, label: 'Email Terkirim', value: '1,180', icon: <RiMvAiLine size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 4, label: 'Lulus Seleksi', value: '856', icon: <BiCheckCircle size={24} />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  // Mock Data untuk Aktivitas Terbaru
  const recentActivities = [
    { id: 1, user: 'Dante', action: 'Baru saja menyelesaikan Tes Frontend', time: '2 menit yang lalu' },
    { id: 2, user: 'Admin System', action: 'Mengirim 50 email kredensial', time: '1 jam yang lalu' },
    { id: 3, user: 'Ahmad', action: 'Gagal login (Salah Password)', time: '2 jam yang lalu' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Admin</h1>
        <p className="text-gray-500">Berikut adalah ringkasan performa rekrutmen AssessHub hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="flex items-center text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-lg">
                <BsArrowUpRight size={14} /> 12%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder (Visual Sederhana) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Grafik Partisipasi Tes</h3>
            <select className="text-sm border rounded-lg px-3 py-1 outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          {/* Visualisasi batang sederhana menggunakan Tailwind */}
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer" 
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[10px] text-gray-400 font-medium">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
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
                    {activity.user} <span className="font-normal text-gray-500">{activity.action}</span>
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
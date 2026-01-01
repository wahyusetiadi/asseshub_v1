"use client";
import React, { useState } from 'react';
import { BiDownload, BiFilter, BiSearch, BiTrophy } from 'react-icons/bi';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function ResultsPage() {
  // Mock Data Hasil Ujian
  const results = [
    { id: 1, name: 'Dante Rodriguez', email: 'dante@example.com', test: 'Frontend Dev', score: 92, status: 'Lulus' },
    { id: 2, name: 'Siti Aminah', email: 'siti@example.com', test: 'Frontend Dev', score: 78, status: 'Lulus' },
    { id: 3, name: 'Budi Cahyono', email: 'budi@example.com', test: 'UI/UX Design', score: 45, status: 'Gagal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hasil Ujian</h1>
          <p className="text-sm text-gray-500">Pantau nilai dan performa kandidat secara real-time.</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm shadow-sm">
          <BiDownload size={18} /> Ekspor Excel
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex-1 min-w-50 relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Cari kandidat..." className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="px-4 py-2 border rounded-lg bg-white text-sm text-gray-600 outline-none">
          <option>Semua Ujian</option>
          <option>Frontend Dev</option>
          <option>UI/UX Design</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
          <BiFilter size={16} /> Filter Skor
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <th className="px-6 py-4 text-center w-16">Peringkat</th>
              <th className="px-6 py-4">Kandidat</th>
              <th className="px-6 py-4">Nama Ujian</th>
              <th className="px-6 py-4">Skor Akhir</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm text-gray-700">
            {results.map((res, index) => (
              <tr key={res.id} className="hover:bg-blue-50/50 transition">
                <td className="px-6 py-4 text-center font-bold text-gray-400">
                  {index === 0 ? <BiTrophy size={18} className="text-yellow-500 mx-auto" /> : `#${index + 1}`}
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{res.name}</p>
                  <p className="text-xs text-gray-500">{res.email}</p>
                </td>
                <td className="px-6 py-4">{res.test}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-bold">
                    <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${res.score > 70 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${res.score}%` }}></div>
                    </div>
                    {res.score}/100
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${res.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {res.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-blue-600">
                  <button className="hover:underline flex items-center gap-1 font-semibold">
                    Analisis <FaExternalLinkAlt size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
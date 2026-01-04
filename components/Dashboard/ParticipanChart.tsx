"use client";

import { ParticipationData } from "@/mockData/DashboardMock/ParticipationData";
import React from "react";

type ParticipationChartProps = {
  title?: string;
  data: ParticipationData[];
};

const ParticipationChart: React.FC<ParticipationChartProps> = ({
  title = "Grafik Partisipasi Tes",
  data,
}) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">{title}</h3>

        <select className="text-sm border rounded-lg px-3 py-1 outline-none">
          <option>7 Hari Terakhir</option>
          <option>30 Hari Terakhir</option>
        </select>
      </div>

      {/* Bar chart sederhana */}
      <div className="flex items-end justify-between h-48 gap-2 pt-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer"
              style={{ height: `${item.value * 1.6}px` }} // 40 -> 64px
            />
            <span className="text-[10px] text-gray-400 font-medium">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipationChart;

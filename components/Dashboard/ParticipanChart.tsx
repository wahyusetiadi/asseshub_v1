"use client";

import { ParticipationData } from "@/mockData/DashboardMock/ParticipationData";
import React from "react";
import SelectField from "../ui/SelectField";

type ParticipationChartProps = {
  title?: string;
  data: ParticipationData[];
};

const ParticipationChart: React.FC<ParticipationChartProps> = ({
  title = "Grafik Partisipasi Tes",
  data,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold tracking-tight text-slate-900">{title}</h3>

        <select className="hidden text-sm border-slate-300 border rounded-md px-3 py-1 outline-none">
          <option>7 Hari Terakhir</option>
          <option>30 Hari Terakhir</option>
        </select>
      </div>

      {/* Bar chart sederhana */}
      <div className="flex items-end justify-between h-48 gap-2 pt-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full cursor-pointer rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all hover:from-indigo-700 hover:to-violet-500"
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

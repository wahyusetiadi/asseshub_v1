"use client";
import React from "react";
import { BsCalendar } from "react-icons/bs";

interface SchedulePickerProps {
  scheduleDate: string;
  scheduleTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export default function SchedulePicker({
  scheduleDate,
  scheduleTime,
  onDateChange,
  onTimeChange,
}: SchedulePickerProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <BsCalendar size={14} />
        Jadwal Mulai Test (Opsional)
      </label>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Waktu</label>
          <input
            type="time"
            value={scheduleTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Kosongkan jika ingin mengirim undangan segera
      </p>
    </div>
  );
}
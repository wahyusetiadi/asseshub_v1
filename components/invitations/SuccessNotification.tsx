"use client";
import React from "react";
import { BiCheckCircle } from "react-icons/bi";

interface SuccessNotificationProps {
  show: boolean;
  candidatesCount: number;
}

export default function SuccessNotification({
  show,
  candidatesCount,
}: SuccessNotificationProps) {
  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
      <BiCheckCircle size={24} />
      <div>
        <p className="font-semibold">Email Undangan Berhasil Dikirim!</p>
        <p className="text-sm opacity-90">
          {candidatesCount} kandidat telah menerima undangan
        </p>
      </div>
    </div>
  );
}
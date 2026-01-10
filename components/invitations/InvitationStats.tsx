"use client";
import React from "react";
import { Candidate } from "@/types/candidateTypes";

interface InvitationStatsProps {
  candidates: Candidate[];
}

export default function InvitationStats({ candidates }: InvitationStatsProps) {
  const totalCandidates = candidates.length;
  const sentCount = candidates.filter(
    (c) => c.status === "sent" || c.status === "opened"
  ).length;
  const pendingCount = candidates.filter(
    (c) => !c.status || c.status === "pending"
  ).length;

  return (
    <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-6">
      <h4 className="font-semibold mb-4 opacity-90">Statistik Undangan</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">Total Kandidat</span>
          <span className="text-2xl font-bold">{totalCandidates}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">Sudah Dikirim</span>
          <span className="text-2xl font-bold">{sentCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">Belum Dikirim</span>
          <span className="text-2xl font-bold">{pendingCount}</span>
        </div>
      </div>
    </div>
  );
}
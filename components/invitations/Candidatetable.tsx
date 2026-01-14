"use client";
import React from "react";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Candidate } from "@/types/candidateTypes";

interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: string[];
  onSelectCandidate: (id: string) => void;
  onSelectAll: () => void;
  isLoading?: boolean;
}

export default function CandidateTable({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  isLoading = false,
}: CandidateTableProps) {
  const getStatusBadge = (status?: Candidate["status"]) => {
    if (!status) return "bg-gray-100 text-gray-700";
    
    const styles = {
      pending: "bg-gray-100 text-gray-700",
      sent: "bg-blue-100 text-blue-700",
      opened: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
    };
    return styles[status];
  };

  const getStatusLabel = (status?: Candidate["status"]) => {
    if (!status) return "Belum Dikirim";
    
    const labels = {
      pending: "Belum Dikirim",
      sent: "Terkirim",
      opened: "Dibuka",
      completed: "Selesai",
    };
    return labels[status];
  };

  const columns: Column<Candidate>[] = [
    {
      key: "checkbox",
      label: "",
      render: (candidate) => (
        <input
          type="checkbox"
          checked={selectedCandidates.includes(candidate.id)}
          onChange={() => onSelectCandidate(candidate.id)}
          className="w-4 h-4 text-blue-600 rounded"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: "name",
      label: "Nama Kandidat",
      render: (candidate) => (
        <span className="font-medium text-gray-900">{candidate.name}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (candidate) => (
        <span className="text-gray-600">{candidate.email}</span>
      ),
    },
    {
      key: "position",
      label: "Posisi",
      render: (candidate) => (
        <span className="text-gray-500">{candidate.position}</span>
      ),
    },
    // {
    //   key: "status",
    //   label: "Status",
    //   render: (candidate) => (
    //     <span
    //       className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
    //         candidate.status
    //       )}`}
    //     >
    //       {getStatusLabel(candidate.status)}
    //     </span>
    //   ),
    // },
  ];

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={
              selectedCandidates.length === candidates.length &&
              candidates.length > 0
            }
            onChange={onSelectAll}
            className="w-4 h-4 text-blue-600 rounded"
            disabled={isLoading}
          />
          <span className="text-sm font-semibold text-gray-700">
            {selectedCandidates.length > 0
              ? `${selectedCandidates.length} kandidat dipilih`
              : "Pilih kandidat"}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {candidates.length} total kandidat
        </span>
      </div>

      <div className="overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={candidates} 
          isLoading={isLoading}
          emptyMessage="Tidak ada kandidat ditemukan"
        />
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import ConfirmEmailModal from "@/components/candidates/ComfirmEmailModal";
import Link from "next/link";
import {
  BiCheckCircle,
  BiSearch,
  BiUpload,
  BiUserPlus,
  BiEdit,
  BiTrash,
} from "react-icons/bi";
import { Candidate } from "@/types/api";
import { api } from "@/helpers/lib/api";
import adminService from "@/app/api/services/adminService";
import DataTable, { Column } from "@/components/ui/DataTable";
import { BsEye } from "react-icons/bs";

const getStatusBadge = (status: Candidate["status"]) => {
  const styles: Record<NonNullable<Candidate["status"]>, string> = {
    pending: "bg-amber-100 text-amber-700",
    sent: "bg-blue-100 text-blue-700",
    opened: "bg-green-100 text-green-700",
    completed: "bg-purple-100 text-purple-700",
  };

  if (!status) {
    return "bg-gray-100 text-gray-500";
  }

  return styles[status];
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState(""); // ✅ Tambahkan error state

  // Fetch candidates on mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(""); // ✅ Reset error

    try {
      const response = await adminService.getAllCandicates();
      if (response.data) {
        console.log("Candidates data:", response.data);
        setCandidates(response.data.data);
      } else {
        console.warn("No data in response:", response);
        setCandidates([]);
        setError(response.message || "Gagal mengambil data kandidat");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Terjadi kesalahan saat mengambil data");
      setCandidates([]); // ✅ Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCandidates();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kandidat ini?")) return;

    try {
      const response = await api.deleteCandidate(id);
      if (response.success) {
        setCandidates(candidates.filter((c) => c.id !== id));
        alert("Kandidat berhasil dihapus");
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Gagal menghapus kandidat");
    }
  };

  const handleSendEmails = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsModalOpen(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    }, 2000);
  };

  const columns: Column<Candidate>[] = [
    {
      key: "name",
      label: "Nama Kandidat",
      render: (c) => (
        <span className="font-medium text-gray-900">{c.name}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "username",
      label: "Username",
      render: (c) => <span className="font-mono text-xs">{c.username}</span>,
    },
    {
      key: "position",
      label: "Posisi",
      render: (c) => c.position || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (c) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(
            c.status
          )}`}
        >
          {c.status || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      align: "center",
      render: (c) => (
        <div className="flex items-center justify-center gap-2">
          {/* Detail */}
          <Link
            href={`/candidates/${c.id}`}
            title="Lihat Detail"
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
          >
            <BsEye size={16} />
          </Link>

          {/* Edit */}
          <Link
            href={`/candidates/${c.id}/edit`}
            title="Edit Kandidat"
            className="p-2 rounded hover:bg-blue-50 text-blue-600"
          >
            <BiEdit size={16} />
          </Link>

          {/* Delete */}
          <button
            title="Hapus Kandidat"
            onClick={() => handleDelete(c.id)}
            className="p-2 rounded hover:bg-red-50 text-red-600"
          >
            <BiTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi Sukses */}
      {sentSuccess && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce z-50">
          <BiCheckCircle size={20} /> Email Berhasil Dikirim ke Semua Kandidat!
        </div>
      )}

      {/* ✅ Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Data Kandidat</h1>
          <p className="text-sm text-gray-500">
            Kelola akun dan akses ujian mereka.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/candidates/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            <BiUserPlus size={18} />
            Tambah Kandidat
          </Link>

          <Link
            href="/candidates/import"
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            <BiUpload size={18} />
            Import CSV
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative hidden">
        <BiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Cari nama atau email..."
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading...
          </div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Tidak ada data kandidat</p>
            {/* ✅ Debug info */}
            <p className="text-xs text-gray-400 mt-2">
              Buka Console (F12) untuk melihat detail error
            </p>
          </div>
        ) : (
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={candidates}
              isLoading={isLoading}
              emptyMessage="Tidak ada data kandidat"
            />
          </div>
        )}
      </div>

      <ConfirmEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSendEmails}
        count={candidates.length}
        isSending={isSending}
      />
    </div>
  );
}

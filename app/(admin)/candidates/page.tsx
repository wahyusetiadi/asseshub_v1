// app/(admin)/candidates/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BiCheckCircle, BiUpload } from "react-icons/bi";
import adminService from "@/app/api/services/adminService";
import DataTable from "@/components/ui/DataTable";
import CreateCandidateModal from "@/components/candidates/CreateModal";
import Button from "@/components/ui/Button";
import CandidateDetailModal from "@/components/candidates/DetailModal";
import CandidateStats from "@/components/candidates/CandidateState";
import { CreateCandidateColumns } from "@/components/candidates/CandidateColumns";
import CandidateEditModal from "@/components/candidates/EditModal";
import { Candidate } from "@/types/candidateTypes";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  // Fetch candidates on mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await adminService.getAllCandicates();

      console.log("API Response:", response);

      // Handle different response structures
      let candidatesData: Candidate[] = [];

      if (response?.data?.data) {
        candidatesData = response.data.data;
      } else if (response?.data) {
        candidatesData = Array.isArray(response.data) ? response.data : [];
      }

      setCandidates(candidatesData);

      if (candidatesData.length === 0) {
        console.warn("No candidates found");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Terjadi kesalahan saat mengambil data kandidat");
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kandidat ini?")) return;

    try {
      // TODO: Implement delete API
      // await adminService.deleteCandidate(id);

      setCandidates(candidates.filter((c) => c.id !== id));
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Gagal menghapus kandidat");
    }
  };

  const handleDetail = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (candidateId: string) => {
    // Cari data kandidat berdasarkan ID
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsEditModal(true);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedCandidateId(null);
  };

  const handleCloseEdit = () => {
    setIsEditModal(false);
    setSelectedCandidate(null);
  };

  const handleSuccess = () => {
    fetchCandidates();
  };

  const columns = CreateCandidateColumns({
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      {sentSuccess && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce z-50">
          <BiCheckCircle size={20} /> Berhasil!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <Button
            title="Coba Lagi"
            onClick={fetchCandidates}
            variant="destructive"
          />
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Kandidat</h1>
          <p className="text-sm text-gray-500">
            Kelola akun dan akses ujian kandidat
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            title="Generate Account"
            variant="primary"
            onClick={() => setCreateModal(true)}
          />

          <Link
            href="/candidates/import"
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            <BiUpload size={18} />
            Import CSV
          </Link>
        </div>
      </div>

      <CandidateStats candidates={candidates} />

      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={candidates}
          isLoading={isLoading}
          emptyMessage="Belum ada kandidat. Klik 'Generate Account' untuk membuat akun baru."
        />
      </div>

      <CreateCandidateModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={handleSuccess}
      />

      <CandidateDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        candidateId={selectedCandidateId}
      />

      <CandidateEditModal
        isOpen={isEditModal}
        onClose={handleCloseEdit}
        onSuccess={handleSuccess}
        candidate={selectedCandidate}
      />
    </div>
  );
}
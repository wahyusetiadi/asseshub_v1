"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiCheckCircle, BiUpload } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";

import adminService from "@/app/api/services/adminService";
import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import CreateCandidateModal from "@/components/candidates/CreateModal";
import CandidateDetailModal from "@/components/candidates/DetailModal";
import CandidateEditModal from "@/components/candidates/EditModal";
import CandidateStats from "@/components/candidates/CandidateState";
import { CreateCandidateColumns } from "@/components/candidates/CandidateColumns";
// import { Candidate } from "@/types/candidateTypes";
import Alert from "@/components/ui/Alert";
import DeleteCandidateModal from "@/components/candidates/DeleteModal";
import { useAlert } from "@/hooks/useAlert";
import { CandidateApi } from "@/types";




export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState("");

  const [createModal, setCreateModal] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateApi | null>(null);

  const { alert, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await adminService.getAllCandicates();
      const data =
        response?.data?.data ??
        (Array.isArray(response?.data) ? response.data : []);

      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengambil data kandidat");
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedCandidateId(id);
    setIsDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCandidateId) return;

    try {
      await adminService.deleteAccount(selectedCandidateId);

      setCandidates((prev) => prev.filter((c) => c.id !== selectedCandidateId));

      showAlert({
        variant: "success",
        title: "Berhasil",
        message: "Kandidat berhasil dihapus",
      });
    } catch (error) {
      showAlert({
        variant: "error",
        title: "Gagal",
        message: "Gagal menghapus kandidat",
      });
    } finally {
      setIsDeleteModal(false);
      setSelectedCandidateId(null);
    }
  };

  const handleDetail = (id: string) => {
    setSelectedCandidateId(id);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsEditModal(true);
    }
  };

  const columns = CreateCandidateColumns({
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="w-full space-y-6 max-w-full overflow-x-auto">
      {/* SUCCESS TOAST */}
      {sentSuccess && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white shadow-2xl">
          <BiCheckCircle size={20} />
          Berhasil!
        </div>
      )}
      {alert.show && (
        <div className="fixed top-5 right-5 z-9999">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            onClose={closeAlert}
            className="w-90"
          />
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between w-full max-w-full min-w-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Kandidat</h1>
          <p className="text-sm text-gray-500">
            Kelola akun dan akses ujian kandidat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            leftIcon={<FaPlus />}
            title="Tambah Akun"
            variant="primary"
            onClick={() => setCreateModal(true)}
            // onClick={openCreate}
          />

          <Link
            href="/candidates/import"
            className="hidden md:flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            <BiUpload size={18} />
            Import CSV
          </Link>
        </div>
      </div>

      <CandidateStats candidates={candidates} />

      {/* TABLE WRAPPER (INI KUNCI) */}
      <div className="rounded-lg bg-white shadow-sm overflow-x-auto max-w-full">
        <DataTable
          columns={columns}
          data={candidates}
          isLoading={isLoading}
          emptyMessage="Belum ada kandidat."
        />
      </div>

      {/* MODALS */}
      <CreateCandidateModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={(msg) => {
          showAlert({
            variant: "success",
            title: "Berhasil",
            message: msg,
          });
          fetchCandidates();
        }}
        onError={(msg) => {
          showAlert({
            variant: "error",
            title: "Gagal",
            message: msg,
          });
        }}
      />

      <CandidateDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        candidateId={selectedCandidateId}
      />

      <DeleteCandidateModal
        isOpen={isDeleteModal}
        onClose={() => {
          setIsDeleteModal(false);
          setSelectedCandidateId(null);
        }}
        onSuccess={handleConfirmDelete}
      />

      <CandidateEditModal
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        onSuccess={fetchCandidates}
        candidate={selectedCandidate}
      />
    </div>
  );
}
